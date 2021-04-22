import React, { useEffect, useContext, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

import { Container, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { verifyMod } from '../../utils/functions/applications';
import { FirebaseContext } from '../../utils/firebase';
import PageLoading from '../../components/Loading/PageLoading';

import FilterOptions from '../../components/Mods/FilterOptions';
import BanPeople from '../../components/Mods/BanPeople';
import ForceSignInModal from '../../components/Modals/ForceSignInModal';

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
    const [permissionRender, setPermissionRender] = useState(false);
    const firebase = useContext(FirebaseContext);

    const handleCloseModal = () => {
        setIsMod(true);
    }

    useEffect(() => {
        verifyMod(firebase).then((data) => {
            setPermissionRender(true);
            if (data.mod) {
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
            maxWidth={isTabletOrMobile ? 'xs' : "lg"}
        >
            {permissionRender ?
                <div className="Base Container">
                    {isMod ?
                        <div className="Permissions Loaded">
                            <Typography variant="h2" className={classes.title}>Mod Portal</Typography>
                            <FilterOptions />
                            <BanPeople />
                        </div>
                        :
                        <ForceSignInModal
                            isOpen={!isMod}
                            closeModal={handleCloseModal}
                            accessPage
                            accessLevel="Moderator"
                        />
                    }
                </div>
                :
                <PageLoading />
            }
        </Container>
    );
}