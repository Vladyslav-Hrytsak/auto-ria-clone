import { OrderEnum } from "../enums/order.enum";
import { UserOrderByEnum } from "../enums/user-order-by.enum"; // Создай такой энум (email, name, createdAt)

export interface IUsersQuery {
  page: number;
  limit: number;

  search?: string;
  accountType?: string;
  isBanned?: boolean;

  order: OrderEnum;
  orderBy: UserOrderByEnum;
}
