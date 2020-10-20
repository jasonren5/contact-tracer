import React, { useContext } from 'react';
// import { FirebaseContext } from '../../../utils/Firebase';
import { Button } from '@material-ui/core';

export default function SignOutButton() {
    // const firebase = useContext(FirebaseContext);

    return (
        <Button
            variant="contained"
            color="secondary"
        // onClick={firebase.doSignOut}
        >
            Sign Out
        </Button>
    );
};