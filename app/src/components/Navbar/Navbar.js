import React, { useState } from 'react';
import firebase from 'firebase';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Button
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

import CreateArticleModal from './CreateArticleModal';

export default function Navbar() {
    const [newArticleIsOpen, setnewArticleIsOpen] = useState(false);

    const handleLogout = () => {
        firebase.auth().signOut()
            .then(function () {
                // Sign-out successful.
            })
            .catch(function (error) {
                // An error happened
                console.log(error);
            });
    };

    const openNewArticleModal = () => {
        setnewArticleIsOpen(true);
    };

    const closeNewArticleModal = () => {
        setnewArticleIsOpen(false);
    };

    return (
        <div className="navbar">
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6">
                        News
                </Typography>
                    <Button color="inherit" href="/">home</Button>
                    <Button color="inherit" onClick={handleLogout} href="/">logout</Button>
                    <Button color="inherit" onClick={handleLogout} href="/signin">sign in</Button>
                    <Button color="inherit" onClick={openNewArticleModal}>create blank article</Button>
                </Toolbar>
            </AppBar>
            <CreateArticleModal isOpen={newArticleIsOpen} closeModal={closeNewArticleModal} />
        </div>
    );
}