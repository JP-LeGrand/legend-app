export interface OrderItem {
    orderItemId?: string;
    productId?: string; // GUID
    productName: string;
    quantity: number;
    price: number;
  }