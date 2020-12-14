import React, { useContext } from 'react';

import { Link, ListItem, Typography, ListItemIcon, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import { FirebaseContext } from '../../utils/firebase';

const useStyles = makeStyles((theme) => ({
    button: {
        paddingTop: ".2rem",
        paddingBottom: ".2rem",
    }
}));

export default function SourcesList(props) {
    const classes = useStyles();
    const firebase = useContext(FirebaseContext);

    return (
        <ListItem>
            <Typography noWrap>
                <Link href={"#" + props.source.section_id}>
                    {props.source.order + ": "}
                </Link>
                <Link href={props.source.url}>
                    {props.source.url}
                </Link>
            </Typography>
            {(firebase.auth.currentUser.uid === props.source.user) &&
                <ListItemIcon>
                    <IconButton className={classes.button}>
                        <EditIcon color="secondary" />
                    </IconButton>
                    <IconButton className={classes.button}>
                        <DeleteIcon color="secondary" />
                    </IconButton>
                </ListItemIcon>
            }
        </ListItem>
    )
}