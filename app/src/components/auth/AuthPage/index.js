import React from 'react';

import {
    Avatar,
    CssBaseline,
    Box,
    Typography,
    Container,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';

import Copyright from '../../copyright';

import { useMediaQuery } from 'react-responsive'

const useAuthStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));


function AuthPage(props) {
    const classes = useAuthStyles();
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });

    return (
        <Container component="main" maxWidth={isTabletOrMobile ? 'xs' : "sm"}>
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h4">
                    {props.title}
                </Typography>
                <div className="">{props.test}</div>
                {props.form}
                {!props.noDisclaimer &&
                    <Box mt="1rem">
                        <Typography component="h2" variant="h5" align="center" color="textSecondary">
                            Contact Tracing is only currently active for students and staff at Washington University in St. Louis
                    </Typography>
                    </Box>
                }
            </div>
            <Box mt={5}>
                <Copyright />
            </Box>
        </Container>
    );
};

export { useAuthStyles };

export default AuthPage;