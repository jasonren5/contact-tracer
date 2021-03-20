import React from 'react';
import ArticleList from '../components/Homepage/ArticleList';
import WeatherWidget from '../components/Homepage/WeatherWidget';
import UserCountWidget from '../components/Homepage/UserCountWidget';
import { useMediaQuery } from 'react-responsive';

import { Container, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    body: {
        marginTop: '1%',
    },
}));

export default function HomePage() {
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
    const classes = useStyles();
    return (
        <div className="home-page">
            <Container
                component="main"
                className={classes.body}
                maxWidth={isTabletOrMobile ? 'xs' : "xl"}
            >
                <WeatherWidget />
                <UserCountWidget />
                <ArticleList mediaQuery={isTabletOrMobile} />
            </Container>
        </div >
    );
}