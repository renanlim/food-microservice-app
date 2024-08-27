import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#dc2f02', 
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
                    backgroundColor: '#dc2f02', 
                    color: '#ffffff', 
                    '&:hover': {
                        backgroundColor: '#b93e01', 
                    },
                },
            },
        },
    },
});


