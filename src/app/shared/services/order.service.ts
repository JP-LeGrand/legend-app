import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { PaymentData } from "../classes/payment-data";
import * as CryptoJS from "crypto-js";
import { HttpClient } from "@angular/common/http";
import { Order } from "../classes/order";
import { environment } from "src/environments/environment";
import { environment as prod_environment } from "src/environments/environment.prod";
import { environment_variables } from "src/environments/env-variables";
const state = {
  checkoutItems: JSON.parse(localStorage["checkoutItems"] || "[]"),
};

@Injectable({
  providedIn: "root",
})
export class OrderService {
  passPhrase: string = "";
  paymentUrl: string = "";
  apiUrl: string ="";
  public paymentData: PaymentData = {};

  constructor(private http: HttpClient, private router: Router) {
    this.passPhrase = environment_variables.isLive
      ? "FrankincenseLegend001"
      : "FrankincenseLegend";

    this.apiUrl = environment_variables.isLive? prod_environment.apiUrl : environment.apiUrl;
  }

  // Get Checkout Items
  public get checkoutItems(): Observable<any> {
    const itemsStream = new Observable((observer) => {
      observer.next(state.checkoutItems);
      observer.complete();
    });
    return <Observable<any>>itemsStream;
  }

  // Create order
  public createOrder(product: any, details: any, orderId: any, amount: any) {
    var item = {
      shippingDetails: details,
      product: product,
      orderId: orderId,
      totalAmount: amount,
    };
    state.checkoutItems = item;
    localStorage.setItem("checkoutItems", JSON.stringify(item));
    localStorage.removeItem("cartItems");
    this.router.navigate(["/shop/checkout/success", orderId]);
  }

  public generateSignature(data: PaymentData): string {
    // Create parameter string
    let pfOutput = "";
    for (let key in data) {
      let dataV = data[key as keyof typeof data] as string;
      if (data.hasOwnProperty(key)) {
        if (dataV !== "") {
          pfOutput += `${key}=${encodeURIComponent(dataV.trim()).replace(
            /%20/g,
            "+"
          )}&`;
        }
      }
    }

    // Remove last ampersand
    let getString = pfOutput.slice(0, -1);
    if (this.passPhrase !== null) {
      getString += `&passphrase=${encodeURIComponent(
        this.passPhrase.trim()
      ).replace(/%20/g, "+")}`;
    }

    return CryptoJS.MD5(getString).toString();
  }

  placeOrder(order: Order) {
    return this.http.post(`${this.apiUrl}/order/place-order`, order);
  }

  getAllUserOrders() {
    return this.http.get<Order[]>(`${this.apiUrl}/order`);
  }
}
