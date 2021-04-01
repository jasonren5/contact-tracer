import React from 'react';
import { useMediaQuery } from 'react-responsive';

import { Container, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    body: {
        marginTop: '1%',
    },
}));

export default function ModPortal() {
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
    const classes = useStyles();
    return (
        <Container
            component="main"
            className={classes.body}
            maxWidth={isTabletOrMobile ? 'xs' : "xl"}
        >
            <Typography>Hi</Typography>
        </Container>
    );
}