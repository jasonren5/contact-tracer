import React, { useState, useEffect } from 'react';
import { getAllArticles } from '../../utils/functions/articles';
import ArticleContainer from './ArticleContainer';

import { Grid, CssBaseline } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    }
}));

export default function ArticleList() {
    const classes = useStyles();
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
        <div className={classes.root}>
            <CssBaseline />
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
    );
}