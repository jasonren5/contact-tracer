import React from 'react'

import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    image: {
        width: "100%",
    },
    title: {
        margin: "1rem",
        fontWeight: "bold"
    },
}));


export default function ArticleHeader(props) {
    const classes = useStyles();

    return (
        <div className="Article Header">
            <Typography variant="h4" className={classes.title} >{props.article.title}</Typography>
            <img src={props.article.image_url} alt={props.article.alt_text} className={classes.image} />
        </div>
    );
}