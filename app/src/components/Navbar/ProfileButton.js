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
    AccountCircle,
    ExitToApp,
    Visibility,
    Person,
    VerifiedUser,
    Gavel
} from '@material-ui/icons';
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
        history.push('');
    }

    const handleViewProfile = () => {
        handleClose();
        history.push('/profile');
    }

    const handleViewAdmin = () => {
        handleClose();
        history.push('/admin');
    }

    const handleViewMod = () => {
        handleClose();
        history.push('/mod');
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
                <AccountCircle style={{ color: "#fff" }} fontSize="large" />
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
                    <ListItemText primary={props.username} />
                </MenuItem>
                {props.isAdmin &&
                    <MenuItem onClick={handleViewAdmin}>
                        <ListItemIcon>
                            <VerifiedUser />
                        </ListItemIcon>
                        <ListItemText primary="Admin Portal" />
                    </MenuItem>
                }
                {props.isMod &&
                    <MenuItem onClick={handleViewMod}>
                        <ListItemIcon>
                            <Gavel />
                        </ListItemIcon>
                        <ListItemText primary="Mod Portal" />
                    </MenuItem>
                }
                <MenuItem onClick={handleViewProfile}>
                    <ListItemIcon>
                        <Visibility />
                    </ListItemIcon>
                    <ListItemText primary="View Profile" />
                </MenuItem>
                <MenuItem onClick={handleSignOut} href="/">
                    <ListItemIcon>
                        <ExitToApp />
                    </ListItemIcon>
                    <ListItemText primary="Sign Out" />
                </MenuItem>
            </Menu>
        </div>
    );
}