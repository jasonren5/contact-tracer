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
    root: {
        // display: 'flex',
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: '1 0 auto',
        // width: 400,
    },
    image: {
        // width: 400,
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
    const articleURL = "/article/" + props.article.id;
    const history = useHistory();
    const classes = useStyles();

    const handleReadMoreClick = () => {
        history.push(articleURL);
    };

    return (
        // <Box className="Article Container">
        <Grid item xs={6}>
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
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem sunt perspiciatis quaerat ab tempora aut est delectus cupiditate odio unde, ullam dolore iste laborum sed officiis praesentium. Recusandae, officia distinctio!
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button
                        // variant="contained"
                        color="secondary"
                        className={classes.button}
                        endIcon={<NavigateNextIcon />}
                        onClick={handleReadMoreClick}
                    >
                        Read More
                    </Button>
                </CardActions>
                {/* <CardMedia
                    className={classes.image}
                    image={props.article.image_url}
                    title={props.article.title}
                />
                <div className={classes.details}>
                    <CardContent className={classes.content}>
                        <Link href={articleURL} color={"primary"}>
                            <Typography component="h5" variant="h5" gutterBottom>{props.article.title}</Typography>
                        </Link>
                        <Typography className={classes.contentSnipet} variant="body1" color="textSecondary">
                            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cupiditate et veritatis tenetur dicta corrupti, accusantium dolorem natus non vitae ratione quaerat dignissimos aliquid unde maiores accusamus fugiat enim, numquam laborum.
                            </Typography>
                    </CardContent>
                    <div className={classes.buttonHolder}>
                        <Button
                            // variant="contained"
                            color="secondary"
                            className={classes.button}
                            endIcon={<NavigateNextIcon />}
                        >
                            Read More
                    </Button>
                    </div>
                </div> */}
            </Card>
        </Grid>
        // </Box>
    );
}