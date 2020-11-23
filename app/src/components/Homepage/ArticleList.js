import React, { useState, useEffect, useContext } from 'react';
import { getAllArticles } from '../../utils/functions/articles';
import ArticleContainer from './ArticleContainer';

import { Grid, CssBaseline } from '@material-ui/core';
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
        marginBottom: '1%',
        maxWidth: 800
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
        // We want to compare the search term to the titles (and possibly description) of allArticles
        // We then see where there is overlap, and for any of the titles with our term is inside of it, we insert that article into displayArticles
        console.log("search term");
    }, [searchTerm]);

    return (
        <div className={classes.root}>
            <SearchBar
                value={searchTerm}
                onChange={(newValue) => setSearchTerm(newValue)}
                onRequestSearch={() => console.log('onRequestSearch')}
                className={classes.searchBar}
            />

            <CssBaseline />
            <Grid
                container
                direction={props.mediaQuery ? "column" : "row"}
                justify="center"
                alignItems="center"
                spacing={4}
            >
                {displayArticles.length > 0 ?
                    displayArticles.map(article => {
                        return <ArticleContainer key={article.id} article={article} mediaQuery={props.mediaQuery} />;
                    })
                    :
                    <PageLoading />
                }
            </Grid>
        </div>
    );
}