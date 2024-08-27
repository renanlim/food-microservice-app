import { AppBar, Toolbar, Typography, IconButton, Stack, Box } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../../hooks/useApp";
import { useRestaurant } from "../../hooks/useRestaurant";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { customerName, setCustomerId, setCustomers, setLoggedIn, setCustomerName } = useApp();
    const { restaurantName, setRestaurantId, setRestaurants, setRestaurantName } = useRestaurant();

    const isCadastroRoute = location.pathname === "/cadastro";

    const isClient = !!customerName;
    const isRestaurant = !!restaurantName;

    const handleLogout = () => {
        if (isClient) {
            setCustomerId(null);
            setCustomerName(null);
            setCustomers(null);
            setLoggedIn(false);
        } else if (isRestaurant) {
            setRestaurantId(null);
            setRestaurantName(null);
            setRestaurants(null);
        }
        navigate("/login");
    };


    return (
        <AppBar position="sticky">
            <Toolbar sx={{ backgroundColor: "#BC0036", padding: 4, justifyContent: "space-between" }}>
                <Typography variant="h4" fontFamily={"Pacifico"} color={"white"}>
                    PedeAí
                </Typography>
                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                    {isClient && (
                        <Typography variant="h6" color="white">
                            Olá, {customerName}
                        </Typography>
                    )}
                    {isRestaurant && (
                        <Typography variant="h6" color="white">
                            Restaurante: {restaurantName}
                        </Typography>
                    )}
                </Box>
                {!isCadastroRoute && (
                    <Stack direction="row" spacing={2} alignItems="center">
                        {isClient && (
                            <>
                                <IconButton color="inherit" onClick={() => navigate("/")}>
                                    <RestaurantMenuIcon fontSize="large" />
                                </IconButton>
                                <IconButton color="inherit" onClick={() => navigate("/cliente/pedidos")}>
                                    <ShoppingCartIcon fontSize="large" />
                                </IconButton>
                                <IconButton color="inherit" onClick={() => navigate("/cliente/perfil")}>
                                    <AccountCircleIcon fontSize="large" />
                                </IconButton>
                            </>
                        )}
                        <IconButton color="inherit" onClick={handleLogout}>
                            <LogoutIcon fontSize="large" />
                        </IconButton>
                    </Stack>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
