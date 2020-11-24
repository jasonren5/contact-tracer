import React, { useState } from 'react';
import { Typography, TextField, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
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
        margin: "1rem",
        "&:hover": {
            border: "3px solid #ccc",
            borderRadius: "5px",
            background: "aliceblue",
        },
    },
    wrapper: {
        position: "relative",
        margin: "1rem",
    },
    editButton: {
        position: "absolute",
        top: 0,
        right: 0,
    },
    submitButton: {
        position: "absolute",
        top: 0,
        right: 20,
    },
}));

export default function EditArticleHeader(props) {
    const classes = useStyles();
    const [titleHover, setTitleHover] = useState(false);
    const [titleEdit, setTitleEdit] = useState(false);
    const [editValue, setEditValue] = useState(props.title);

    const handleSubmitEdit = () => {
        console.log("submit edit");
    };

    const NotEditing = () => (
        <div
            className={classes.highlightWrapper}
            onMouseEnter={() => setTitleHover(true)}
            onMouseLeave={() => setTitleHover(false)}
        >

            <Typography variant="h4" className={classes.title} >{props.title}</Typography>
            {titleHover &&
                <div className={classes.editButton} >
                    <IconButton
                        onClick={() => setTitleEdit(true)}
                        aria-label="edit-title"
                    >
                        <EditIcon />
                    </IconButton>
                </div>
            }
        </div>

    );

    const Editing = () => (
        <div className={classes.wrapper}>
            <TextField
                id="open_editor"
                label="Edit Title"
                multiline
                // disabled={this.state.merging}
                rowsMax={10}
                value={editValue}
                onChange={(event) => setEditValue(event.target.value)}
                className={classes.editField}
            />
            <div className={classes.editButton} >
                <IconButton
                    onClick={handleSubmitEdit}
                    aria-label="submit-edit"
                >
                    <DoneIcon />
                </IconButton>
                <IconButton
                    onClick={() => setTitleEdit(false)}
                    aria-label="cancel-edit"
                >
                    <CloseIcon />
                </IconButton>
            </div>
        </div>

    );

    return (
        <div className="Edit Title">
            {titleEdit ?
                <Editing /> :
                <NotEditing />
            }
        </div>

    );
}