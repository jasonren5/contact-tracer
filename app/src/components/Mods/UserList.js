import React, { useContext, useState, useEffect } from 'react';

import {
    Typography,
    Paper,
    List,
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
import { FirebaseContext } from '../../utils/firebase';
import { getUserList, banUser, unbanUser } from '../../utils/functions/users';
import PersonListing from './UserListing';
import { Block, FilterList, Gavel, LockOpen, Person, VerifiedUser } from '@material-ui/icons';

const useStyles = makeStyles(() => ({
    body: {
        marginTop: "1em",
        marginBottom: "1em",
        paddingBottom: "1em",
    },

    title: {
        fontWeight: "bold"
    },
    editButtonWrapper: {
        position: "absolute",
        top: 0,
        right: 40,
    },
    wrapper: {
        position: "relative",
    }
}));

export default function UserList() {
    const classes = useStyles();
    const firebase = useContext(FirebaseContext);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const [userList, setUserList] = useState([]);
    const [filterUserList, setFilterUserList] = useState([]);
    const [filterValue, setFilterValue] = useState("all");

    // TODO: Filter by admin, banned, unbanned, and mod. Maybe sort by contributions

    // TODO: Mobile friendly

    useEffect(() => {
        getUserList(firebase).then((users) => {
            users.forEach((user) => {
                user.processing_changes = false;
            });
            console.log(users);
            setUserList(users);
        }).catch((err) => {
            console.log(err);
        })
    }, []);

    useEffect(() => {
        setFilterUserList(userList);
        adjustFilterList();
    }, [userList]);

    useEffect(() => {
        adjustFilterList();
    }, [filterValue]);

    const adjustFilterList = () => {
        if (filterValue === "admin") {
            const finalList = userList.filter(user => user.admin === true);
            setFilterUserList(finalList);
        }
        else if (filterValue === "mod") {
            const finalList = userList.filter(user => user.expertises.length > 0);
            setFilterUserList(finalList);
        }
        else if (filterValue === "banned") {
            const finalList = userList.filter(user => user.banned === true);
            setFilterUserList(finalList);
        }
        else if (filterValue === "unbanned") {
            const finalList = userList.filter(user => user.banned === false);
            setFilterUserList(finalList);
        }
        else if (filterValue === "all") {
            setFilterUserList(userList);
        }
    }

    const handleBan = (uid) => {
        console.log("ban", uid);
        let tempList = [...userList];
        tempList.forEach(function (user, i) { if (user.id == uid) tempList[i].processing = true; });
        setUserList(tempList);

        banUser(firebase, uid).then(() => {
            let tempList = [...userList];
            tempList.forEach(function (user, i) {
                if (user.id == uid) {
                    tempList[i].banned = true;
                    tempList[i].processing = false
                }
            });
            setUserList(tempList);
        }).catch((err) => {
            console.log(err);
        })
    }

    const handleUnban = (uid) => {
        console.log("unban", uid);
        let tempList = [...userList];
        tempList.forEach(function (user, i) { if (user.id == uid) tempList[i].processing = true; });
        setUserList(tempList);

        unbanUser(firebase, uid).then(() => {
            let tempList = [...userList];
            tempList.forEach(function (user, i) {
                if (user.id == uid) {
                    tempList[i].banned = false;
                    tempList[i].processing = false
                }
            });
            setUserList(tempList);
        }).catch((err) => {
            console.log(err);
        })
    }

    const handleOpenMenu = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    // Filter should persisteeu
    const handleChangeFilter = (filterType) => {
        setFilterValue(filterType);
        handleCloseMenu();
    }

    return (
        <div className={classes.wrapper}>
            <Paper className={classes.body}>
                <Typography variant="h4" className={classes.title}>User List</Typography>
                <div className={classes.editButtonWrapper} >
                    <IconButton
                        onClick={handleOpenMenu}
                        aria-label="filter-users"
                        color="primary"
                    >
                        <FilterList />
                    </IconButton>
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleCloseMenu}
                    >
                        <MenuItem disabled >Filter Users By:</MenuItem>
                        <MenuItem onClick={() => handleChangeFilter("all")}>
                            <ListItemIcon>
                                <Person fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="All" />
                        </MenuItem>
                        <MenuItem onClick={() => handleChangeFilter("banned")}>
                            <ListItemIcon>
                                <Block fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Banned" />
                        </MenuItem>
                        <MenuItem onClick={() => handleChangeFilter("unbanned")}>
                            <ListItemIcon>
                                <LockOpen fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Unbanned" />
                        </MenuItem>
                        <MenuItem onClick={() => handleChangeFilter("admin")}>
                            <ListItemIcon>
                                <VerifiedUser fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Admins" />
                        </MenuItem>
                        <MenuItem onClick={() => handleChangeFilter("mod")}>
                            <ListItemIcon>
                                <Gavel fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Moderators" />
                        </MenuItem>
                    </Menu>
                </div>
                <List>
                    {filterUserList.map((user) =>
                        <PersonListing
                            user={user}
                            key={user.id}
                            handleBan={handleBan}
                            handleUnban={handleUnban}
                        />
                    )}
                </List>
            </Paper>
        </div >
    );
}