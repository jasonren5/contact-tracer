import React, { useContext, useState } from 'react'

import { FirebaseContext } from '../../utils/firebase';
import ArticleSection from '../../classes/ArticleSection';
import { addSection } from '../../utils/functions/articles';
import CreateSectionModal from '../Modals/CreateSectionModal';

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


const useStyles = makeStyles(() => ({
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
    const [addText, setAddText] = useState(false);

    const addTextSectionBelow = (bodyText, source) => {
        const finalSource = source === "" ? null : source;
        let section = new ArticleSection(props.article_id, null, null, "text", bodyText, (props.order + 1), []);

        addSection(firebase, section, finalSource).then((data) => {
            console.log(data);
            props.addSectionToArticle(data.newSection);
            setAddText(false);
        });
    };

    const addImageSectionBelow = (imageURL) => {
        let section = new ArticleSection(props.article_id, null, null, "image", imageURL, (props.order + 1), []);

        addSection(firebase, section, imageURL).then((data) => {
            props.addSectionToArticle(data.newSection);
            setAddImage(false);
        });
    };

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const openAddImageModal = () => {
        handleClose();
        setAddImage(true);
    };

    const closeAddImageModal = () => {
        setAddImage(false);
    };

    const openAddTextModal = () => {
        handleClose();
        setAddText(true);
    };

    const closeAddTextModal = () => {
        setAddText(false);
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
                    <MenuItem disabled={publishingNewSection} onClick={openAddTextModal}>
                        {publishingNewSection ?
                            <CircularProgress className={classes.loadingAnimation} size={20} color="primary" />
                            :
                            <ListItemIcon>
                                <TextFieldsIcon />
                            </ListItemIcon>
                        }
                        <ListItemText primary="Text" />
                    </MenuItem>
                    <MenuItem disabled={publishingNewSection} onClick={openAddImageModal}>
                        <ListItemIcon>
                            <PhotoCameraIcon />
                        </ListItemIcon>
                        <ListItemText primary="Image" />
                    </MenuItem>
                </Menu>
            </div>

            <CreateSectionModal
                type="image"
                isOpen={addImage}
                closeModal={closeAddImageModal}
                handleSubmitModal={addImageSectionBelow}
            />
            <CreateSectionModal
                type="text"
                isOpen={addText}
                closeModal={closeAddTextModal}
                handleSubmitModal={addTextSectionBelow}
            />
        </div>
    );
}