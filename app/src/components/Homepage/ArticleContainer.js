import React from 'react';

import { ReadMoreButton } from '../Articles/Buttons';
import { ContributeButton } from '../Articles/Buttons';

import {
    Card,
    Grid,
    CardMedia,
    CardContent,
    CardActions,
    Typography,
    Link
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

var Highlight = require('react-highlighter');

const useStyles = makeStyles((theme) => ({
    card: {
        // padding: theme.spacing(2),
        // textAlign: 'center',
        color: theme.palette.text.secondary,
        display: 'flex',
        flexDirection: 'column',
        // alignItems: 'center',
        height: "415px",
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: '1 0 auto',
    },
    image: {
        height: 150
    },
    buttonHolder: {
        textAlign: 'left'
    },
    contentSnipet: {
        textAlign: 'left',
        marginBottom: 0
    },
    cardActions: {
        position: "absolute",
        height: "780px",
    }
}));

export default function ArticleContainer(props) {
    // Note: edit links are temporary, just need a way for the profs to access it in the mvp
    const articleURL = "/article/" + props.article.id;
    const editArticleURL = "/contribute/" + props.article.id;
    const classes = useStyles();

    const highlightTerm = props.article.searchTerm ? props.article.searchTerm : "";
    const maxSizeGrid = props.maxWidth === "lg" ? 4 : 3;
    const gridSize = props.mediaQuery ? "auto" : maxSizeGrid;

    return (
        <Grid item xs={gridSize}>
            <Card className={classes.card}>
                <CardMedia
                    className={classes.image}
                    image={props.article.image_url}
                    title={props.article.title}
                />
                <CardContent>
                    <Link href={props.contribute ? editArticleURL : articleURL} color={"primary"}>
                        <Typography component="h5" variant="h5" gutterBottom>
                            <Highlight search={highlightTerm}>
                                {props.article.title}
                            </Highlight>
                        </Typography>
                    </Link>
                    <Typography className={classes.contentSnipet} variant="body2" color="textSecondary">
                        <Highlight search={highlightTerm}>
                            {props.article.summary}
                        </Highlight>
                    </Typography>
                </CardContent>
                <CardActions className={classes.cardActions}>
                    {props.contribute ?
                        <ContributeButton articleID={props.article.id} />
                        :
                        <ReadMoreButton articleID={props.article.id} />
                    }
                </CardActions>
            </Card>
        </Grid>
    );
}