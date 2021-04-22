import React, { useState, useContext, useEffect } from 'react';
import { FirebaseContext } from '../../utils/firebase';

import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Button,
    Link,
} from '@material-ui/core';
import { Home, Search } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

import CreateArticleModal from '../Modals/CreateArticleModal';
import ProfileButton from './ProfileButton';
import SignInMenu from './SignInMenu';
import MobileMenu from './MobileMenu';
import { useMediaQuery } from 'react-responsive';

import { verifyAdmin, verifyMod } from '../../utils/functions/applications';

const useStyles = makeStyles(() => ({
    title: {
        flexGrow: 1,
        textAlign: "left",
    },
    root: {
        flexGrow: 1,
    },
    navButton: {
        fontSize: 15,
    },
    activeButton: {
        fontSize: 15,
        fontWeight: "bold"
    },
    placeHolder: {
        display: "inline",
    },
}));

// low-pri: navbar flashing login and logout - not easy to fix
// low-pri: Center Title - not easy to do while also staying mobile friendly
export default function Navbar() {
    const [newArticleIsOpen, setNewArticleIsOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isMod, setIsMod] = useState(false);
    const [username, setUsername] = useState();
    const classes = useStyles();
    const firebase = useContext(FirebaseContext);
    const currentUser = firebase.auth.currentUser;
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });

    useEffect(() => {
        if (currentUser) {
            setUsername(currentUser.email.substring(0, currentUser.email.indexOf("@")));
        }
    }, [currentUser]);

    useEffect(() => {
        verifyAdmin(firebase).then((data) => {
            if (data.admin) {
                setIsAdmin(true);
            }
            else {
                setIsAdmin(false);
            }
        }).catch((err) => {
            setIsAdmin(false);
            console.log(err);

        })
    }, []);

    useEffect(() => {
        verifyMod(firebase).then((data) => {
            if (data.mod) {
                setIsMod(true);
            }
            else {
                setIsMod(false);
            }
        }).catch((err) => {
            setIsMod(false);
            console.log(err);
        })
    }, []);


    const openNewArticleModal = () => {
        setNewArticleIsOpen(true);
    };

    const closeNewArticleModal = () => {
        setNewArticleIsOpen(false);
    };

    const LoggedInButtons = () => (
        <div className="loggedInButtons">
            <Button color="inherit" href="/" className={classes.navButton}>Home</Button>
            <Button color="inherit" href="/browse/contribute" className={classes.navButton}>Contribute</Button>
            <IconButton color="inherit" href="/search">
                <Search style={{ color: "#fff" }} fontSize="large" />
            </IconButton>
            <ProfileButton
                username={username}
                isAdmin={isAdmin}
                isMod={isMod}
            />
        </div >
    );

    const LoggedOutButtons = () => (
        <div className="loggedOutButtons">
            <Button color="inherit" href="/" className={classes.navButton}>Home</Button>
            <IconButton color="inherit" href="/search" className={classes.navButton}>
                <Search style={{ color: "#fff" }} fontSize="large" />
            </IconButton>
            <SignInMenu />
        </div>
    );
    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" variant="link" href="/" aria-label="home">
                        <Home />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        <Link href="/" color="inherit" underline="none">
                            Crowd Sourced News
                        </Link>
                    </Typography>
                    {!isTabletOrMobile ?
                        <div className={classes.placeHolder}>
                            {currentUser ?
                                <LoggedInButtons /> :
                                <LoggedOutButtons />
                            }
                        </div>
                        :
                        <MobileMenu
                            username={username}
                            currentUser={currentUser}
                            openNewArticleModal={openNewArticleModal}
                            isAdmin={isAdmin}
                            isMod={isMod}
                        />
                    }
                </Toolbar>
            </AppBar>
            <CreateArticleModal isOpen={newArticleIsOpen} closeModal={closeNewArticleModal} />
        </div>
    );
}