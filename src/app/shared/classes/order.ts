import { OrderItem } from "./orderItem";
import { Product } from "./product";
import { ShippingDetails } from "./shippingDetails";

// Order
export interface Order {
  orderId?: string;
  userId?: string;
  orderDate?: string;
  shippingDetails?: ShippingDetails;
  totalAmount?: number;
  orderItems?: OrderItem[];
  status?: OrderStatus;
}

export enum OrderStatus {
  NotSet = 0,
  Pending = 1,
  Processing = 2,
  Shipped = 3,
  Delivered = 4,
  Cancelled = 5
}
