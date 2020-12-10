import React from 'react';
import { useHistory } from "react-router-dom";

import {
    IconButton,
    Menu,
    MenuItem,
    ListItemText,
    ListItemIcon
} from '@material-ui/core';
import {
    AccountCircle,
    LockOpen,
    AddCircle,
    Person
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    root: {
        display: "inline",
    },
}));


export default function SignInMenu() {
    const history = useHistory();
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSignIn = () => {
        handleClose();
        history.push('/signin');
    }

    const handleSignUp = () => {
        handleClose();
        history.push('/signup');
    }

    return (
        <div className={classes.root}>
            <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
            >
                <AccountCircle style={{ color: "#505257" }} fontSize="large" />
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
                <MenuItem disabled>
                    <ListItemIcon>
                        <Person />
                    </ListItemIcon>
                    <ListItemText primary="Signed Out" />
                </MenuItem>
                <MenuItem onClick={handleSignIn}>
                    <ListItemIcon>
                        <LockOpen />
                    </ListItemIcon>
                    <ListItemText primary="Sign In" />
                </MenuItem>
                <MenuItem onClick={handleSignUp} href="/">
                    <ListItemIcon>
                        <AddCircle />
                    </ListItemIcon>
                    <ListItemText primary="Create Account" />
                </MenuItem>
            </Menu>
        </div>
    );
}