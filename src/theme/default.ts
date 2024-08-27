import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#BC0036', 
        },
        background: {
            default: '#edf2f4', 
        },
    },
    components: {
        // MuiPaper: {
        //     styleOverrides: {
        //         root: {
        //             backgroundColor: '#dc2f02', 
        //         },
        //     },
        // },
        MuiButton: {
            styleOverrides: {
                root: {
                    backgroundColor: '#BC0036', 
                    color: '#ffffff', 
                    '&:hover': {
                        backgroundColor: '#C7184A', 
                    },
                },
            },
        },
    },
});


