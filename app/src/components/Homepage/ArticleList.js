import React, { useState, useEffect, useContext } from 'react';
import { getAllArticles } from '../../utils/functions/articles';
import ArticleContainer from './ArticleContainer';

import { Grid, CssBaseline } from '@material-ui/core';
import PageLoading from '../../components/Loading/PageLoading';
import { makeStyles } from '@material-ui/core/styles';

import { FirebaseContext } from '../../utils/firebase';

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
    const firebase = useContext(FirebaseContext);

    const [state, setState] = useState({
        ...INITIAL_STATE
    });

    useEffect(() => {
        getAllArticles(firebase).then((articles) => {
            console.log(articles);
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
                {state.articles ?
                    state.articles.map(article => {
                        return <ArticleContainer key={article.id} article={article} mediaQuery={props.mediaQuery} />;
                    })
                    :
                    <PageLoading />
                }
            </Grid>
        </div>
    );
}