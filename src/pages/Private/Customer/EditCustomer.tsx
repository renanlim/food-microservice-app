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
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useApp } from '../../../hooks/useApp';
import { getCustomerById, updateCustomer, deleteCustomer } from '../../../services/CustomerService';
import ICustomerModel from '../../../interfaces/ICustomerModel';

const EditCustomer: React.FC = () => {
    const navigate = useNavigate();
    const { customerId, setReload } = useApp();
    const [customer, setCustomer] = useState<ICustomerModel>({
        idCustomer: '',
        name: '',
        email: '',
        password: '',
        address: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    useEffect(() => {
        const fetchCustomer = async () => {
            if (customerId) {
                try {
                    const result = await getCustomerById(customerId);
                    setCustomer(result);
                } catch (error) {
                    setError('Erro ao buscar detalhes do cliente.');
                }
            }
        };
        fetchCustomer();
    }, [customerId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomer({
            ...customer,
            [e.target.name]: e.target.value,
        });
        setError(null);  
        setSuccess(null); 
    };

    const handleSubmit = async () => {
        try {
            if (customerId) {
                await updateCustomer(customerId, customer);
                setReload(true);
                setSuccess('Dados do cliente atualizados com sucesso.');
            }
        } catch (error) {
            setError('Erro ao atualizar dados do cliente.');
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleDelete = async () => {
        if (customerId) {
            try {
                await deleteCustomer(customerId);
                setReload(true);
                navigate('/login'); 
            } catch (error: any) {
                setError(error.message || 'Erro ao excluir o cliente.');
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
            <ArrowBackIcon onClick={() => navigate("/")} sx={{ cursor: "pointer" }} color='primary' fontSize='large' />
            <Typography variant="h4" gutterBottom>
                Perfil do Cliente
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
            <Box>
                <TextField
                    name="name"
                    label="Nome"
                    value={customer.name}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <TextField
                    name="email"
                    label="Email"
                    value={customer.email}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <TextField
                    name="password"
                    label="Senha"
                    type={showPassword ? 'text' : 'password'}
                    value={customer.password}
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
                <TextField
                    name="address"
                    label="Endereço"
                    value={customer.address}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
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
                    Excluir Conta
                </Button>
            </Box>

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
                        Você tem certeza de que deseja excluir sua conta? Esta ação não pode ser desfeita.
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

export default EditCustomer;
