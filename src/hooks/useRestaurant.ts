import { useContext } from 'react';
import { RestaurantContext } from '../context/RestaurantContext';

export const useRestaurant = () => {
    const context = useContext(RestaurantContext);
    if (context === undefined) {
        throw new Error('useRestaurant must be used within a RestaurantProvider');
    }
    return context;
};
