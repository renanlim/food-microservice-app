import React, { useEffect, useState } from 'react';
import { Container, Typography, Alert, Box, Grid, Card, CardContent, IconButton, Button, Select, MenuItem, FormControl, InputLabel, TextField } from "@mui/material";
import { getItemsByRestaurante } from "../../../services/ItemService";
import { useRestaurant } from '../../../hooks/useRestaurant';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useApp } from '../../../hooks/useApp';
import { createOrder } from '../../../services/OrderService';
import IOrderItemModel from '../../../interfaces/IOrderItemModel';
import IOrderModel from '../../../interfaces/IOrderModel';
import { SelectChangeEvent } from '@mui/material/Select';

const RestaurantItems: React.FC = () => {
  const { restaurantId, items, setItems, error, setError } = useRestaurant();
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [paymentMethod, setPaymentMethod] = useState<string>('cartão');
  const [observation, setObservation] = useState<string>(''); 
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const { customerId, reload } = useApp();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurantItems = async () => {
      if (restaurantId) {
        const result = await getItemsByRestaurante(restaurantId);
        if ('message' in result) {
          setError(result.message);
        } else {
          setItems(result);
          const initialQuantities = result.reduce((acc, item) => {
            if (item.idItem) { 
              acc[item.idItem] = 0;
            }
            return acc;
          }, {} as { [key: string]: number });
          setQuantities(initialQuantities);
        }
      } else {
        console.log("No restaurant ID found");
      }
    };

    fetchRestaurantItems();
  }, [restaurantId, setItems, setError, reload]);

  useEffect(() => {
    if (items) {
      const calculateTotalAmount = () => {
        const total = items.reduce((acc, item) => {
          const quantity = quantities[item.idItem ?? ''] || 0;
          return acc + (item.price * quantity);
        }, 0);
        setTotalAmount(total);
      };
  
      calculateTotalAmount();
    }
  }, [quantities, items, reload]);

  const handleIncreaseQuantity = (itemId: string) => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [itemId]: (prevQuantities[itemId] || 0) + 1,
    }));
    if (error) setError('');
  };

  const handleDecreaseQuantity = (itemId: string) => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [itemId]: Math.max((prevQuantities[itemId] || 0) - 1, 0),
    }));
    if (error) setError('');
  };

  const handlePaymentMethodChange = (event: SelectChangeEvent<string>) => {
    setPaymentMethod(event.target.value as string);
    if (error) setError('');
  };

  const handleOrder = async () => {
    if (!items || !restaurantId || !customerId || totalAmount === 0 || !paymentMethod) {
      setError("Por favor, selecione pelo menos um item e uma forma de pagamento.");
      return;
    }
  
    const orderItems = Object.keys(quantities)
      .filter(itemId => quantities[itemId] > 0)
      .map(itemId => {
        const item = items.find(i => i.idItem === itemId);
        if (!item) return null;
        return {
          idOrderItem: '',
          idItem: itemId,
          name: item.name,
          price: item.price,
          description: item.description,
          quantity: quantities[itemId],
        };
      })
      .filter((item): item is IOrderItemModel => item !== null);
  
    const order: IOrderModel = {
      idRestaurant: restaurantId,
      idCustomer: customerId,
      status: 'em análise',
      payment: paymentMethod,
      observation: observation,
      items: orderItems,
    };
  
    const result = await createOrder(order, restaurantId, customerId);
  
    if (!result.success) {
      setError(result.message || "Erro desconhecido ao criar o pedido.");
    } else {
      setQuantities({});
      navigate("/cliente/pedidos");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ position: 'relative' }}>
      <Box mt={4} p={2} bgcolor="white" borderRadius={2} boxShadow={3}>
        <ArrowBackIcon onClick={() => navigate("/")} sx={{ cursor: "pointer" }} color='primary' fontSize='large' />
        <Typography variant="h4" gutterBottom>
          Itens do Restaurante
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Grid container spacing={2}>
          {items && items.length > 0 ? (
            items.map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={item.idItem ?? ''}>
                <Card>
                  <CardContent sx={{height: 150, backgroundColor: "#FCDC94"}}>
                    <Typography variant="h6" component="div">
                      {item.name}
                    </Typography>
                    <Typography variant="body2">
                      Preço: R$ {item.price.toFixed(2)}
                    </Typography>
                    <Typography variant="body2">
                      Descrição: {item.description}
                    </Typography>
                  </CardContent>
                  <Box mt={2} display="flex" alignItems="center" justifyContent={"center"}>
                    <IconButton onClick={() => handleDecreaseQuantity(item.idItem ?? '')} color="primary">
                      <RemoveIcon />
                    </IconButton>
                    <Typography variant="body1" mx={2}>
                      {quantities[item.idItem ?? ''] || 0}
                    </Typography>
                    <IconButton onClick={() => handleIncreaseQuantity(item.idItem ?? '')} color="primary">
                      <AddIcon />
                    </IconButton>
                  </Box>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography variant="body1" mt={2} paddingLeft={2}>
              Nenhum item encontrado.
            </Typography>
          )}
        </Grid>
        {items && items.length > 0 && (
          <>
            <Box mt={4}>
              <Typography variant="h6">
                Valor Total: R$ {totalAmount.toFixed(2)}
              </Typography>
            </Box>
            <Box mt={4}>
              <FormControl fullWidth>
                <InputLabel id="payment-method-label">Forma de Pagamento</InputLabel>
                <Select
                  labelId="payment-method-label"
                  id='payment-method'
                  value={paymentMethod}
                  label="Forma de Pagamento"
                  onChange={handlePaymentMethodChange}
                >
                  <MenuItem value="cartão">Cartão</MenuItem>
                  <MenuItem value="dinheiro">Dinheiro</MenuItem>
                  <MenuItem value="pix">Pix</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box mt={4}>
              <TextField
                label="Observação"
                variant="outlined"
                fullWidth
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                multiline
                rows={4}
              />
            </Box>
            <Box mt={4} display="flex" justifyContent="center">
              <Button variant="contained" color="primary" onClick={handleOrder}>
                Fazer Pedido
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
};

export default RestaurantItems;
