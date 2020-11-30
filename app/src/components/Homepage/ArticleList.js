import React, { useState, useEffect, useContext } from 'react';
import { getAllArticles } from '../../utils/functions/articles';
import ArticleContainer from './ArticleContainer';

import { Grid, CssBaseline, Card, Typography } from '@material-ui/core';
import PageLoading from '../../components/Loading/PageLoading';
import { makeStyles } from '@material-ui/core/styles';

import { FirebaseContext } from '../../utils/firebase';
import SearchBar from "material-ui-search-bar";


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    searchBar: {
        margin: '0 auto',
        marginBottom: '1rem',
        maxWidth: 800
    },
    card: {
        padding: theme.spacing(2),
        color: theme.palette.text.secondary,
        maxWidth: '600px',
        flexGrow: 1,
        marginTop: '1rem',
    },
}));

export default function ArticleList(props) {
    const classes = useStyles();
    const firebase = useContext(FirebaseContext);

    const [allArticles, setAllArticles] = useState([]);
    const [displayArticles, setDisplayArticles] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        getAllArticles(firebase).then((articles) => {
            setAllArticles(articles.article_list);
            setDisplayArticles(articles.article_list);
        }).catch((err) => {
            console.log(err);
        })
    }, []);

    useEffect(() => {
        var passedArticles = [];

        allArticles.forEach((article) => {
            // TODO: Jason: We should do regex here instead
            if (article.title.toLowerCase().includes(searchTerm.toLowerCase()) || article.summary.toLowerCase().includes(searchTerm.toLowerCase())) {
                article.searchTerm = searchTerm;
                passedArticles.push(article);
            }
        });
        setDisplayArticles(passedArticles);
    }, [searchTerm]);
    // TODO: Remove search bar when we move it to browse
    return (
        <div className={classes.root}>
            <SearchBar
                value={searchTerm}
                onChange={(newValue) => setSearchTerm(newValue)}
                onCancelSearch={() => setSearchTerm("")}
                className={classes.searchBar}
                placeholder={"Search for Article"}
                cancelOnEscape
            />

            <CssBaseline />
            <Grid
                container
                direction={props.mediaQuery ? "column" : "row"}
                justify="center"
                alignItems="center"
                spacing={4}
            >
                {allArticles.length > 0 ?
                    displayArticles.map(article => {
                        return <ArticleContainer key={article.id} article={article} mediaQuery={props.mediaQuery} />;
                    })
                    :
                    <PageLoading />
                }
                {(allArticles.length > 0 && displayArticles.length === 0) &&
                    <Card fontWeight="fontWeightBold" className={classes.card}>
                        <Typography variant="h5" >No articles found with that keyword!</Typography>
                    </Card>
                }
            </Grid>

        </div>
    );
}