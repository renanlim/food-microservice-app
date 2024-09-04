import { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import IOrderModel from '../../../interfaces/IOrderModel';
import IOrderItemModel from '../../../interfaces/IOrderItemModel';
import { listOrders, updateOrderStatus, denyOrderByRestaurant } from '../../../services/OrderService';
import { useRestaurant } from '../../../hooks/useRestaurant';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const OrdersRestaurant = () => {
  const { restaurantId } = useRestaurant();
  const [orders, setOrders] = useState<IOrderModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<IOrderModel | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const response = await listOrders();
      if ('message' in response) {
        setError(response.message);
      } else {
        const filteredOrders = response.filter(order => order.idRestaurant === restaurantId);
        setOrders(filteredOrders);
      }
      setLoading(false);
    };

    fetchOrders();
  }, [restaurantId]);

  const handleStatusChange = (order: IOrderModel, status: string) => {
    setSelectedOrder(order);
    setNewStatus(status);
    setOpenModal(true);
  };

  const confirmStatusChange = async () => {
    if (selectedOrder) {
      try {
        if (newStatus === "NEGADO") {
          const result = await denyOrderByRestaurant(selectedOrder.idOrder || "");
          if (!result.success) {
            throw new Error(result.message || "Erro ao negar o pedido.");
          }
        } else {
          if (selectedOrder.idOrder) {
            await updateOrderStatus(selectedOrder.idOrder, newStatus);
          }
        }

        const response = await listOrders();
        if ('message' in response) {
          setError(response.message);
        } else {
          const filteredOrders = response.filter(order => order.idRestaurant === restaurantId);
          setOrders(filteredOrders);
        }
      } catch (error) {
        console.error("Erro ao atualizar o status do pedido:", error);
        setError("Erro ao atualizar o status do pedido. Verifique o console para mais detalhes.");
      }
      setOpenModal(false);
    }
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setSelectedOrder(null);
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <ArrowBackIcon onClick={() => navigate("/restaurante")} sx={{ cursor: "pointer" }} color='primary' fontSize='large' />
      <Typography variant="h4" gutterBottom>
        Pedidos do Restaurante
      </Typography>
      {orders.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          Nenhum pedido encontrado.
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {orders.map((order) => (
            <Grid item xs={12} key={order.idOrder}>
              <Card>
                <CardContent>
                  {order.observation && <Typography variant="subtitle1">Observação:</Typography>}
                  <Typography variant="body2" gutterBottom>
                    {order.observation}
                  </Typography>
                  <Typography variant="subtitle1">Itens:</Typography>
                  <Grid container spacing={2}>
                    {order.items.map((item: IOrderItemModel) => (
                      <Grid item xs={12} sm={6} md={4} key={item.idOrderItem}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="body2" gutterBottom>
                              {item.name}
                            </Typography>
                            <Typography variant="body2">
                              Quantidade: {item.quantity}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                  <Box sx={{ mt: 2 }}>
                    <FormControl fullWidth>
                      <InputLabel id="select-label">Status do Pedido</InputLabel>
                      <Select
                        labelId="select-label"
                        id="select-status"
                        value={order.status || ""}
                        label="Status do Pedido"
                        onChange={(e) => handleStatusChange(order, e.target.value as string)}
                      >
                        <MenuItem value="AGUARDANDO CONFIRMAÇÃO">AGUARDANDO CONFIRMAÇÃO</MenuItem>
                        <MenuItem value="CONFIRMADO">CONFIRMADO</MenuItem>
                        <MenuItem value="NEGADO">NEGADO</MenuItem>
                        <MenuItem value="PREPARANDO">PREPARANDO</MenuItem>
                        <MenuItem value="A CAMINHO">A CAMINHO</MenuItem>
                        <MenuItem value="ENTREGUE">ENTREGUE</MenuItem>
                        <MenuItem value="CANCELADO">CANCELADO</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog
        open={openModal}
        onClose={handleModalClose}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">
          Confirmação
        </DialogTitle>
        <DialogContent>
          <Typography id="confirm-dialog-description">
            Você tem certeza de que deseja alterar o status deste pedido para "{newStatus}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose}>Cancelar</Button>
          <Button onClick={confirmStatusChange} color="primary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OrdersRestaurant;
