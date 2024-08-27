/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios"
import IOrderModel from "../interfaces/IOrderModel";
import IOrderItemModel from "../interfaces/IOrderModel";

const API_URL = import.meta.env.VITE_API_URL;

export const createOrder = async (order: IOrderModel, idRestaurant: string, idCustomer: string): Promise<{ success: boolean; message?: string }> => {
    try {
        await axios.post(`${API_URL}/ms-order/order/restaurante/${idRestaurant}/cliente/${idCustomer}`, order, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return { success: true };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || "Estamos com problemas no momento. Por favor, volte mais tarde.",
        };
    }
};

export const listOrdersById = async (idOrder: string): Promise<IOrderModel[] | { message: string }> => {
    try {
        const response = await axios.get<IOrderModel[]>(`${API_URL}/ms-order/order/${idOrder}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error: any) {
        return {
            message: error.response?.data?.message || "Estamos com problemas no momento. Por favor, volte mais tarde.",
        };
    }
};

export const updateOrderStatus = async (orderId: string, newStatus: string): Promise<void> => {
    try {
      await axios.put(`${API_URL}/ms-order/order/${orderId}`, { status: newStatus }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Erro ao atualizar o status do pedido.");
    }
  };



export const listOrders = async (): Promise<IOrderModel[] | { message: string }> => {
    try {
        const response = await axios.get<IOrderModel[]>(`${API_URL}/ms-order/order`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error: any) {
        return {
            message: error.response?.data?.message || "Estamos com problemas no momento. Por favor, volte mais tarde.",
        };
    }
};

export const calculateOrder = async (idOrder: string): Promise<IOrderItemModel[] | { message: string }> => {
    try {
        const response = await axios.get<IOrderModel[]>(`${API_URL}/ms-order/order/${idOrder}/item/total`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error: any) {
        return {
            message: error.response?.data?.message || "Estamos com problemas no momento. Por favor, volte mais tarde.",
        };
    }
};
