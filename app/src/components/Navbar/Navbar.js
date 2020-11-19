import React, { useState, useContext, useEffect } from 'react';
import { FirebaseContext } from '../../utils/firebase';
import { useHistory } from "react-router-dom";

import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Button,
    Link,
} from '@material-ui/core';
import { Home } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

import CreateArticleModal from './CreateArticleModal';
import ProfileButton from './ProfileButton';

const useStyles = makeStyles((theme) => ({
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
}));


export default function Navbar() {
    const [newArticleIsOpen, setnewArticleIsOpen] = useState(false);
    const [username, setUsername] = useState();
    const classes = useStyles();
    const firebase = useContext(FirebaseContext);
    const currentUser = firebase.auth.currentUser;
    const history = useHistory();

    useEffect(() => {
        // TODO: Once we have an actual user database, grab that instead of this jank username
        if (currentUser) {
            setUsername(currentUser.email.substring(0, currentUser.email.indexOf("@")));
        }
    }, [currentUser]);

    const handleSignOut = () => {
        firebase.doSignOut();
        history.push('/');
    }

    const openNewArticleModal = () => {
        setnewArticleIsOpen(true);
    };

    const closeNewArticleModal = () => {
        setnewArticleIsOpen(false);
    };

    const LoggedInButtons = () => (
        <div className="loggedInButtons">
            <Button color="inherit" onClick={openNewArticleModal} className={classes.navButton}>Create Blank Article</Button>
            <ProfileButton username={username} />
        </div >
    );

    const LoggedOutButtons = () => (
        <div className="loggedOutButtons">
            <Button color="inherit" onClick={handleSignOut} href="/signin" className={classes.navButton}>Sign In</Button>
            <Button color="inherit" onClick={handleSignOut} href="/signup" className={classes.navButton}>Create Account</Button>
        </div>
    );

    // TODO: Need to make the navbar more mobile friendly
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
                    <Button color="inherit" href="/" className={classes.navButton}>Home</Button>
                    {currentUser ?
                        <LoggedInButtons /> :
                        <LoggedOutButtons />
                    }
                </Toolbar>
            </AppBar>
            <CreateArticleModal isOpen={newArticleIsOpen} closeModal={closeNewArticleModal} />
        </div>
    );
}