import React, { useState, useContext } from 'react';
import { useAuthStyles } from '../AuthPage';
import firebase from 'firebase';

import {
    TextField,
    Button
} from '@material-ui/core';

import ErrorAlert from '../../Alerts/ErrorAlert'
import SuccessAlert from '../../../components/Alerts/SuccessAlert';

const INITIAL_STATE = {
    passwordOne: '',
    passwordTwo: '',
    error: null,
    success: null,
};


function PasswordChangeForm() {
    const [state, setState] = useState({
        ...INITIAL_STATE
    });

    const classes = useAuthStyles();

    const handleSubmit = event => {
        event.preventDefault();

        const { passwordOne, passwordTwo } = state;

        if (passwordOne === passwordTwo) {
            firebase.auth().currentUser.updatePassword(passwordOne)
                .then(() => {
                    setState({
                        success: {
                            action: "Changed Passsword"
                        }
                    });
                })
                .catch(error => {
                    setState({ error });
                })
        }
        else {
            setState({ error: { message: "Password were not equal!" } });
        }
        setState({ ...INITIAL_STATE });
    };

    const handleChange = event => {
        const { id, value } = event.target;

        setState(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const isInvalid = state.passwordOne === '' || state.passwordTwo === '';

    return (
        <form className={classes.form}>

            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="passwordOne"
                label="New Password"
                type="password"
                id="password"
                value={state.passwordOne}
                onChange={handleChange}
            />
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="passwordTwo"
                label="Confirm Password"
                type="password"
                id="passwordTwo"
                value={state.passwordTwo}
                onChange={handleChange}
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={isInvalid}
                onSubmit={handleSubmit}
            >
                Change My Password
            </Button>

            {state.error && <ErrorAlert errorTitle={"Processing Password Change"} error={state.error.message} />}
            {state.success && <SuccessAlert action={state.success.action} />}
        </form>
    );

};

export default PasswordChangeForm;