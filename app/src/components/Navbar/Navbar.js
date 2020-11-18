import React, { useState } from 'react';
// import firebase from 'firebase';
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

const useStyles = makeStyles((theme) => ({
    title: {
        flexGrow: 1,
        textAlign: "left",
    },
    root: {
        flexGrow: 1,
    },
}));


export default function Navbar() {
    const [newArticleIsOpen, setnewArticleIsOpen] = useState(false);
    const classes = useStyles();

    // TODO: Import the signout button i already made in auth components
    // TODO: Remeber that signin should also sign the user out
    // const handleLogout = () => {
    //     auth.signOut()
    //         .then(function () {
    //             // Sign-out successful.
    //         })
    //         .catch(function (error) {
    //             // An error happened
    //             console.log(error);
    //         });
    // };

    const openNewArticleModal = () => {
        setnewArticleIsOpen(true);
    };

    const closeNewArticleModal = () => {
        setnewArticleIsOpen(false);
    };

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
                    <Button color="inherit" href="/">home</Button>
                    <Button color="inherit" href="/">logout</Button>
                    <Button color="inherit" href="/signin">sign in</Button>
                    <Button color="inherit" onClick={openNewArticleModal}>create blank article</Button>
                </Toolbar>
            </AppBar>
            <CreateArticleModal isOpen={newArticleIsOpen} closeModal={closeNewArticleModal} />
        </div>
    );
}