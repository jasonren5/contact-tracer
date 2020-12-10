import React, { useContext } from 'react';
import { Button } from '@material-ui/core';
import { FirebaseContext } from '../../../utils/firebase';

export default function SignOutButton(props) {
    const firebase = useContext(FirebaseContext);

    return (
        <Button
            {...props}
            href="/"
            onClick={firebase.doSignOut}
        >
            Sign Out
        </Button>
    );
}