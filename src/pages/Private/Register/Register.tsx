import { Container, IconButton, Stack, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useState } from "react";
import RestaurantForm from "./Restaurant/RestaurantForm";
import { useNavigate } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import CustomerForm from "./Customer/CustomerForm";

const Register = () => {
    const [userType, setUserType] = useState<"client" | "restaurant">("client");

    const navigate = useNavigate();

    const handleUserTypeChange = (
        _event: React.MouseEvent<HTMLElement>,
        newUserType: "client" | "restaurant" | null
    ) => {
        if (newUserType !== null) {
            setUserType(newUserType);
        }
    };
    
    return (
        <Container maxWidth="sm">
            <Stack paddingTop={12}>
                <IconButton
                    edge="start"
                    color="primary"
                    onClick={() => navigate("/login")}
                    sx={{ mb: 2 }}
                >
                    <ArrowBack />
                </IconButton>
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
                {userType === "restaurant" && <RestaurantForm />}
                {userType === "client" && <CustomerForm />}
            </Stack>
        </Container>
    );
};

export default Register;
