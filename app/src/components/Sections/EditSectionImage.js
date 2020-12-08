import React, { useState, useContext } from 'react';
import { FirebaseContext } from '../../utils/firebase';
import {
    publishContribution
} from '../../utils/functions/articles';

import { IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import EditImageModal from '../Modals/EditImageModal';
import ConfirmModal from '../Modals/ConfirmModal';

import { CSSTransition } from 'react-transition-group';
import AddSectionField from './AddSectionField';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    image: {
        borderRadius: "8px",
        transition: ".5s ease",
        maxWidth: "100%",
        maxHeight: "700px",
    },
    wrapper: {
        position: "relative",
        padding: "1rem",
        "&:hover": {
            "& img": {
                opacity: "0.3",
            }
        },
    },
    editButton: {
        position: "absolute",
        top: 20,
        right: 60,
        opacity: "1.0",
    },
    removeButton: {
        position: "absolute",
        top: 20,
        right: 20,
        opacity: "1.0",
    },
}));

export default function EditSectionImage(props) {
    const classes = useStyles();

    const [imageHover, setImageHover] = useState(false);
    const [imageEdit, setImageEdit] = useState(false);
    const [section, setSection] = useState(props.section);
    const [publishingDelete, setPublishingDelete] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const firebase = useContext(FirebaseContext);

    const openEditImageModal = () => {
        setImageEdit(true);
    };

    const closeEditImageModal = () => {
        setImageEdit(false);
    };

    const handleUpdateImage = section => {
        setSection(section);
        closeEditImageModal();
    }

    const handleDeleteSection = () => {
        setPublishingDelete(true);
        publishContribution(firebase, section, "", true).then((response) => {
            setSection(response.section);
            closeEditImageModal();
            closeConfirmModal();
            setPublishingDelete(false);
        });
    }

    const openConfirmModal = () => {
        setConfirmDelete(true);
    }

    const closeConfirmModal = () => {
        setConfirmDelete(false);
    }

    return (
        <div className={classes.root}>
            {section.body &&
                <div className="Render if Not Empty">
                    <div
                        className={classes.wrapper}
                        onMouseOver={() => setImageHover(true)}
                        onMouseOut={() => setImageHover(false)}
                    >
                        <img src={section.body} alt={section.alt_text} className={classes.image} />
                        <CSSTransition
                            in={imageHover}
                            classNames="fade"
                            timeout={200}
                            unmountOnExit
                        >
                            {
                                <div className={classes.editButton} >
                                    <IconButton
                                        onClick={openEditImageModal}
                                        aria-label="edit-title"
                                        color="secondary"
                                        disabled={publishingDelete}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </div>
                            }
                        </CSSTransition>
                        <CSSTransition
                            in={imageHover}
                            classNames="fade"
                            timeout={200}
                            unmountOnExit
                        >
                            {
                                <div className={classes.removeButton} >
                                    <IconButton
                                        onClick={openConfirmModal}
                                        aria-label="edit-title"
                                        color="secondary"
                                        disabled={publishingDelete}
                                    >
                                        <DeleteForeverIcon />
                                    </IconButton>
                                </div>
                            }
                        </CSSTransition>

                    </div>
                    < AddSectionField
                        article_id={section.article_id}
                        addSectionToArticle={props.addSectionToArticle}
                        order={section.order}
                    />
                </div>
            }
            <EditImageModal
                isOpen={imageEdit}
                closeModal={closeEditImageModal}
                updateImage={handleUpdateImage}
                section={section}
                deleteImage={handleDeleteSection}
                publishingDelete={publishingDelete}
            />
            <ConfirmModal
                open={confirmDelete}
                closeModal={closeConfirmModal}
                handleConfirm={handleDeleteSection}
                confirmAction={"Remove Image Section"}
                publishingConfirm={publishingDelete}
            />
        </div>
    );
}