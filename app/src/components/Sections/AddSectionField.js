import React, { useContext, useState } from 'react'

import { FirebaseContext } from '../../utils/firebase';
import ArticleSection from '../../classes/ArticleSection';
import { addSection } from '../../utils/functions/articles';
import CreateImageModal from '../Articles/CreateImageModal';

import {
    IconButton,
    CircularProgress,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText
} from '@material-ui/core';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
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
            backgroundClip: "content-box",
            opacity: "1",
        },
    },
    button: {
        padding: ".25rem",
        marginRight: "1rem",
        marginLeft: "1rem"
    },
    loadingAnimation: {
        margin: "10px"
    },
}));


export default function AddSectionField(props) {
    const classes = useStyles();
    const firebase = useContext(FirebaseContext);
    const [publishingNewSection, setPublishingNewSection] = useState(false);
    const [addImage, setAddImage] = useState(false);

    const addTextSectionBelow = () => {
        let section = new ArticleSection(props.article_id, null, null, "text", "This is a new section, edit it to add content.", (props.order + 1), []);
        setPublishingNewSection(true);
        addSection(firebase, section).then((section) => {
            setPublishingNewSection(false);
            handleClose();
            props.addSectionToArticle(section);
        });
    };

    const addImageSectionBelow = (imageURL) => {
        let section = new ArticleSection(props.article_id, null, null, "image", imageURL, (props.order + 1), []);
        // setPublishingNewSection(true);
        addSection(firebase, section).then((section) => {
            // setPublishingNewSection(false);
            props.addSectionToArticle(section);
            setAddImage(false);
        });
        console.log("here");
    };

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const openEditImageModal = () => {
        handleClose();
        setAddImage(true);
    };

    const closeEditImageModal = () => {
        setAddImage(false);
    };

    return (
        <div className={classes.container}>

            <div className="Menu Holder">
                <IconButton
                    className={classes.button}
                    aria-label="add-section"
                    color="secondary"
                    onClick={handleClick}
                >
                    <AddBoxIcon fontSize="large" />
                </IconButton>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem disabled={publishingNewSection} onClick={addTextSectionBelow}>
                        {publishingNewSection ?
                            <CircularProgress className={classes.loadingAnimation} size={20} color="primary" />
                            :
                            <ListItemIcon>
                                <TextFieldsIcon />
                            </ListItemIcon>
                        }
                        <ListItemText primary="Text" />
                    </MenuItem>
                    <MenuItem disabled={publishingNewSection} onClick={openEditImageModal}>
                        <ListItemIcon>
                            <PhotoCameraIcon />
                        </ListItemIcon>
                        <ListItemText primary="Image" />
                    </MenuItem>
                </Menu>
            </div>

            <CreateImageModal isOpen={addImage} closeModal={closeEditImageModal} handleSubmitModal={addImageSectionBelow} />
        </div>
    );
}