import { Box, Button, Stack, TextField, Typography, ToggleButtonGroup, ToggleButton, Snackbar, Alert } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../hooks/useApp";
import { getCustomerByEmail } from "../../services/CustomerService";
import { getRestaurantByEmail } from "../../services/RestaurantService";
import { useRestaurant } from "../../hooks/useRestaurant";

const Login = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [userType, setUserType] = useState<"client" | "restaurant">("client");
    const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState<"error" | "success">("error");

    const { setCustomerId, setCustomers, setLoggedIn, setCustomerName } = useApp();
    const { setRestaurantId, setRestaurants, setRestaurantName } = useRestaurant();

    const navigate = useNavigate();

    const handleUserTypeChange = (
        _event: React.MouseEvent<HTMLElement>,
        newUserType: "client" | "restaurant" | null
    ) => {
        if (newUserType !== null) {
            setUserType(newUserType);
        }
    };

    const handleLogin = async () => {
        try {
            if (userType === "client") {
                const customer = await getCustomerByEmail(email);
                if (customer && customer.password === password) {
                    setCustomerId(customer.idCustomer || null);
                    setCustomers([customer]);
                    setLoggedIn(true);
                    setCustomerName(customer.name);
                    navigate("/");
                } else {
                   setSnackbarMessage("Credenciais inválidas para cliente.");
                    setSnackbarSeverity("error");
                    setSnackbarOpen(true);
                }
            } else if (userType === "restaurant") {
                const restaurant = await getRestaurantByEmail(email);
                if (restaurant && restaurant.password === password) {
                    setRestaurantId(restaurant.idRestaurant || null);
                    setRestaurants([restaurant]);
                    setLoggedIn(true);
                    setRestaurantName(restaurant.name);
                    navigate("/restaurante");
                } else {
                    setSnackbarMessage("Credenciais inválidas para restaurante.");
                    setSnackbarSeverity("error");
                    setSnackbarOpen(true);
                }
            }
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            setSnackbarMessage("Erro ao fazer login. Tente novamente.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <Stack direction="row" height="100vh">
            <Box
                width="50%"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                p={4}
                bgcolor="background.paper"
            >
                <Box>
                    <Typography variant="h1" fontFamily={"Pacifico"} textAlign="center" color={"#BC0036"}>
                        PedeAí
                    </Typography>
                    <Typography variant="body1" fontFamily={"Montserrat"} textAlign="center" mb={2}>
                        Sejam bem-vindos ao melhor app de entrega de comida do mundo!
                    </Typography>

                    <ToggleButtonGroup
                        value={userType}
                        exclusive
                        onChange={handleUserTypeChange}
                        fullWidth
                        color="primary"
                        sx={{ mb: 2 }}
                    >
                        <ToggleButton value="client">Sou Cliente</ToggleButton>
                        <ToggleButton value="restaurant">Sou Restaurante</ToggleButton>
                    </ToggleButtonGroup>

                    <Typography variant="body2" mb={1}>Informe seu e-mail:</Typography>
                    <TextField
                        id="outlined-email"
                        label="E-mail"
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        fullWidth
                        sx={{ mb: 2 }}
                    />

                    <Typography variant="body2" mb={1}>Informe sua senha:</Typography>
                    <TextField
                        id="outlined-password"
                        label="Senha"
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        type="password"
                        fullWidth
                        sx={{ mb: 3 }}
                    />

                    <Button
                        variant="contained"
                        onClick={handleLogin}
                        fullWidth
                    >
                        Entrar como {userType === "client" ? "Cliente" : "Restaurante"}
                    </Button>

                    <Typography variant="body2" textAlign="center" mt={3}>
                        Não tem cadastro?
                        <Button
                            variant="text"
                            color="primary"
                            onClick={() => { navigate("/cadastrar") }}
                            sx={{ ml: 1 }}
                        >
                            Cadastre-se
                        </Button>
                    </Typography>
                </Box>
            </Box>

            <Snackbar
                        open={snackbarOpen}
                        autoHideDuration={6000}
                        onClose={handleCloseSnackbar}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    >
                        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                            {snackbarMessage}
                        </Alert>
                    </Snackbar>

            <Box
                width="50%"
                height="100%"
                sx={{
                    backgroundImage: `url('/foodora-bike-delivery-street.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            />
        </Stack>
    );
};

export default Login;
