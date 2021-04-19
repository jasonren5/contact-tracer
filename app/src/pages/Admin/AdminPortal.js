import React, { useEffect, useState, useContext } from 'react';
import { useMediaQuery } from 'react-responsive';

import ApplicationList from '../../components/Admin/ApplicationList';
import { Container, Typography } from '@material-ui/core';
import { verifyAdmin } from '../../utils/functions/applications';
import { FirebaseContext } from '../../utils/firebase';

// import FilterOptions from '../../components/Mods/FilterOptions';
import PageLoading from '../../components/Loading/PageLoading';
import ForceSignInModal from '../../components/Modals/ForceSignInModal';

export default function AdminPortal() {
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });

    const [isAdmin, setIsAdmin] = useState(false);
    const [permissionRender, setPermissionRender] = useState(false);
    const firebase = useContext(FirebaseContext);

    const handleCloseModal = () => {
        setIsAdmin(true);
    }

    useEffect(() => {
        verifyAdmin(firebase).then((data) => {
            setPermissionRender(true);
            if (data.admin) {
                setIsAdmin(true);
            }
        }).catch((err) => {
            console.log(err);
            window.location.href = "/";
        })
    }, []);

    return (
        <Container component="main" maxWidth={isTabletOrMobile ? 'xs' : "xl"}>
            {permissionRender ?
                <div className="Base Container">
                    {isAdmin ?
                        <div>
                            <Typography variant="h2">Admin Portal</Typography>
                            {/* <FilterOptions /> */}
                            <ApplicationList />
                        </div>
                        :
                        <ForceSignInModal
                            isOpen={!isAdmin}
                            closeModal={handleCloseModal}
                            accessPage
                            accessLevel="Admin"
                        />
                    }
                </div>
                :
                <PageLoading />
            }
        </Container>
    );
}