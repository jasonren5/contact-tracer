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
import { getUserList } from '../../utils/functions/users';

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


    useEffect(() => {
        getUserList(firebase).then((users) => {
            console.log(users);
        }).catch((err) => {
            console.log(err);
        })
    }, []);

    return (
        <div className="banned-words-view">
            <Paper className={classes.body}>
                <Typography variant="h4" className={classes.title}>Ban Users</Typography>
                <Typography className={classes.bodyText}>
                    Test
                </Typography>
            </Paper>
        </div >
    );
}