import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, Button, Alert, Box, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useApp } from '../../../hooks/useApp';
import { getCustomerById, updateCustomer } from '../../../services/CustomerService';
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
                >
                    Salvar Alterações
                </Button>
            </Box>
        </Container>
    );
};

export default EditCustomer;
