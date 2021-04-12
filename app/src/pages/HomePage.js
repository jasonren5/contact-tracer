import React from 'react';
import ArticleList from '../components/Homepage/ArticleList';
import { WeatherWidget, StocksWidget, UserCountWidget } from '../components/Widgets';
import { useMediaQuery } from 'react-responsive';

import { Container, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    body: {
        marginTop: '1%',
    },
}));

// TODO: Need to make sure that the homepage renders the widgets after articles are loaded.
export default function HomePage() {
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
    const classes = useStyles();
    return (
        <Container
            component="main"
            className={classes.body}
            maxWidth={isTabletOrMobile ? 'xs' : "xl"}
        >
            <Grid container justify="center">
                <Grid item>
                    <WeatherWidget />
                </Grid>
                <Grid item>
                    <UserCountWidget />
                </Grid>
                <Grid item>
                    <StocksWidget />
                </Grid>
            </Grid>
            <ArticleList mediaQuery={isTabletOrMobile} />
        </Container>
    );
}