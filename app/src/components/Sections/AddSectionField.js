import React, { useContext } from 'react'

import { FirebaseContext } from '../../utils/firebase';
import ArticleSection from '../../classes/ArticleSection';
import { addSection } from '../../utils/functions/articles';

import { IconButton } from '@material-ui/core';
import AddBoxIcon from '@material-ui/icons/AddBox';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    container: {
        margin: "1rem",
        borderStyle: "dashed",
        border: "2px #37393b",
        borderRadius: "8px",
        width: "100%",
        opacity: ".25",
        transition: ".5s ease",
        "&:hover": {
            // background: "#8eacbb",
            backgroundClip: "content-box",
            opacity: "1",
        },
    },
    button: {
        padding: "0px",
    }
}));


export default function AddSectionField(props) {
    const classes = useStyles();
    const firebase = useContext(FirebaseContext);

    const addSectionBelow = () => {
        let section = new ArticleSection(props.article_id, null, null, "text", "This is a new section, edit it to add content.", (props.order + 1), []);
        // TODO: Jason: Implement functions call to add section
        // addSection(firebase, section).then((section) => {
        //     console.log(section);
        //     props.addSectionToArticle(section);
        // });
        console.log(section);
    };

    // TODO: Ability to add text or image section
    return (
        <div className={classes.container}>
            <IconButton
                className={classes.button}
                aria-label="add-section"
                color="secondary"
                onClick={addSectionBelow}
            >
                <AddBoxIcon fontSize="large" />
            </IconButton>
        </div>
    );
}