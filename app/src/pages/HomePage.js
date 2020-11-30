import React from 'react';
import ArticleList from '../components/Homepage/ArticleList';
import { useMediaQuery } from 'react-responsive';

import { Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    body: {
        marginTop: '1%'
    }
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
                <ArticleList mediaQuery={isTabletOrMobile} />
            </Container>
        </div >
    );
}