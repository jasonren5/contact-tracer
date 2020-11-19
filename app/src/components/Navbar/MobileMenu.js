import React, { useContext } from 'react';
import { useHistory } from "react-router-dom";
import { FirebaseContext } from '../../utils/firebase';

import {
    IconButton,
    Menu,
    MenuItem,
    ListItemText,
    ListItemIcon
} from '@material-ui/core';
import {
    ExitToApp,
    Visibility,
    Person,
    Add,
    Home,
    LockOpen
} from '@material-ui/icons';

import MenuIcon from '@material-ui/icons/Menu';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        display: "inline",
    },
}));


export default function ProfileButton(props) {
    const history = useHistory();
    const firebase = useContext(FirebaseContext);
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSignOut = () => {
        handleClose();
        firebase.doSignOut();
        history.push('/');
    }

    const handleViewProfile = () => {
        handleClose();
        history.push('/profile');
    }

    const handleHome = () => {
        handleClose();
        history.push('');
    }

    const handleSignIn = () => {
        firebase.doSignOut();
        history.push('/signin');
    }

    const handleSignUp = () => {
        firebase.doSignOut();
        history.push('/signup');
    }

    const SignedInMobile = () => (
        <div className="signed-in-mobile">
            <MenuItem disabled>
                <ListItemIcon>
                    <Person fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={props.username} />
            </MenuItem>
            <MenuItem onClick={handleHome}>
                <ListItemIcon>
                    <Home fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Home" />
            </MenuItem>
            <MenuItem onClick={props.openNewArticleModal}>
                <ListItemIcon>
                    <Add fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Create Article" />
            </MenuItem>
            <MenuItem onClick={handleViewProfile}>
                <ListItemIcon>
                    <Visibility fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="View Profile" />
            </MenuItem>
            <MenuItem onClick={handleSignOut} href="/">
                <ListItemIcon>
                    <ExitToApp fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Sign Out" />
            </MenuItem>
        </div>
    );

    const SignedOutMobile = () => (
        <div className="signed-out-mobile">
            <MenuItem onClick={handleHome}>
                <ListItemIcon>
                    <Home fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Home" />
            </MenuItem>
            <MenuItem onClick={handleSignIn}>
                <ListItemIcon>
                    <LockOpen fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Sign In" />
            </MenuItem>
            <MenuItem onClick={handleSignUp} href="/">
                <ListItemIcon>
                    <Add fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Create Account" />
            </MenuItem>
        </div>
    );

    return (
        <div className={classes.root}>
            <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
            >
                <MenuIcon />
            </IconButton>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
            >
                {props.currentUser ?
                    <SignedInMobile /> :
                    <SignedOutMobile />
                }
            </Menu>
        </div>
    );
}