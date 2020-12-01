import React, { useState } from 'react';
import { IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';

import EditImageModal from './EditImageModal';

import { CSSTransition } from 'react-transition-group';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    image: {
        width: "100%",
        borderRadius: "8px",
        transition: ".5s ease",
    },
    wrapper: {
        position: "relative",
        margin: "1rem",
        "&:hover": {
            "& img": {
                opacity: "0.3",
            }
        },
    },
    editButton: {
        position: "absolute",
        top: 0,
        right: 0,
        opacity: "1.0",
    },
}));

export default function EditArticleImage(props) {
    const classes = useStyles();
    const [imageHover, setImageHover] = useState(false);
    const [imageEdit, setImageEdit] = useState(false);

    const openEditImageModal = () => {
        setImageEdit(true);
    };

    const closeEditImageModal = () => {
        setImageEdit(false);
    };

    return (
        <div className={classes.root}>
            <div
                className={classes.wrapper}
                onMouseEnter={() => setImageHover(true)}
                onMouseLeave={() => setImageHover(false)}
            >
                <img src={props.image_url} alt={props.alt_text} className={classes.image} />
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
                            >
                                <EditIcon />
                            </IconButton>
                        </div>
                    }
                </CSSTransition>
            </div>
            <EditImageModal isOpen={imageEdit} closeModal={closeEditImageModal} />
        </div>
    );
}