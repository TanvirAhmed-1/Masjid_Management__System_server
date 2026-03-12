export type TAccessoryPurchase = {
  itemName: string;
  quantity: number;
  price: number;
  totalPrice: number;
  purchaseDate?: Date;
  description?: string;
  paymentReceipt?: string;
  memberName?: string;
  mosqueId: string;
  userId: string;
};