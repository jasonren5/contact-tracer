import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { FirebaseContext } from '../../../utils/firebase';

import {
    Button,
    Grid,
    TextField,
    FormControlLabel,
    Checkbox
} from '@material-ui/core';
import Link from '@material-ui/core/Link';

import ErrorAlert from '../../../components/Alerts/ErrorAlert';
import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget'

import AuthPage, { useAuthStyles } from '../../../components/Auth/AuthPage';

const INITIAL_STATE = {
    email: "",
    password: "",
    remeberMe: "",
    error: null
};

const SignInPage = () => (
    <AuthPage form={<SignInForm />} title={"Sign In"} />
);

function SignInForm() {
    const [state, setState] = useState({
        ...INITIAL_STATE
    });
    const firebase = useContext(FirebaseContext);
    const classes = useAuthStyles();
    const history = useHistory();

    const handleSubmit = event => {
        event.preventDefault();

        const { email, password } = state;
        firebase.doSignInWithEmailAndPassword(email, password)
            .then(() => {
                if (history.length <= 2) {
                    history.push('/');
                }
                else {
                    history.goBack();
                }
            })
            .catch(error => {
                setState({ error });
            });

        setState(prevState => ({
            ...prevState,
            email: "",
            password: "",
            remeberMe: ""
        }));
    };

    const handleChange = event => {
        const { id, value } = event.target;

        setState(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    // Only WashU Regex: (state.email && !/^[A-Z0-9._%+-]+@wustl.edu$/i.test(state.email));
    // Every school REGEX: (state.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.edu$/i.test(state.email))
    // Every email REGEX: (state.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(state.email))
    const isInvalid = state.password === '' || (state.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(state.email));


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
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={state.password}
                onChange={handleChange}
            />
            <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
                value={state.remeberMe}
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
                Sign In
            </Button>
            <Grid container>
                <PasswordForgetLink />
                <SignUpLink />
            </Grid>

            {state.error && <ErrorAlert errorTitle={"Processing Sign In"} error={state.error.message} />}
        </form>
    );
}

const SignInLink = () => (
    <Grid item xs>
        <Link href="signin" variant="body2">
            Already have an account? Sign In!
        </Link>
    </Grid>
);

export default SignInPage;

export { SignInForm, SignInLink };

