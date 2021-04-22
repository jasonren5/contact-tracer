import React from 'react';

import {
    Button,
    CircularProgress,
    Paper,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemSecondaryAction
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
import { Person, Block, LockOpen } from '@material-ui/icons';
var Highlight = require('react-highlighter');

const useStyles = makeStyles(() => ({
    body: {
        margin: "2em",
        marginRight: "20%",
        marginLeft: "20%",
        paddingLeft: "1em",
        paddingRight: "1em",
    },
}));


export default function UserListing(props) {
    const classes = useStyles();

    const highlightTerm = props.searchTerm ? props.searchTerm : "";

    function ListItemLink(props) {
        return <ListItem button component="a" {...props} />;
    }

    return (
        <Paper className={classes.body}>
            <ListItemLink href={`/user/${props.user.id}`}>
                <ListItemIcon>
                    <Person />
                </ListItemIcon>
                <ListItemText
                    secondary={props.user.admin ? "Admin" : `Banned Status: ${props.user.banned ? "Banned" : "Not Banned"}`}
                >
                    <Highlight search={highlightTerm}>
                        {props.user.name}
                    </Highlight>
                </ListItemText>
                {props.user.expertises.length > 0 &&
                    <ListItemText secondary="Moderator" />
                }
                <ListItemText secondary={`# Contributions: ${props.user.number_of_contributions}`} />
                <ListItemSecondaryAction>
                    {!props.user.admin &&
                        <div className="Ban Button">
                            {
                                props.user.banned ?
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        startIcon={<LockOpen />}
                                        onClick={() => props.handleUnban(props.user.id)}
                                    >
                                        {props.user.processing
                                            ? <CircularProgress size={20} color="primary" /> :
                                            "Unban User"
                                        }
                                    </Button>
                                    :
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        startIcon={<Block />}
                                        onClick={() => props.handleBan(props.user.id)}
                                    >
                                        {props.user.processing
                                            ? <CircularProgress size={20} color="primary" /> :
                                            "Ban User"
                                        }
                                    </Button>
                            }
                        </div>
                    }
                </ListItemSecondaryAction>
            </ListItemLink>
        </Paper>
    );
}