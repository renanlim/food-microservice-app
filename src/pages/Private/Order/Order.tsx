import React, { useState, useEffect } from 'react';
import { useApp } from '../../../hooks/useApp';
import { listOrders, cancelOrderByClient } from '../../../services/OrderService';
import { getRestaurantById } from '../../../services/RestaurantService';
import IOrderModel from '../../../interfaces/IOrderModel';
import { Container, Typography, List, ListItem, ListItemText, Alert, Card, Box, CardContent, Stack, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useRestaurant } from '../../../hooks/useRestaurant';

const Order: React.FC = () => {
    const [orders, setOrders] = useState<IOrderModel[]>([]);
    const [restaurants, setRestaurants] = useState<Map<string, string>>(new Map());
    const [error, setError] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string | undefined>(undefined);
    const [canceling, setCanceling] = useState(false);
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
    }, [customerId, restaurantId, orders]);

    const handleCancelOrder = async () => {
        if (!selectedOrderId || !customerId) {
            setError("ID do pedido ou cliente não está disponível.");
            return;
        }

        setCanceling(true);

        const result = await cancelOrderByClient(selectedOrderId, customerId);
        if (result.success) {
            setOrders(orders.filter(order => order.idOrder !== selectedOrderId));
            setDialogOpen(false);
            setCanceling(false);
        } else {
            setError(result.message || "Erro desconhecido ao cancelar o pedido.");
            setCanceling(false);
        }
    };

    const handleOpenDialog = (orderId: string | undefined) => {
        setSelectedOrderId(orderId);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedOrderId(undefined);
    };

    const calculateTotalPrice = (items: { price: number; quantity: number }[]) => {
        return items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'AGUARDANDO CONFIRMAÇÃO':
                return '#f0ad4e';
            case 'CONFIRMADO':
                return '#5bc0de';
            case 'CANCELADO':
                return '#686D76';
            case 'NEGADO':
                return '#686D76';
            case 'PREPARANDO':
                return '#FF7F3E';
            case 'A CAMINHO':
                return '#80AF81';
            case 'ENTREGUE':
                return '#06D001';
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
                                            <Button 
                                                variant="contained" 
                                                color="error" 
                                                onClick={() => handleOpenDialog(order.idOrder)} 
                                                sx={{ mt: 2 }}
                                                disabled={
                                                    order.status === 'CANCELADO' || 
                                                    order.status === 'NEGADO' || 
                                                    order.status === 'CONFIRMADO' ||
                                                    order.status === 'PREPARANDO' ||
                                                    order.status === 'A CAMINHO' ||
                                                    order.status === 'ENTREGUE'
                                                }
                                            >
                                                Cancelar Pedido
                                            </Button>
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

            <Dialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Confirmar Cancelamento
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Tem certeza de que deseja cancelar este pedido?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button
                        onClick={handleCancelOrder}
                        color="error"
                        disabled={canceling}
                    >
                        {canceling ? 'Cancelando...' : 'Confirmar'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Order;
