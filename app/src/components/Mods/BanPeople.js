import React, { useContext, useState, useEffect } from 'react';

import {
    Typography,
    Paper,
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
import { FirebaseContext } from '../../utils/firebase';
import { getUserList, banUser, unbanUser } from '../../utils/functions/users';
import PersonListing from './PersonListing';

const useStyles = makeStyles(() => ({
    body: {
        marginTop: "2rem",
        marginBottom: "2rem",
        margin: "20rem"
    },
    bodyText: {
        paddingBottom: "2rem",
        paddingTop: ".5em",
        paddingLeft: "5em",
        paddingRight: "5em",
    },
    title: {
        fontWeight: "bold"
    },
}));

export default function BanPeople() {
    const classes = useStyles();
    const firebase = useContext(FirebaseContext);

    const [userList, setUserList] = useState([]);

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

    return (
        <div className="banned-words-view">
            <Paper className={classes.body}>
                <Typography variant="h4" className={classes.title}>Ban Users</Typography>
                <Typography className={classes.bodyText}>
                    Test
                </Typography>
                {userList.map((user) =>
                    <PersonListing
                        user={user}
                        key={user.id}
                        handleBan={handleBan}
                        handleUnban={handleUnban}
                    />
                )}
            </Paper>
        </div >
    );
}