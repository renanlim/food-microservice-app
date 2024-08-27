import React from 'react';
import { Container, Typography, Button, Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const RestaurantDashboard: React.FC = () => {

    const navigate = useNavigate();

    const handleNavigate = (path: string) => {
        navigate(path);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Dashboard do Restaurante
            </Typography>
            <Box mt={2}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Button
                            variant="contained"
                            onClick={() => handleNavigate('/restaurante/editar')}
                            fullWidth
                        >
                            Modificar Atributos da Empresa
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Button
                            variant="contained"
                            onClick={() => handleNavigate('/restaurante/gerenciar/itens')}
                            fullWidth
                        >
                            Gerenciar Itens
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Button
                            variant="contained"
                            onClick={() => handleNavigate('/restaurante/pedidos')}
                            fullWidth
                        >
                            Conferir Pedidos
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default RestaurantDashboard;
