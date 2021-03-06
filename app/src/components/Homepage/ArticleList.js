import React, { useState, useEffect, useContext } from 'react';
import { getAllArticles } from '../../utils/functions/articles';
import ArticleContainer from './ArticleContainer';

import { Grid, CssBaseline, Card, Typography } from '@material-ui/core';
import PageLoading from '../../components/Loading/PageLoading';
import { makeStyles } from '@material-ui/core/styles';

import { FirebaseContext } from '../../utils/firebase';


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
    const [breakingArticles, setBreakingArticles] = useState([]);
    const [displayArticles, setDisplayArticles] = useState([]);

    useEffect(() => {
        getAllArticles(firebase).then((articles) => {
            setAllArticles(articles.article_list);
            setDisplayArticles(articles.article_list);
        }).catch((err) => {
            console.log(err);
        })
    }, []);

    useEffect(() => {
        firebase.db.collection('breaking_articles').limit(4).get().then((res) => {
            const breaking = res.docs.map((doc) => {
                const docData = doc.data()
                docData.id = doc.id
                console.log("DOC DATA", docData)
                return docData
            })
            setBreakingArticles(breaking)
        })
    }, [props.searchTerm]);

    useEffect(() => {
        handleUpdateDisplayedArticles();
    }, [props.searchTerm]);

    useEffect(() => {
        handleUpdateDisplayedArticles();
    }, [props.typeFilter]);

    const handleUpdateDisplayedArticles = () => {
        var passedArticles = [];

        allArticles.forEach((article) => {
            const includeThis = article.type === props.typeFilter;
            const includeAll = (props.typeFilter === "all" || props.typeFilter === null);
            if (includeAll || includeThis) {
                if (article.title.toLowerCase().includes(props.searchTerm.toLowerCase()) || article.summary.toLowerCase().includes(props.searchTerm.toLowerCase())) {
                    article.searchTerm = props.searchTerm;
                    passedArticles.push(article);
                }
            }
        });
        setDisplayArticles(passedArticles);
    }

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
                {breakingArticles.length > 0 && 
                    breakingArticles.map((article) => <ArticleContainer key={article.id} article={article} maxWidth={props.maxWidth} mediaQuery={props.mediaQuery} breaking={true}/> )
                }
                {allArticles.length > 0 ?
                    displayArticles.map(article => {
                        return <ArticleContainer key={article.id} article={article} maxWidth={props.maxWidth} mediaQuery={props.mediaQuery} breaking={false}/>;
                    })
                    :
                    <PageLoading />
                }
                {(allArticles.length > 0 && displayArticles.length === 0) &&
                    <Card fontWeight="fontWeightBold" className={classes.card}>
                        <Typography variant="h5" >No articles found with that keyword and filter!</Typography>
                    </Card>
                }
            </Grid>
        </div>
    );
}