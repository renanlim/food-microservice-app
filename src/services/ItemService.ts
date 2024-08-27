/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios"
import IItemModel from "../interfaces/IItemModel";

const API_URL = import.meta.env.VITE_API_URL;

export const registerItem = async (item: Omit<IItemModel, 'id'> & { idRestaurant: string }): Promise<void | { message: string }> => {
    try {
        await axios.post(`${API_URL}/ms-item/item`, item, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error: any) {
        return {
            message: error.response?.data?.message || "Estamos com problemas no momento. Por favor, volte mais tarde.",
        };
    }
};

type UpdateItemPayload = Omit<IItemModel, 'idItem'> & { idRestaurant: string };

export const updateItem = async (idItem: string, itemUpdated: Partial<UpdateItemPayload>): Promise<void | { message: string }> => {
    try {
        await axios.put(`${API_URL}/ms-item/item/${idItem}`, itemUpdated, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error: any) {
        return {
            message: error.response?.data?.message || "Estamos com problemas no momento. Por favor, volte mais tarde.",
        };
    }
};


export const deleteItem = async (idItem: string): Promise<void | { message: string }> => {
    try {
        await axios.delete(`${API_URL}/ms-item/item/${idItem}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error: any) {
        return {
            message: error.response?.data?.message || "Estamos com problemas no momento. Por favor, volte mais tarde.",
        };
    }
};

export const deleteItemByRestaurante = async (idItem: string, idRestaurant: string): Promise<void | { message: string }> => {
    try {
        await axios.delete(`${API_URL}/ms-item/item/restaurante/${idRestaurant}/item/${idItem}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error: any) {
        return {
            message: error.response?.data?.message || "Estamos com problemas no momento. Por favor, volte mais tarde.",
        };
    }
};

export const listItems = async (): Promise<IItemModel[] | { message: string }> => {
    try {
        const response = await axios.get(`${API_URL}/ms-item/item`, {
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

export const getItemById = async (idItem: string): Promise<IItemModel | { message: string }> => {
    try {
        const response = await axios.get(`${API_URL}/ms-item/item/${idItem}`, {
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

export const getItemsByRestaurante = async (idRestaurante: string): Promise<IItemModel[] | { message: string }> => {
    try {
        const response = await axios.get(`${API_URL}/ms-item/item/restaurante/${idRestaurante}`, {
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

