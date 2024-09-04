import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    Alert,
    Box,
    IconButton,
    InputAdornment,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useRestaurant } from '../../../hooks/useRestaurant';
import { getRestaurantById, updateRestaurant, deleteRestaurant } from '../../../services/RestaurantService';
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
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
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
    }, [restaurantId, setReload]);

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

    const handleDelete = async () => {
        if (restaurantId) {
            try {
                await deleteRestaurant(restaurantId);
                setReload(true);
                navigate('/login');
            } catch (error: any) {
                setError(error.message || 'Erro ao excluir o restaurante.');
            }
            setOpenDeleteDialog(false);
        }
    };

    const handleOpenDeleteDialog = () => {
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <ArrowBackIcon onClick={() => navigate("/restaurante")} sx={{ cursor: "pointer" }} color='primary' fontSize='large' />
            <Typography variant="h4" gutterBottom>
                Perfil da Empresa
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
                        sx={{ mb: 2 }}
                    >
                        Salvar Alterações
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={handleOpenDeleteDialog}
                        fullWidth
                    >
                        Excluir Restaurante
                    </Button>
                </Box>
            )}

            <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">
                    Confirmar Exclusão
                </DialogTitle>
                <DialogContent>
                    <Typography id="delete-dialog-description">
                        Você tem certeza de que deseja excluir este restaurante? Esta ação não pode ser desfeita.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
                    <Button onClick={handleDelete} color="error">
                        Excluir
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default EditRestaurant;
