import React from 'react';

import {
    Typography,
    Button,
    CircularProgress
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    title: {
        fontWeight: "bold"
    },
}));


export default function PersonListing(props) {
    const classes = useStyles();

    return (
        <div>
            <Typography className={classes.bodyText}>{props.user.displayName}, banned: {props.user.banned.toString()}</Typography>
            {props.user.banned ?
                <Button variant="contained" color="secondary" onClick={() => props.handleUnban(props.user.id)}>
                    {props.user.processing
                        ? <CircularProgress size={20} color="primary" /> :
                        "Unban User"
                    }
                </Button>
                :
                <Button variant="contained" color="secondary" onClick={() => props.handleBan(props.user.id)}>
                    {props.user.processing
                        ? <CircularProgress size={20} color="primary" /> :
                        "Ban User"
                    }
                </Button>
            }
        </div>
    );
}