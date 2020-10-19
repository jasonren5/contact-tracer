import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#8eacbb',
            main: '#607d8b',
            dark: '#34515e',
            contrastText: '#000',
        },
        secondary: {
            light: '#c69764',
            main: '#936939',
            dark: '#623e10',
            contrastText: '#fff',
        },
        success: '#54a264',
        info: '#18191d',
        error: '#f44336'
    },
});

export default theme;