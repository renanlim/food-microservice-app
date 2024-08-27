import { CssBaseline, ThemeProvider } from '@mui/material';
import Application from "./context/AppContext";
import { theme } from './theme/default';
import Router from './Router/Router';
import { RestaurantProvider } from './context/RestaurantContext';


function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Application>
                <RestaurantProvider>
                    <Router />
                </RestaurantProvider>
            </Application>
        </ThemeProvider>
    );
}

export default App;
