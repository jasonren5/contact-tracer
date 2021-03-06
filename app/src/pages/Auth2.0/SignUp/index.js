import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { FirebaseContext } from '../../../utils/firebase';
import { FilterContext } from '../../../utils/filter';

import {
    Button,
    Grid,
    TextField,
    Link
} from '@material-ui/core';

import ErrorAlert from '../../../components/Alerts/ErrorAlert';
import { SignInLink } from '../SignIn';

import AuthPage, { useAuthStyles } from '../../../components/Auth/AuthPage';

const INITIAL_STATE = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    error: null
};

const SignUpPage = () => (
    <AuthPage form={<SignUpForm />} title={"Sign Up"} />
);

function SignUpForm() {
    const [state, setState] = useState({
        ...INITIAL_STATE
    });

    const classes = useAuthStyles();
    const history = useHistory();
    const firebase = useContext(FirebaseContext);
    const filter = useContext(FilterContext).filter;

    const handleSubmit = event => {
        event.preventDefault();

        const { firstName, lastName, email, password } = state;
        const fullName = firstName + " " + lastName;

        if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
            const username = email.split('@')[0];
            if (filter.check(username)) {
                setState(prevState => ({
                    ...prevState,
                    error: {
                        message: "Your email has a banned word. Please use a more appropriate address"
                    }
                }));
            }
            else {
                firebase.doCreateUserWithEmailAndPassword(email, password, fullName)
                    .then(() => {
                        history.push('/');
                    })
                    .catch(error => {
                        setState({ error });
                    });
            }
        }
        else {
            setState({ error: { message: "Please Submit an Actual Email" } });
        }
        setState(prevState => ({
            ...prevState,
            firstName: "",
            lastName: "",
            email: "",
            password: ""
        }));
    };

    const handleChange = event => {
        const { id, value } = event.target;

        setState(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    // WUSTL email REGEX: (state.email && !/^[A-Z0-9._%+-]+@wustl.edu$/i.test(state.email));
    // Every school REGEX: (state.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.edu$/i.test(state.email))
    // Every email REGEX: (state.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(state.email))
    const isInvalid = state.firstName === ''
        || state.lastName === ''
        || state.password === ''
        || (state.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(state.email));

    return (
        <form onSubmit={handleSubmit} className={classes.form}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        autoComplete="fname"
                        name="firstName"
                        variant="outlined"
                        required
                        fullWidth
                        id="firstName"
                        label="First Name"
                        autoFocus
                        value={state.firstName}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        variant="outlined"
                        required
                        fullWidth
                        id="lastName"
                        label="Last Name"
                        name="lastName"
                        autoComplete="lname"
                        value={state.lastName}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        variant="outlined"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        value={state.email}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        variant="outlined"
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
                </Grid>
            </Grid>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={isInvalid}
            >
                Sign Up
            </Button>
            <SignInLink />

            {state.error && <ErrorAlert errorTitle={"Processing Sign Up"} error={state.error.message} />}
        </form>
    );
}

const SignUpLink = () => (
    <Grid xs item>
        <Link href="signup" variant="body2">
            Don't have an account? Sign Up!
        </Link>
    </Grid>
);

export default SignUpPage;

export { SignUpForm, SignUpLink };