import {
    Box,
    Container
} from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";



const Main = () => {

    return (
        <>
            <Navbar />
            <Box position={"relative"}>
                <Container maxWidth="xl" sx={{ height: '100%' }}>
                    <Outlet />
                </Container>
            </Box>
        </>
    );
};

export default Main;
