import React, { useContext, useState } from 'react'

import { FirebaseContext } from '../../utils/firebase';
import ArticleSection from '../../classes/ArticleSection';
import { addSection } from '../../utils/functions/articles';

import { IconButton, CircularProgress } from '@material-ui/core';
import AddBoxIcon from '@material-ui/icons/AddBox';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    container: {
        margin: ".5rem",
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
    },
    loadingAnimation: {
        margin: "10px"
    },
}));


export default function AddSectionField(props) {
    const classes = useStyles();
    const firebase = useContext(FirebaseContext);
    const [publishingNewSection, setPublishingNewSection] = useState(false);

    const addTextSectionBelow = () => {
        let section = new ArticleSection(props.article_id, null, null, "text", "This is a new section, edit it to add content.", (props.order + 1), []);
        setPublishingNewSection(true);
        addSection(firebase, section).then((section) => {
            setPublishingNewSection(false);
            props.addSectionToArticle(section);
        });
    };

    // TODO: Ability to add text or image section - drop down menu of types of section - default textd
    return (
        <div className={classes.container}>
            {publishingNewSection ?
                <CircularProgress className={classes.loadingAnimation} size={30} color="primary" />
                :
                <IconButton
                    className={classes.button}
                    aria-label="add-section"
                    color="secondary"
                    onClick={addTextSectionBelow}
                >
                    <AddBoxIcon fontSize="large" />
                </IconButton>
            }
        </div>
    );
}