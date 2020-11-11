import React from 'react';
import { useHistory } from 'react-router-dom';

import {
    Card,
    Grid,
    CardMedia,
    CardContent,
    CardActions,
    Typography,
    Link,
    Button
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { makeStyles } from '@material-ui/core/styles';

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
    const editArticleURL = "/contribute/" + props.article.id;
    const history = useHistory();
    const classes = useStyles();

    const handleReadMoreClick = () => {
        history.push(articleURL);
    };

    const handleEditClick = () => {
        history.push(editArticleURL);
    };

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
                        <Typography component="h5" variant="h5" gutterBottom>{props.article.title}</Typography>
                    </Link>
                    <Typography className={classes.contentSnipet} variant="body2" color="textSecondary">
                        {props.article.summary}
                    </Typography>
                </CardContent>
                <CardActions >
                    <Button
                        color="secondary"
                        className={classes.button}
                        endIcon={<NavigateNextIcon />}
                        onClick={handleEditClick}
                    >
                        Contribute
                    </Button>
                    <Button
                        color="secondary"
                        className={classes.button}
                        endIcon={<NavigateNextIcon />}
                        onClick={handleReadMoreClick}
                    >
                        Read More
                    </Button>
                </CardActions>
            </Card>
        </Grid>
    );
}