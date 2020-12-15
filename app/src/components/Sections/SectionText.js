import React from 'react';

import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TextSectionSources from '../Sources/TextSectionSources';

const useStyles = makeStyles((theme) => ({
    body: {
        textAlign: "left",
        marginBottom: "1rem",
    },
}));

export default function SectionText(props) {
    const classes = useStyles();
    return (
        <div className="Section Text">
            <Typography variant="body1" className={classes.body}>
                {props.section.body}
                {props.section.sources.length > 0 && <TextSectionSources article_id={props.article_id} sources={props.section.sources} />}
            </Typography>
        </div>
    );
}