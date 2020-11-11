import React from 'react';
import { CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    circularLoad: {
        marginTop: '10%',
    },
}));

export default function PageLoading() {
    const classes = useStyles();

    return (
        <CircularProgress className={classes.circularLoad} size={200} color="secondary" />
    );
}