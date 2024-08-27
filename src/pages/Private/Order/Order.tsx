import { useEffect, useState } from "react";
import { useApp } from "../../../hooks/useApp";
import { listOrders } from "../../../services/OrderService";
import { getRestaurantById } from "../../../services/RestaurantService";
import IOrderModel from "../../../interfaces/IOrderModel";
import { Container, Typography, List, ListItem, ListItemText, Alert, Card, Box, CardContent, Stack } from "@mui/material";
import { useRestaurant } from "../../../hooks/useRestaurant";


const Order = () => {
    const [orders, setOrders] = useState<IOrderModel[]>([]);
    const [restaurants, setRestaurants] = useState<Map<string, string>>(new Map());
    const [error, setError] = useState<string | null>(null);
    const { customerId } = useApp();
    const { restaurantId } = useRestaurant();


    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const result = await listOrders();
                if ('message' in result) {
                    setError(result.message);
                } else {
                    let filteredOrders;
                    if (customerId) {
                        filteredOrders = result.filter(order => order.idCustomer === customerId);
                    } else if (restaurantId) {
                        filteredOrders = result.filter(order => order.idRestaurant === restaurantId);
                    }
                    if (filteredOrders) {
                        setOrders(filteredOrders);

                        const restaurantPromises = filteredOrders.map(order => getRestaurantById(order.idRestaurant));
                        const restaurantResponses = await Promise.all(restaurantPromises);

                        const restaurantMap = new Map<string, string>();
                        restaurantResponses.forEach((response) => {
                            if ('message' in response) {
                                console.error(response.message);
                            } else {
                                restaurantMap.set(response.idRestaurant || "", response.name);
                            }
                        });

                        setRestaurants(restaurantMap);
                    }
                }
            } catch (error) {
                setError("Erro ao buscar pedidos.");
            }
        };

        fetchOrders();
    }, [customerId, restaurantId]);

    const calculateTotalPrice = (items: { price: number; quantity: number }[]) => {
        return items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'em análise':
                return '#f0ad4e';
            case 'preparando':
                return '#5bc0de';
            case 'pronto':
                return '#5cb85c';
            case 'em rota para entrega':
                return '#f0ad4e';
            case 'entregue':
                return '#4cae4c';
            case 'cancelado':
                return '#6c757d';
            default:
                return '#ffffff';
        }
    };


    return (
        <Container>
            <Box paddingTop={4}>
                <Typography variant="h4" gutterBottom>
                    Seus Pedidos
                </Typography>
                {error && <Alert severity="error">{error}</Alert>}
                {orders.length > 0 ? (
                    <List>
                        {orders.map((order) => (
                            <Box key={order.idOrder}>
                                <Card sx={{ marginBottom: 4 }}>
                                    <CardContent>
                                        <ListItem>
                                            <ListItemText
                                                primary={
                                                    <>
                                                        Restaurante: {restaurants.get(order.idRestaurant) || "Desconhecido"} | Pagamento: {order.payment}
                                                    </>
                                                }
                                                secondary={
                                                    <>
                                                        <Typography
                                                            component="span"
                                                            sx={{
                                                                display: 'inline',
                                                                backgroundColor: getStatusColor(order.status),
                                                                color: '#fff',
                                                                borderRadius: '4px',
                                                                padding: '4px 4px',
                                                                marginTop: '4px',
                                                                marginRight: "4px"
                                                            }}
                                                        >
                                                            {`Status: ${order.status}`}
                                                        </Typography>
                                                        {order.observation && `Observação: ${order.observation}`}
                                                    </>
                                                }
                                            />
                                        </ListItem>
                                        <List component="div" disablePadding>
                                            {order.items.map((item) => (
                                                <ListItem key={item.idOrderItem} sx={{ pl: 4 }}>
                                                    <ListItemText
                                                        primary={item.name}
                                                        secondary={`Descrição: ${item.description} | Quantidade: ${item.quantity} | Preço: R$${item.price}`}
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                        <Stack alignItems={"end"}>
                                            <Typography variant="h6" sx={{ mt: 2 }}>
                                                Total: R$ {calculateTotalPrice(order.items)}
                                            </Typography>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Box>
                        ))}
                    </List>
                ) : (
                    <Typography variant="body1">Nenhum pedido encontrado.</Typography>
                )}
            </Box>
        </Container>
    );
};

export default Order;
