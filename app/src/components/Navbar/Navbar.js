import React, { useState, useContext, useEffect } from 'react';
import { FirebaseContext } from '../../utils/firebase';

import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Button,
    Link
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { Home } from "@material-ui/icons"

import CreateArticleModal from './CreateArticleModal';
import { makeStyles } from '@material-ui/core/styles';
import SignOutButton from '../Auth/SignOut';


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


    useEffect(() => {
        // TODO: Once we have an actual user database, grab that instead of this jank username
        if (currentUser) {
            setUsername(currentUser.email.substring(0, currentUser.email.indexOf("@")));
        }
    }, [currentUser]);

    const handleSignOut = () => {
        firebase.doSignOut();
    }

    const openNewArticleModal = () => {
        setnewArticleIsOpen(true);
    };

    const closeNewArticleModal = () => {
        setnewArticleIsOpen(false);
    };

    const loggedInButtons = () => (
        <div className="loggedInButtons">
            {/* <Typography variant="h6" className={classes.root} >Welcome {username}! </Typography> */}
            <Button color="inherit" onClick={openNewArticleModal} className={classes.navButton}>Create Blank Article</Button>
            <Button color="inherit" onClick={handleSignOut} href="/" className={classes.navButton}>Sign Out</Button>
        </div>
    );

    const loggedOutButtons = () => (
        <div className="loggedOutButtons">
            <Button color="inherit" onClick={handleSignOut} href="/signin" className={classes.navButton}>Sign In</Button>
            <Button color="inherit" onClick={handleSignOut} href="/signup" className={classes.navButton}>Create Account</Button>
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
                    {/* <IconButton edge="start" color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton> */}
                    <Button color="inherit" href="/" className={classes.navButton}>Home</Button>
                    {currentUser ?
                        loggedInButtons() :
                        loggedOutButtons()
                    }
                </Toolbar>
            </AppBar>
            <CreateArticleModal isOpen={newArticleIsOpen} closeModal={closeNewArticleModal} />
        </div>
    );
}