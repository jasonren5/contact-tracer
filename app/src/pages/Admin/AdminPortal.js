import React, { useEffect, useState, useContext } from 'react';
import ApplicationList from '../../components/Admin/ApplicationList';
import { Container, Typography } from '@material-ui/core';
import { verifyAdmin } from '../../utils/functions/applications';
import { FirebaseContext } from '../../utils/firebase';

import FilterOptions from '../../components/Mods/FilterOptions';

export default function AdminPortal() {
    const [isAdmin, setIsAdmin] = useState(false);
    const firebase = useContext(FirebaseContext);

    useEffect(() => {
        verifyAdmin(firebase).then((data) => {
            if (!data.admin) {
                window.location.href = "/";
            }
            else {
                setIsAdmin(true);
            }
        }).catch((err) => {
            console.log(err);
            window.location.href = "/";
        })
    }, []);

    return (
        <Container component="main" maxWidth="xl">
            {isAdmin &&
                <div>
                    <Typography variant="h2">Admin Portal</Typography>
                    <FilterOptions />
                </div>
            }
            <ApplicationList />
        </Container>
    );
}