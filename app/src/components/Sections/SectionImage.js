import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    image: {
        // width: "100%",
        borderRadius: "8px",
        transition: ".5s ease",
        // maxHeight: "800px",
        maxHeight: "100%",
        maxWidth: "100%",
    },
    wrapper: {
        position: "relative",
        padding: "1rem",
        maxHeight: "800px",
    },

}));

export default function SectionImage(props) {
    const classes = useStyles();
    return (
        <div className={classes.wrapper}>
            <img src={props.section.body} alt={props.section.alt_text} className={classes.image} />
        </div>
    );
}