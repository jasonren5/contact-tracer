import React, { useContext } from 'react';
import { Button } from '@material-ui/core';
import { FirebaseContext } from '../../../utils/firebase';

export default function SignOutButton() {
    const firebase = useContext(FirebaseContext);

    return (
        <Button
            variant="contained"
            color="secondary"
            onClick={firebase.doSignOut}
        >
            Sign Out
        </Button>
    );
};