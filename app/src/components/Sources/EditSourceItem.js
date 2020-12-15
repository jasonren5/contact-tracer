import React, { useState, useContext } from 'react';

import {
    Link,
    ListItem,
    Typography,
    ListItemIcon,
    IconButton,
    TextField,
    CircularProgress
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/DeleteForever';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';

import { FirebaseContext } from '../../utils/firebase';
import ConfirmModal from '../Modals/ConfirmModal';
import { removeSource, editSource } from '../../utils/functions/articles';
import ViewSourceModal from './ViewSourceModal';

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
    const [sourceModal, setSourceModal] = useState(false);

    const handleDeleteSource = () => {
        setPublishingDelete(true);
        removeSource(firebase, props.source.article_id, props.source.id).then((response) => {
            handleCloseRemoveModal();
            props.refreshArticle();
        });
    }

    const handleSubmitEdit = () => {
        setPublishingEdit(true);
        editSource(firebase, props.source.article_id, props.source.id, editValue).then((response) => {
            setPublishingEdit(false);
            handleStopEditing();
            props.refreshArticle();
        });
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

    const handleOpenSourceModal = () => {
        setSourceModal(true);
    }

    const handleCloseSourceModal = () => {
        setSourceModal(false);
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
                                disabled={publishingDelete || publishingEdit}
                                onClick={handleSubmitEdit}
                                className={classes.submitButton}
                            >
                                {publishingEdit ?
                                    <CircularProgress size={20} color="primary" />
                                    :
                                    <DoneIcon />
                                }
                            </IconButton>
                            <IconButton
                                disabled={publishingDelete || publishingEdit}
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
                        <Typography noWrap color="secondary">
                            <Link color="inherit" onClick={handleOpenSourceModal}>
                                {"[" + props.source.order + "]"}
                            </Link>
                            {": "}
                            <Link href={props.source.url}>
                                {props.source.url}
                            </Link>
                        </Typography>
                        {(firebase.auth.currentUser.uid === props.source.user) &&
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
                    <ViewSourceModal
                        open={sourceModal}
                        source={props.source}
                        closeModal={handleCloseSourceModal}
                        article_id={props.article_id}
                    />
                </div>
            }
        </div>
    )
}