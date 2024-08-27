import React, { createContext, useState, ReactNode, useCallback } from 'react';
import IRestaurantModel from '../interfaces/IRestaurantModel';
import IItemModel from '../interfaces/IItemModel';

interface RestaurantContextType {
    restaurantId: string | null;
    setRestaurantId: (id: string | null) => void;
    restaurants: IRestaurantModel[] | null;
    setRestaurants: (restaurants: IRestaurantModel[] | null) => void;
    items: IItemModel[] | null;
    setItems: (items: IItemModel[] | null) => void;
    addItem: (item: IItemModel) => void;
    updateItem: (updatedItem: IItemModel) => void;
    error: string | null;
    setError: (error: string | null) => void;
    restaurantName: string | null;
    setRestaurantName: (name: string | null) => void;
}

export const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export const RestaurantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [restaurantId, setRestaurantId] = useState<string | null>(null);
    const [restaurants, setRestaurants] = useState<IRestaurantModel[] | null>(null);
    const [items, setItems] = useState<IItemModel[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [restaurantName, setRestaurantName] = useState<string | null>(null);

    const addItem = useCallback((item: IItemModel) => {
        setItems(prevItems => {
            if (prevItems) {
                return [...prevItems, item];
            }
            return [item];
        });
    }, []);

    const updateItem = useCallback((updatedItem: IItemModel) => {
        setItems(prevItems => {
            if (prevItems) {
                return prevItems.map(item =>
                    item.idItem === updatedItem.idItem ? updatedItem : item
                );
            }
            return [];
        });
    }, []);

    return (
        <RestaurantContext.Provider
            value={{ restaurantId, setRestaurantId, restaurants, setRestaurants, items, setItems, addItem, updateItem, error, setError, restaurantName, setRestaurantName }}
        >
            {children}
        </RestaurantContext.Provider>
    );
};
