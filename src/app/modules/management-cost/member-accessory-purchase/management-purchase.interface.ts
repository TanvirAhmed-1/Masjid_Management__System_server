export interface IMemberAccessoryPurchase {
  id?: string;
  userId: string;
  itemName: string;
  quantity: number;
  price: number;
  totalPrice: number;
  purchaseDate?: Date;
  description?: string;
  paymentReceipt?: string;
  memberName?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
