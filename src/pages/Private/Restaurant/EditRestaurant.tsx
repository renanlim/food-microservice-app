import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, Button, Alert, Box, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useRestaurant } from '../../../hooks/useRestaurant';
import { getRestaurantById, updateRestaurant } from '../../../services/RestaurantService';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useApp } from '../../../hooks/useApp';

const EditRestaurant: React.FC = () => {
    const { restaurantId } = useRestaurant();
    const { setReload } = useApp();
    const [restaurant, setRestaurant] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRestaurant = async () => {
            if (restaurantId) {
                try {
                    const result = await getRestaurantById(restaurantId);
                    setRestaurant(result);
                    setReload(true);
                } catch (error) {
                    setError('Erro ao buscar detalhes do restaurante.');
                }
            }
        };
        fetchRestaurant();
    }, [restaurantId]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRestaurant({
            ...restaurant,
            [e.target.name]: e.target.value,
        });
    };
    
    const handleSubmit = async () => {
        if (restaurant) {
            try {
                if (restaurantId) {
                    await updateRestaurant(restaurantId, restaurant);
                    setReload(true);
                    setSuccess('Dados do restaurante atualizados com sucesso.');
                }
            } catch (error) {
                setError('Erro ao atualizar dados do restaurante.');
            }
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <ArrowBackIcon onClick={() => navigate("/restaurante")} sx={{ cursor: "pointer" }} color='primary' fontSize='large' />
            <Typography variant="h4" gutterBottom>
                Modificar Atributos da Empresa
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
            {restaurant && (
                <Box>
                    <TextField
                        name="name"
                        label="Nome"
                        value={restaurant.name}
                        onChange={handleChange}
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        name="address"
                        label="Endereço"
                        value={restaurant.address}
                        onChange={handleChange}
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        name="cellphone"
                        label="Telefone"
                        value={restaurant.cellphone}
                        onChange={handleChange}
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        name="openingHours"
                        label="Funcionamento"
                        value={restaurant.openingHours}
                        onChange={handleChange}
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        name="email"
                        label="Email"
                        value={restaurant.email}
                        onChange={handleChange}
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        name="password"
                        label="Senha"
                        type={showPassword ? 'text' : 'password'}
                        value={restaurant.password}
                        onChange={handleChange}
                        fullWidth
                        sx={{ mb: 2 }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={handleClickShowPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        fullWidth
                    >
                        Salvar Alterações
                    </Button>
                </Box>
            )}
        </Container>
    );
};

export default EditRestaurant;
