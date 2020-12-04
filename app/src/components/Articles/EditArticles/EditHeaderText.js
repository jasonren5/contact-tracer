import React, { useState, useContext } from 'react';

import {
    Typography,
    TextField,
    Button,
    IconButton,
    CardActions,
    Card,
    CardContent,
    CircularProgress
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import EditIcon from '@material-ui/icons/Edit';

import { CSSTransition } from 'react-transition-group';

import {
    editArticleTitle
} from '../../../utils/functions/articles';
import { FirebaseContext } from '../../../utils/firebase';


const useStyles = makeStyles((theme) => ({
    root: {
        zIndex: "-1"
    },
    title: {
        margin: "1rem",
        fontWeight: "bold",
    },
    editField: {
        width: "100%",
        height: "200%",
    },
    highlightWrapper: {
        position: "relative",
        marginTop: "1rem",
        padding: ".25rem",
        borderRadius: "8px",
        transition: ".5s ease",
        zIndex: "200",
        "&:hover": {
            background: "#8eacbb",
        },
    },
    wrapper: {
        // position: "relative",
        margin: "1rem",
        padding: ".5rem",
    },
    editButtonWrapper: {
        position: "absolute",
        top: 0,
        right: 0,
    },
    submitButton: {
        color: theme.palette.success.main
    },
    cancelButton: {
        color: theme.palette.error.main
    },
}));

const INITAL_MERGE_STATE = {
    merging: false,
    mergeSection: null,
    mergeValue: "",
}

export default function EditHeaderText(props) {
    const theme = useTheme();
    const classes = useStyles(theme);

    const [titleHover, setTitleHover] = useState(false);
    const [titleEdit, setTitleEdit] = useState(false);
    const [editValue, setEditValue] = useState(props.title);
    const [mergeState, setMergeState] = useState({ ...INITAL_MERGE_STATE })
    const [publishingChanges, setPublishingChanges] = useState(false);
    const [titleValue, setTitleValue] = useState(props.title);

    const firebase = useContext(FirebaseContext);

    const handleSubmitEdit = () => {
        setPublishingChanges(true);
        editArticleTitle(firebase, props.article_id, editValue).then((response) => {
            setPublishingChanges(false);
            setTitleValue(response.data.new_title);
            handleToggleEditing();
        })
    };

    const handleChange = (event) => {
        if (mergeState.merging) {
            setMergeState(prevState => ({
                ...prevState,
                mergeValue: event.target.value
            }));
        }
        else {
            setEditValue(event.target.value);
        }

    };

    const handleToggleEditing = value => {
        setTitleEdit(value);
        setMergeState({ ...INITAL_MERGE_STATE });
    };

    return (
        <div className={classes.root}>
            {titleEdit ?
                <Card className={classes.wrapper}>
                    <CardContent>
                        <TextField
                            id="edit-header-title"
                            label="Edit Title"
                            multiline
                            disabled={mergeState.merging}
                            rowsMax={10}
                            value={editValue}
                            onChange={(event) => handleChange(event)}
                            className={classes.editField}
                        />
                        {mergeState.merging && (
                            <TextField
                                id="title_merge"
                                label="Merge Changes"
                                multiline
                                rowsMax={10}
                                value={mergeState.mergeValue}
                                onChange={(event) => handleChange(event)}
                                className={classes.editField}
                            />
                        )}
                    </CardContent>
                    <CardActions>
                        <Button
                            component="span"
                            onClick={handleSubmitEdit}
                            aria-label="submit-edit"
                            className={classes.submitButton}
                        >
                            {publishingChanges
                                ? <CircularProgress size={20} color="primary" />
                                : 'Submit Changes'
                            }
                        </Button>
                        <Button
                            component="span"
                            onClick={() => handleToggleEditing(false)}
                            aria-label="cancel-edit"
                            className={classes.cancelButton}
                        >
                            Cancel
                        </Button>
                    </CardActions>
                </Card>
                :
                <div
                    className={classes.highlightWrapper}
                    onMouseOver={() => setTitleHover(true)}
                    onMouseOut={() => setTitleHover(false)}
                >
                    <Typography variant="h4" className={classes.title} >{titleValue}</Typography>
                    <CSSTransition
                        in={titleHover}
                        classNames="fade"
                        timeout={200}
                        unmountOnExit
                    >
                        <div className={classes.editButtonWrapper} >
                            <IconButton
                                onClick={() => handleToggleEditing(true)}
                                aria-label="edit-title"
                                color="secondary"
                            >
                                <EditIcon />
                            </IconButton>
                        </div>
                    </CSSTransition>
                </div>
            }
        </div>

    );
}