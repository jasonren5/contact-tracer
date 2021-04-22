import React, { useContext, useState, useEffect } from 'react';

import {
    Typography,
    Paper,
    Button,
    IconButton,
    Grid,
    TextField,
    CircularProgress
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
import { FirebaseContext } from '../../utils/firebase';
import { banUser, getUserList, unbanUser } from '../../utils/functions/users';

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

export default function FilterOptions() {
    const classes = useStyles();
    const firebase = useContext(FirebaseContext);

    const [userList, setUserList] = useState([]);


    useEffect(() => {
        getUserList(firebase).then((users) => {
            console.log(users);
            setUserList(users);
        }).catch((err) => {
            console.log(err);
        })
    }, []);

    const handleBan = () => {
        const banID = "1ZboUb8DwfPIedjVwbFEqncswki1";

        console.log("ban", banID);
        banUser(firebase, banID).then((res) => {
            console.log(res);
        }).catch((err) => {
            console.log(err);
        })
    }

    const handleUnban = () => {
        const banID = "1ZboUb8DwfPIedjVwbFEqncswki1";

        console.log("unban", banID);
        unbanUser(firebase, banID).then((res) => {
            console.log(res);
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
                    <Typography key={user.id} className={classes.bodyText}>{user.displayName}, banned: {user.banned.toString()}</Typography>
                )}
                <Button variant="contained" color="secondary" onClick={handleBan}>
                    Ban
                </Button>
                <Button variant="contained" color="secondary" onClick={handleUnban}>
                    Unban
                </Button>
            </Paper>
        </div >
    );
}