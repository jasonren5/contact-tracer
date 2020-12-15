import React from 'react';

import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    text: {
        padding: ".5rem",
        marginTop: ".1rem",
    }
}));

export default function LastUpdated(props) {
    const classes = useStyles();

    return (
        <Typography color="secondary" variant="h6" className={classes.text}>
            Article Last Updated: {props.updated}
        </Typography>
    );
}