import React, { useState, useEffect } from 'react';

import { Container, List, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import SourceItem from './SourceItem';
import EditSourceItem from './EditSourceItem';

const useStyles = makeStyles((theme) => ({
    root: {
        // flexGrow: 1,
        padding: "1rem",
        marginTop: "2rem",
        marginBottom: "1rem",
        textAlign: "left",
    },
    title: {
        textAlign: "center",
    },

}));

export default function SourcesList(props) {
    const [displaySources, setDisplaySources] = useState([]);
    const classes = useStyles();

    useEffect(() => {
        var newSourceList = [];
        props.sources.map((source, index) => {
            if (!source.deleted) {
                source["order"] = index + 1;
                newSourceList.push(source);
            }
        });
        setDisplaySources(newSourceList);
    }, [props.sources]);

    return (
        <Container maxWidth="xl">
            <Paper elevation={3} className={classes.root}>
                <Typography variant="h4" className={classes.title}>Sources</Typography>
                <List>
                    {displaySources.map((source) => {
                        return props.editing ?
                            <EditSourceItem key={source.order} source={source} />
                            :
                            <SourceItem key={source.order} source={source} />
                    }
                    )}
                </List>
            </Paper>
        </Container>
    )
}