import React from 'react';

import { Typography, ListItem, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
}));

export default function SourcesList(props) {
    const classes = useStyles();
    return (
        <ListItem>
            <Typography noWrap>
                {props.source.order + ": "}
                <Link href={props.source.url}>
                    {props.source.url}
                </Link>
            </Typography>
        </ListItem>
    )
}