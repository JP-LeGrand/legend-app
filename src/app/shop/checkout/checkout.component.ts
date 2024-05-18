import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
} from "@angular/forms";
import { Observable, first } from "rxjs";
import { Product } from "../../shared/classes/product";
import { ProductService } from "../../shared/services/product.service";
import { OrderService } from "../../shared/services/order.service";
import { PaymentData } from "src/app/shared/classes/payment-data";
import { PaymentUuid } from "src/app/shared/classes/payment-uuid";
import { AccountService } from "src/app/shared/services/account.service";
import { User } from "src/app/shared/classes/user";
import { Address } from "src/app/shared/classes/address";

@Component({
  selector: "app-checkout",
  templateUrl: "./checkout.component.html",
  styleUrls: ["./checkout.component.scss"],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CheckoutComponent implements OnInit {
  @ViewChild("form") form: ElementRef;

  public checkoutForm: UntypedFormGroup;
  public products: Product[] = [];
  public paymentData: PaymentData = {};
  public payment: string = "Stripe";
  public amount: any;
  isLive: boolean = true;
  paymentUuid: PaymentUuid = {};
  public paymentUrl: string = "";
  user: User;
  deliveryAddress: Address;

  constructor(
    private zone: NgZone,
    private fb: UntypedFormBuilder,
    public productService: ProductService,
    private orderService: OrderService,
    private accountService: AccountService
  ) {
    this.user = this.accountService.userValue;

    this.checkoutForm = this.fb.group({
      firstname: [
        "",
        [
          Validators.required,
          Validators.pattern("[a-zA-Z][a-zA-Z ]+[a-zA-Z]$"),
        ],
      ],
      lastname: [
        "",
        [
          Validators.required,
          Validators.pattern("[a-zA-Z][a-zA-Z ]+[a-zA-Z]$"),
        ],
      ],
      phone: ["", [Validators.required, Validators.pattern("[0-9]+")]],
      email: ["", [Validators.required, Validators.email]],
      address: ["", [Validators.required, Validators.maxLength(50)]],
      country: ["", Validators.required],
      town: ["", Validators.required],
      state: ["", Validators.required],
      postalcode: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    this.productService.cartItems.subscribe(
      (response) => (this.products = response)
    );

    this.accountService
      .getAllAddresses()
      .pipe(first())
      .subscribe((addresses) => {
        this.deliveryAddress = addresses[0];
        this.prefillUserDetails();
      });

    this.prefillUserDetails();

    this.getTotal.subscribe((amount) => (this.amount = amount));
    this.paymentUrl = this.isLive
      ? "https://www.payfast.co.za/eng/process"
      : "https://sandbox.payfast.co.za​/eng/process";
  }

  public prefillUserDetails(): void {
    if (this.user) {
      let address: string,
        country: string,
        town: string,
        state: string,
        postalcode: string;

      if (this.deliveryAddress) {
        (address = this.deliveryAddress?.streetAddress),
          (country = this.deliveryAddress?.country),
          (town = this.deliveryAddress?.city),
          (state = this.deliveryAddress?.province),
          (postalcode = this.deliveryAddress?.postalCode);
      }

      this.checkoutForm.patchValue({
        firstname: this.user?.firstName,
        lastname: this.user?.lastName,
        phone: this.user?.phoneNumber,
        email: this.user?.emailAddress,
        address: address,
        country: country,
        town: town,
        state: state,
        postalcode: postalcode,
      });
    }
  }

  public get getTotal(): Observable<number> {
    return this.productService.cartTotalAmount();
  }

  // Place order
  setUpPymentData(event: Event) {
    event.preventDefault();
    this.zone.run(() => {
      this.paymentData.merchant_id = this.isLive ? "22753341" : "10030211";
      this.paymentData.merchant_key = this.isLive
        ? "lqacaxyuh0vwq"
        : "z6pd3bo7kvncn";
      this.paymentData.return_url =
        "https://legendsparfumerie.com/pages/order/success";
      this.paymentData.cancel_url =
        "https://legendsparfumerie.com/shop/checkout";
      this.paymentData.notify_url =
        "https://cae8-41-216-202-98.ngrok-free.app/payfast";
      this.paymentData.email_address = this.checkoutForm.value.email;
      this.paymentData.amount = this.isLive ? "5" : `${this.amount}`;
      this.paymentData.item_name = `${this.products[0]?.brand}`;
      this.paymentData.email_confirmation = `1`;
      this.paymentData.confirmation_address = this.checkoutForm.value.email;
      this.paymentData.signature = this.orderService.generateSignature(
        this.paymentData
      );
    });

    setTimeout(() => {
      this.form.nativeElement.submit();
    }, 0);
  }
}
