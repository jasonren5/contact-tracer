import React, { useState, useContext, useEffect } from 'react';

import { Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { FirebaseContext } from '../../utils/firebase';
import { getUsersCount } from '../../utils/functions/widgets';

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(2),
        textAlign: "center",
        margin: "1.5em",
        width: "15rem",
        marginTop: ".25em",
        marginBottom: ".5em",
    }
}));


export default function UserCountWidget() {
    const [userCount, setUserCount] = useState();
    const classes = useStyles();
    const firebase = useContext(FirebaseContext);

    useEffect(() => {
        getUsersCount(firebase).then((res) => {
            setUserCount(res.userCount);
        }).catch((err) => {
            console.log(err);
        })
    }, []);


    return (
        <div className="userCountContainer">
            {userCount &&
                <Paper className={classes.paper}>
                    <Typography variant="h6">Active Users: {userCount}</Typography>
                </Paper>
            }
        </div >
    );
}

