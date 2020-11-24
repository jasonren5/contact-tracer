import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import EditHeaderText from './EditHeaderText';
import EditArticleImage from './EditArticleImage';

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
            <EditArticleImage image_url={props.article.image_url} alt_text={props.article.alt_text} />
        </div>
    );
}