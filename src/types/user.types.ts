import { Order } from "./order.types";

export type User = {
    id: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    order?: Order[];
    createdAt: Date;
    updatedAt: Date;
  };