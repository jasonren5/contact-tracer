import React, { useState, useContext } from 'react';

import {
    Link,
    ListItem,
    Typography,
    ListItemIcon,
    IconButton,
    TextField
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/DeleteForever';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';

import { FirebaseContext } from '../../utils/firebase';
import ConfirmModal from '../Modals/ConfirmModal';
import { removeSource } from '../../utils/functions/articles';

const useStyles = makeStyles((theme) => ({
    button: {
        paddingTop: ".2rem",
        paddingBottom: ".2rem",
        padding: ".4rem",
    },
    editField: {
        width: "100%",
        height: "100%",
        marginLeft: ".5rem",
    },
    submitButton: {
        paddingTop: ".2rem",
        paddingBottom: ".2rem",
        padding: ".4rem",
        color: theme.palette.success.main,
    },
    cancelButton: {
        paddingTop: ".2rem",
        paddingBottom: ".2rem",
        padding: ".4rem",
        color: theme.palette.error.main
    },
}));

export default function SourcesList(props) {
    const theme = useTheme();
    const classes = useStyles(theme);
    const firebase = useContext(FirebaseContext);
    const [removeModal, setRemoveModal] = useState(false);
    const [publishingDelete, setPublishingDelete] = useState(false);
    const [publishingEdit, setPublishingEdit] = useState(false);
    const [editValue, setEditValue] = useState(props.source.url)
    const [editing, setEditing] = useState(false);

    // const handleScroll = () => {
    //     document.getElementById("title").scrollIntoView()
    // };

    const handleDeleteSource = () => {
        setPublishingDelete(true);
        removeSource(firebase, props.source.article_id, props.source.id).then((response) => {
            console.log(response);
            handleCloseRemoveModal();
            props.refreshArticle();
        });
    }

    const handleSubmitEdit = () => {

    }

    const handleStartEditing = () => {
        setEditing(true);
    }

    const handleStopEditing = () => {
        setEditValue(props.source.url);
        setEditing(false);
    }

    const handleOpenRemoveModal = () => {
        setPublishingDelete(false);
        setRemoveModal(true);
    }

    const handleCloseRemoveModal = () => {
        setPublishingDelete(false);
        setRemoveModal(false);
    }

    const handleChange = (event) => {
        const { id, value } = event.target;
        setEditValue(value);
    }

    return (
        <div className="root">
            {editing ?
                <div className="Editing">
                    <ListItem>
                        <Typography noWrap>
                            {props.source.order + ": "}
                        </Typography>
                        <TextField
                            id="editValue"
                            variant="outlined"
                            label="Edit Source"
                            type="text"
                            multiline
                            rowsMax={10}
                            value={editValue}
                            onChange={(event) => handleChange(event)}
                            className={classes.editField}
                        />
                        <ListItemIcon>
                            <IconButton
                                disabled={publishingDelete}
                                onClick={handleSubmitEdit}
                                className={classes.submitButton}
                            >
                                <DoneIcon />
                            </IconButton>
                            <IconButton
                                disabled={publishingDelete}
                                onClick={handleStopEditing}
                                className={classes.cancelButton}
                            >
                                <CloseIcon />
                            </IconButton>
                        </ListItemIcon>
                    </ListItem>
                </div>
                :
                <div className="Not Editing">
                    <ListItem>
                        <Typography noWrap>
                            {props.source.order + ": "}
                            <Link href={props.source.url}>
                                {props.source.url}
                            </Link>
                        </Typography>
                        {(firebase.auth.currentUser.uid === props.source.user_id) &&
                            <ListItemIcon>
                                <IconButton
                                    disabled={publishingDelete}
                                    onClick={handleStartEditing}
                                    className={classes.button}
                                >
                                    <EditIcon color="secondary" />
                                </IconButton>
                                <IconButton
                                    disabled={publishingDelete}
                                    onClick={handleOpenRemoveModal}
                                    className={classes.button}
                                >
                                    <DeleteIcon color="secondary" />
                                </IconButton>
                            </ListItemIcon>
                        }
                    </ListItem>
                    <ConfirmModal
                        open={removeModal}
                        closeModal={handleCloseRemoveModal}
                        handleConfirm={handleDeleteSource}
                        confirmAction={"Delete Source"}
                        publishingConfirm={publishingDelete}
                    />
                </div>
            }
        </div>
    )
}