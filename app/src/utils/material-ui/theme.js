import { createMuiTheme } from '@material-ui/core/styles';
import React from 'react';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#607d8b',
            light: '#8eacbb',
            dark: '#34515e',
            contrastText: '#000',
        },
        secondary: {
            light: '#c69764',
            main: '#936939',
            dark: '#623e10',
            contrastText: '#fff',
        },
        success: {
            main: '#54a264',
        },
        info: {
            main: '#18191d',
        },
        error: {
            main: '#f44336',
        },
    },
});

export const ThemeContext = React.createContext(theme);

export default theme;