import React, { useEffect, useContext, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

import { Container, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { verifyMod } from '../../utils/functions/applications';
import { FirebaseContext } from '../../utils/firebase';
import PageLoading from '../../components/Loading/PageLoading';

// import FilterOptions from '../../components/Mods/FilterOptions';

const useStyles = makeStyles(() => ({
    body: {
        marginTop: '1%',
        textAlign: 'center'
    },
    title: {
        marginBottom: ".5em",
    }
}));

export default function ModPortal() {
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
    const classes = useStyles();

    const [isMod, setIsMod] = useState(false);
    const firebase = useContext(FirebaseContext);

    useEffect(() => {
        verifyMod(firebase).then((data) => {
            if (!data.mod) {
                window.location.href = "/";
            }
            else {
                setIsMod(true);
            }
        }).catch((err) => {
            console.log(err);
            window.location.href = "/";
        })
    }, []);



    return (
        <Container
            component="main"
            className={classes.body}
            maxWidth={isTabletOrMobile ? 'xs' : "xl"}
        >
            {isMod ?
                <div>
                    <Typography variant="h2" className={classes.title}>Mod Portal</Typography>
                    {/* <FilterOptions /> */}
                </div>
                :
                <PageLoading />
            }
        </Container>
    );
}