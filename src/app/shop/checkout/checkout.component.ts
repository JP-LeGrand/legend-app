import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Product } from "../../shared/classes/product";
import { ProductService } from "../../shared/services/product.service";
import { OrderService } from "../../shared/services/order.service";
import { PaymentData } from 'src/app/shared/classes/payment-data';
import { PaymentUuid } from 'src/app/shared/classes/payment-uuid';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  public checkoutForm: UntypedFormGroup;
  public products: Product[] = [];
  public paymentData: PaymentData = {};
  public payment: string = 'Stripe';
  public amount: any;
  isLive: boolean = true;
  paymentUuid: PaymentUuid = {};

  constructor(private fb: UntypedFormBuilder,
    public productService: ProductService,
    private orderService: OrderService) {
    this.checkoutForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      lastname: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      phone: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.maxLength(50)]],
      country: ['', Validators.required],
      town: ['', Validators.required],
      state: ['', Validators.required],
      postalcode: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.productService.cartItems.subscribe(response => this.products = response);
    this.getTotal.subscribe(amount => this.amount = amount);
  }

  public get getTotal(): Observable<number> {
    return this.productService.cartTotalAmount();
  }
  
  // Place order
  onsitePayment(uuid: string) {
    (<any>window).payfast_do_onsite_payment({
      uuid
    });
  }
  
  generatePaymentIdentifier(): PaymentUuid {
    this.setUpPymentData();
    this.paymentData.signature = this.orderService.generateSignature(this.paymentData);
    this.orderService.getUuid(this.paymentData).subscribe(
      {
        next: response => this.onsitePayment(response?.uuid),
        error: error => error
      }
    );

    return this.paymentUuid;
  }

  setUpPymentData(): PaymentData {
    this.paymentData.merchant_id = this.isLive ? '22753341' : '10030211';
    this.paymentData.merchant_key = this.isLive ? 'lqacaxyuh0vwq' : 'z6pd3bo7kvncn';
    this.paymentData.return_url = 'https://legend-parfumerie.azurewebsites.net/pages/order/success';
    this.paymentData.cancel_url = 'https://legend-parfumerie.azurewebsites.net/shop/checkout';
    this.paymentData.notify_url =
      'https://cae8-41-216-202-98.ngrok-free.app/payfast';
    this.paymentData.email_address = this.checkoutForm.value.email;
    this.paymentData.amount = `${this.amount}`;
    this.paymentData.item_name = `${this.products[0]?.brand}`;

    return this.paymentData;
  }
}
