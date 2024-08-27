import React, { useEffect } from 'react';
import { Container, Typography, Alert, Box, Grid, Card, CardContent } from '@mui/material';
import { listRestaurants } from '../../../services/RestaurantService';
import { useRestaurant } from '../../../hooks/useRestaurant';
import { useNavigate } from 'react-router-dom';

const RestaurantList: React.FC = () => {
    const { restaurants, setRestaurants, error, setError, setRestaurantId } = useRestaurant();

    const navigate = useNavigate();

    useEffect(() => {
        const fetchRestaurants = async () => {
            const result = await listRestaurants();
            if ('message' in result) {
                setError(result.message);
            } else {
                setRestaurants(result);
            }
        };

        fetchRestaurants();
    }, [setRestaurants, setError]);

    const handleRestaurantClick = (id: string) => {
        setRestaurantId(id);
        navigate(`/cliente/restaurante/items`);
    };

    return (
        <Container maxWidth="lg" sx={{ position: 'relative' }}>
            <Box mt={4} p={2} bgcolor="white" borderRadius={2} boxShadow={3}>
                <Typography variant="h4" gutterBottom>
                    Lista de Restaurantes
                </Typography>
                {error ? (
                    <Alert severity="error">{error}</Alert>
                ) : restaurants && restaurants.length > 0 ? (
                    <Grid container spacing={2}>
                        {restaurants.map((restaurant) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={restaurant.idRestaurant ?? ''}>
                                <Card sx={{ cursor: "pointer" }} onClick={() => handleRestaurantClick(restaurant.idRestaurant ?? '')}>
                                    <CardContent sx={{height: 150, backgroundColor: "#FCDC94"}}>
                                        <Typography variant="h6" component="div">
                                            {restaurant.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Endereço: {restaurant.address}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Telefone: {restaurant.cellphone}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Funcionamento: {restaurant.openingHours}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Typography variant="body1" mt={2}>
                        Nenhum restaurante encontrado.
                    </Typography>
                )}
            </Box>
        </Container>
    );
};

export default RestaurantList;
