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

const INITIAL_STATE = {
    articles: []
};

export default function ArticleList(props) {
    const classes = useStyles();

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
                direction={props.mediaQuery ? "column" : "row"}
                justify="center"
                alignItems="center"
                spacing={4}
            >
                {state.articles.length > 0 && state.articles.map(article => {
                    return <ArticleContainer key={article.id} article={article} mediaQuery={props.mediaQuery} />;
                })
                }
            </Grid>
        </div>
    );
}