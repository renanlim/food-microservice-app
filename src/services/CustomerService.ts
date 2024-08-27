/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios"
import ICustomerModel from "../interfaces/ICustomerModel";

const API_URL = import.meta.env.VITE_API_URL;

export const registerCustomer = async (customer: ICustomerModel): Promise<ICustomerModel> => {
    try {
        const response = await axios.post(`${API_URL}/ms-customer/cliente`, customer, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Estamos com problemas no momento. Por favor, volte mais tarde.");
    }
};

export const updateCustomer = async (idCustomer: string, customerUpdated: Partial<ICustomerModel>): Promise<ICustomerModel> => {
    try {
        const response = await axios.put(`${API_URL}/ms-customer/cliente/${idCustomer}`, customerUpdated, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Estamos com problemas no momento. Por favor, volte mais tarde.");
    }
};

export const deleteCustomer = async (idCustomer: string): Promise<void> => {
    try {
        await axios.delete(`${API_URL}/ms-customer/cliente/${idCustomer}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Estamos com problemas no momento. Por favor, volte mais tarde.");
    }
};

export const listCustomers = async (): Promise<ICustomerModel[]> => {
    try {
        const response = await axios.get<ICustomerModel[]>(`${API_URL}/ms-customer/cliente`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data; 
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Estamos com problemas no momento. Por favor, volte mais tarde.");
    }
};

export const getCustomerById = async (idCustomer: string): Promise<ICustomerModel> => {
    try {
        const response = await axios.get<ICustomerModel>(`${API_URL}/ms-customer/cliente/${idCustomer}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Estamos com problemas no momento. Por favor, volte mais tarde.");
    }
};

export const getCustomerByEmail = async (email: string): Promise<ICustomerModel> => {
    try {
        const response = await axios.get<ICustomerModel>(`${API_URL}/ms-customer/cliente/email/${email}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Estamos com problemas no momento. Por favor, volte mais tarde.");
    }
};
