import React from 'react';
import firebase from 'firebase';
import { Button } from '@material-ui/core';

export default function SignOutButton() {
    return (
        <Button
            variant="contained"
            color="secondary"
            onClick={firebase.auth().signOut()}
        >
            Sign Out
        </Button>
    );
};