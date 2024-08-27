import { useState } from "react";
import { Button, TextField, Typography, Container, Box, Grid, Alert, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useApp } from "../../../../hooks/useApp";
import ICustomerModel from "../../../../interfaces/ICustomerModel";
import { registerCustomer } from "../../../../services/CustomerService";
import { useContext } from "react";
import { AppContext } from "../../../../context/AppContext";

const CustomerForm = () => {
    const [name, setName] = useState("");
    const [address, setAddres] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const { setReload, setCustomers, customers } = useApp();
    const { setCustomers: setGlobalCustomers } = useContext(AppContext);

    const handleSubmit = async () => {
        if (!name || !address || !email || !password) {
            setErrorMessage("Todos os campos são obrigatórios.");
            setSuccessMessage(null);
            return;
        }

        const customer: ICustomerModel = {
            name,
            address,
            email,
            password
        };

        try {
            const newCustomer = await registerCustomer(customer);
            setSuccessMessage("Cliente registrado com sucesso!");
            setErrorMessage(null);
            setName("");
            setEmail("");
            setPassword("");
            setAddres("");
            setReload(true);

            if (customers) {
                setCustomers([...customers, newCustomer]);
            } else {
                setGlobalCustomers([newCustomer]);
            }
        } catch (error: any) {
            setErrorMessage(error.message || "Algo deu errado.");
            setSuccessMessage(null);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <Container maxWidth="sm">
            <Box mt={4}>
                <Typography variant="h4" gutterBottom>
                    Cadastrar Cliente
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
                            variant="outlined"
                            fullWidth
                            type={showPassword ? "text" : "password"}
                            value={password}
                            required
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={togglePasswordVisibility} edge="end">
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

export default CustomerForm;
