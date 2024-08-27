/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios"
import IRestaurantModel from "../interfaces/IRestaurantModel";
const API_URL = import.meta.env.VITE_API_URL;

export const registerRestaurant = async (restaurant: IRestaurantModel): Promise<void | { message: string }> => {
    try {
        await axios.post(`${API_URL}/ms-restaurant/restaurante`, restaurant, {
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

export const updateRestaurant = async (idRestaurant: string, restaurantUpdated: Partial<IRestaurantModel>): Promise<void | { message: string }> => {
    try {
        await axios.patch(`${API_URL}/ms-restaurant/restaurante/${idRestaurant}`, restaurantUpdated, {
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

export const deleteRestaurant = async (idRestaurant: string): Promise<void | { message: string }> => {
    try {
        await axios.delete(`${API_URL}/ms-restaurant/restaurante/${idRestaurant}`, {
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

export const listRestaurants = async (): Promise<IRestaurantModel[] | { message: string }> => {
    try {
        const response = await axios.get(`${API_URL}/ms-restaurant/restaurante`, {
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

export const getRestaurantById = async (idRestaurant: string): Promise<IRestaurantModel | { message: string }> => {
    try {
        const response = await axios.get<IRestaurantModel>(`${API_URL}/ms-restaurant/restaurante/${idRestaurant}`, {
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

export const getRestaurantByEmail = async (email: string): Promise<IRestaurantModel> => {
    try {
        const response = await axios.get<IRestaurantModel>(`${API_URL}/ms-restaurant/restaurante/email/${email}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Estamos com problemas no momento. Por favor, volte mais tarde.");
    }
};