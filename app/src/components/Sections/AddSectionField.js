import React from 'react'

import { IconButton } from '@material-ui/core';
import AddBoxIcon from '@material-ui/icons/AddBox';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    container: {
        margin: "1rem",
        borderStyle: "dashed",
        border: "2px #37393b",
        width: "100%",
        borderRadius: "8px",
        opacity: ".4",
        transition: ".5s ease",
        "&:hover": {
            background: "#8eacbb",
            backgroundClip: "content-box",
            opacity: "1",
        },
    },
    button: {
        padding: ".25rem",
    }
}));


export default function AddSectionField() {
    const classes = useStyles();

    return (
        <div className={classes.container}>
            <IconButton className={classes.button} aria-label="add-section" color="secondary">
                <AddBoxIcon fontSize="large" />
            </IconButton>
        </div>
    );
}