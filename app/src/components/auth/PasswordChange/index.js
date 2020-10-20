import React, { useState, useContext } from 'react';
import { useAuthStyles } from '../AuthPage';
// import { FirebaseContext } from '../../../utils/Firebase';

import {
    TextField,
    Button
} from '@material-ui/core';

import ErrorAlert from '../../Alerts/ErrorAlert'

const INITIAL_STATE = {
    passwordOne: '',
    passwordTwo: '',
    error: null
};


function PasswordChangeForm() {
    const [state, setState] = useState({
        ...INITIAL_STATE
    });

    const classes = useAuthStyles();
    // const firebase = useContext(FirebaseContext);

    // const handleSubmit = event => {
    //     event.preventDefault();

    //     const { passwordOne, passwordTwo } = state;

    //     if (passwordOne === passwordTwo) {
    //         firebase.doPasswordReset(passwordOne)
    //             .catch(error => {
    //                 setState({ error });
    //             })
    //     }
    //     else {
    //         setState({ error: { message: "Password were not equal!" } });
    //     }
    //     setState({ ...INITIAL_STATE });
    // };

    const handleChange = event => {
        const { id, value } = event.target;

        setState(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const isInvalid = state.passwordOne === '' || state.passwordTwo === '';

    return (
        <form onSubmit={handleSubmit} className={classes.form}>

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
                label="New Password"
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
            >
                Change My Password
            </Button>

            {state.error && <ErrorAlert errorTitle={"Processing Password Change"} error={state.error.message} />}
        </form>
    );

};

export default PasswordChangeForm;