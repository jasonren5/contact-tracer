import React from 'react';

import { Typography, ListItem, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
}));

export default function SectionSources(props) {
    const classes = useStyles();
    return (
        <div className="root">
            {props.sources.map((source) =>
                <Typography key={source.url}>{source.order}</Typography>
            )
            }
        </div>
    )
}