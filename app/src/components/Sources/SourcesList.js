import React from 'react';

import { Container, List, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import SourceItem from './SourceItem';
import EditSourceItem from './EditSourceItem';

const useStyles = makeStyles((theme) => ({
    root: {
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
    const classes = useStyles();

    return (
        <Container maxWidth="xl">
            <Paper elevation={3} className={classes.root}>
                <Typography variant="h4" className={classes.title}>Sources</Typography>
                <List>
                    {props.sources.map((source) => {
                        return props.editing ?
                            <EditSourceItem key={source.order} source={source} refreshArticle={props.refreshArticle} />
                            :
                            <SourceItem key={source.order} source={source} />
                    }
                    )}
                </List>
            </Paper>
        </Container>
    )
}