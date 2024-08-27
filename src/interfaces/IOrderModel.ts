import OrderItemModel from "./IOrderItemModel";

export default interface IOrderModel {
  idOrder?: string;
  idRestaurant: string;
  idCustomer: string;
  status: string;
  payment: string;
  observation: string;
  items: OrderItemModel[];
}
