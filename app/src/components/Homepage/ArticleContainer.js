import React, { useContext } from 'react';
import { FirebaseContext } from '../../utils/firebase';

import { ContributeButton, ReadMoreButton } from '../Articles/Buttons';

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
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
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
}));

export default function ArticleContainer(props) {
    // Note: edit links are temporary, just need a way for the profs to access it in the mvp
    const articleURL = "/article/" + props.article.id;
    const classes = useStyles();
    const firebase = useContext(FirebaseContext);

    const highlightTerm = props.article.searchTerm ? props.article.searchTerm : "";

    return (
        <Grid item xs={props.mediaQuery ? "auto" : 4}>
            <Card className={classes.root}>
                <CardMedia
                    className={classes.image}
                    image={props.article.image_url}
                    title={props.article.title}
                />
                <CardContent>
                    <Link href={articleURL} color={"primary"}>
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
                <CardActions >
                    <ReadMoreButton articleID={props.article.id} />
                </CardActions>
            </Card>
        </Grid>
    );
}