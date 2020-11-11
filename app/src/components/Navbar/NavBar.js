import React from 'react';
import firebase from 'firebase';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Button
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

export default function Navbar() {
    const handleLogout = () => {
        firebase.auth().signOut()
            .then(function () {
                // Sign-out successful.
            })
            .catch(function (error) {
                // An error happened
                console.log(error);
            });
    }

    const handleNewArticle = () => {
        console.log("creating article...");
        // let createBlankArticle = firebase.functions().httpsCallable("createBlankArticle");
        // createBlankArticle().then(response => console.log(response));
    }

    return (
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
                <Button color="inherit" onClick={handleNewArticle}>create blank article</Button>
            </Toolbar>
        </AppBar>
    );
}