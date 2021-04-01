import React from 'react';
import { useMediaQuery } from 'react-responsive';

import { Container, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import FilterOptions from '../../components/Mods/FilterOptions';

const useStyles = makeStyles(() => ({
    body: {
        marginTop: '1%',
        textAlign: 'center'
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
            <FilterOptions />
        </Container>
    );
}