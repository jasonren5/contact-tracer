import React from 'react';

import {
    Typography,
    Button,
    CircularProgress,
    Link,
    Grid,
    Paper
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    body: {
        margin: "2em",
        marginRight: "20%",
        marginLeft: "20%",
        paddingLeft: "1em",
        paddingRight: "1em",
    },
}));


export default function PersonListing(props) {
    const classes = useStyles();

    return (
        <Paper className={classes.body}>
            <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
                spacing={3}
            >
                <Grid item>
                    <Typography>
                        <Link href={`/user/${props.user.id}`} variant="inherit">
                            {props.user.displayName}
                        </Link>
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography>
                        Banned Status: {props.user.banned ? "Banned" : "Not Banned"}
                    </Typography>
                </Grid>
                <Grid item>
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
                </Grid>
            </Grid>
        </Paper>
    );
}