import { useState } from "react";
import { Button, TextField, Typography, Container, Box, Grid, Alert, IconButton, InputAdornment } from "@mui/material";
import { registerRestaurant } from "../../../../services/RestaurantService";
import IRestaurantModel from "../../../../interfaces/IRestaurantModel";
import { useApp } from "../../../../hooks/useApp";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const RestaurantForm = () => {
    const [name, setName] = useState("");
    const [address, setAddres] = useState("");
    const [cellphone, setCellphone] = useState("");
    const [openingHours, setOpeningHours] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const { setReload } = useApp();

    const handleSubmit = async () => {
        if (!name || !address || !cellphone || !openingHours || !email || !password) {
            setErrorMessage("Todos os campos são obrigatórios.");
            setSuccessMessage(null);
            return;
        }

        const restaurant: IRestaurantModel = {
            name,
            address,
            cellphone,
            openingHours,
            email,
            password
        };

        try {
            await registerRestaurant(restaurant);
            setSuccessMessage("Restaurante registrado com sucesso!");
            setErrorMessage(null);
            setName("");
            setCellphone("");
            setOpeningHours("");
            setEmail("");
            setPassword("");
            setAddres("");
            setReload(true);
        } catch (error: any) {
            setErrorMessage(error.message || "Algo deu errado.");
            setSuccessMessage(null);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box mt={4}>
                <Typography variant="h4" gutterBottom>
                    Cadastrar Restaurante
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Nome"
                            variant="outlined"
                            fullWidth
                            value={name}
                            type="text"
                            required
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            value={email}
                            type="email"
                            required
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Senha"
                            type={showPassword ? "text" : "password"}
                            variant="outlined"
                            fullWidth
                            value={password}
                            required
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Endereço"
                            variant="outlined"
                            fullWidth
                            value={address}
                            type="text"
                            required
                            onChange={(e) => setAddres(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Telefone"
                            variant="outlined"
                            fullWidth
                            value={cellphone}
                            type="tel"
                            required
                            onChange={(e) => setCellphone(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Horário de funcionamento"
                            variant="outlined"
                            fullWidth
                            value={openingHours}
                            type="text"
                            required
                            onChange={(e) => setOpeningHours(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        {successMessage && <Alert severity="success">{successMessage}</Alert>}
                        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                    </Grid>

                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
                            Cadastrar
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default RestaurantForm;
