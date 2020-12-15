import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ImageSectionSource from '../Sources/ImageSectionSource';

const useStyles = makeStyles((theme) => ({
    image: {
        borderRadius: "8px",
        maxHeight: "700px",
        maxWidth: "100%",
    },
    wrapper: {
        padding: "1rem",
    },

}));

export default function SectionImage(props) {
    const classes = useStyles();
    return (
        <div className={classes.wrapper}>
            <img src={props.section.body} alt={props.section.alt_text} className={classes.image} />
            <ImageSectionSource article_id={props.article_id} sources={props.section.sources} />
        </div>
    );
}