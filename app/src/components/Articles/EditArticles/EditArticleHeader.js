import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import EditHeaderText from './EditHeaderText';
import EditHeaderImage from './EditHeaderImage';

const useStyles = makeStyles((theme) => ({
    image: {
        width: "100%",
        borderRadius: "8px",
        marginTop: ".5rem",
    },
}));


export default function EditArticleHeader(props) {
    const classes = useStyles();
    const fakeSection = {
        body: props.article.image_url,
        alt_text: props.article.alt_text,

    }
    return (
        <div className="Edit Article Header">
            <EditHeaderText
                title={props.article.title}
                article_id={props.article.id}
            />
            {props.article.image_url &&
                <EditHeaderImage section={fakeSection} classes={classes.image} article_id={props.article.id} />
            }
        </div>
    );
}