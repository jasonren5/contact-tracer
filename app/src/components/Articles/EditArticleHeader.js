import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import EditHeaderText from './EditHeaderText';

const useStyles = makeStyles((theme) => ({
    image: {
        width: "100%",
    },
}));


export default function EditArticleHeader(props) {
    const classes = useStyles();

    return (
        <div className="Edit Article Header">
            <EditHeaderText
                title={props.article.title}
            />
            <img src={props.article.image_url} alt={props.article.alt_text} className={classes.image} />
        </div>
    );
}