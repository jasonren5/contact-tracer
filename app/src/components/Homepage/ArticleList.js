import React, { useState, useEffect } from 'react';
import { getAllArticles } from '../../utils/functions/articles';
import ArticleContainer from './ArticleContainer';

import { Container, Grid, CssBaseline } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useMediaQuery } from 'react-responsive'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    }
}));

export default function ArticleList() {
    const classes = useStyles();
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });

    const INITIAL_STATE = {
        articles: []
    };
    const [state, setState] = useState({
        ...INITIAL_STATE
    });

    useEffect(() => {
        getAllArticles().then((articles) => {
            setState({ articles: articles.article_list });
        }).catch((err) => {
            console.log(err);
        })
    }, []);

    return (

        <Container component="main" className="Article List" maxWidth={isTabletOrMobile ? 'xs' : "lg"}>
            <CssBaseline />
            <div className={classes.root}>
                <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                    spacing={4}
                >
                    {state.articles.length > 0 && state.articles.map(article => {
                        return <ArticleContainer key={article.id} article={article} />;
                    })
                    }
                </Grid>
            </div>
        </Container>
    );
}