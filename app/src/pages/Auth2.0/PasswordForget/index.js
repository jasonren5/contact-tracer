import React, { useState, useContext } from 'react';
import AuthPage, { useAuthStyles } from '../../../components/Auth/AuthPage';
import { FirebaseContext } from '../../../utils/firebase';

import { SignUpLink } from '../SignUp';
import { SignInLink } from '../SignIn';

import {
    TextField,
    Button,
    Grid,
    Link
} from '@material-ui/core';

import ErrorAlert from '../../../components/Alerts/ErrorAlert';
import SuccessAlert from '../../../components/Alerts/SuccessAlert';

const INITIAL_STATE = {
    email: '',
    error: null,
    success: null,
};

const PasswordForgetPage = () => (
    <AuthPage form={<PasswordForgetForm />} title={"Forgot Your Password?"} />
);

function PasswordForgetForm() {
    const [state, setState] = useState({
        ...INITIAL_STATE
    });
    const firebase = useContext(FirebaseContext);

    const classes = useAuthStyles();

    const handleSubmit = event => {
        event.preventDefault();

        const { email } = state;

        firebase.doPasswordReset(email)
            .then(() => {
                setState({
                    success: {
                        action: "Password Reset"
                    }
                });
            })
            .catch(error => {
                setState({ error });
            });

        setState(prevState => ({
            ...prevState,
            email: ''
        }));
    };

    const handleChange = event => {
        const { id, value } = event.target;

        setState(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const isInvalid = state.email === '' || (state.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(state.email));

    return (
        <form onSubmit={handleSubmit} className={classes.form}>
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={state.email}
                onChange={handleChange}
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={isInvalid}
            >
                Reset My Password
            </Button>
            <Grid container>
                <SignInLink />
                <SignUpLink />
            </Grid>

            {state.error && <ErrorAlert errorTitle={"Processing Password Reset"} error={state.error.message} />}
            {state.success && <SuccessAlert action={state.success.action} />}
        </form>
    );
}

const PasswordForgetLink = () => (
    <Grid item xs>
        <Link href="forgot-password" variant="body2">
            Forgot password?
        </Link>
    </Grid>
);

export default PasswordForgetPage;

export { PasswordForgetForm, PasswordForgetLink };