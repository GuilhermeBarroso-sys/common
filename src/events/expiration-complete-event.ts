import { Subjects } from "./subjects";
import { OrderStatus } from "./types/order-status";


export interface ExpirationCompleteEvent {
  subject: Subjects.expirationComplete;
  data: {
    orderId: string,
  }
}