import { User } from "./user.types";

export type OrderStatus = 
  | "PENDING"
  | "ROUTING"
  | "BUILDING"
  | "SUBMITTED"
  | "CONFIRMED"
  | "FAILED";

export type Order = {
    id: string;
    tokenIn: string;
    tokenOut: string;
    amount: number;
    status: OrderStatus;
    selectedDex?: string | null;
    executedPrice?: number | null;
    txHash?: string | null;
    errorReason?: string | null;
    userId: string;
    user: User;
    createdAt: Date;
    updatedAt: Date;
}

export type CreatedOrder = {
  tokenIn: string;
  tokenOut: string;
  amount: number;
  userId: string;
}