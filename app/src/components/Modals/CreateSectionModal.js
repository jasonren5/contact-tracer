import React, { useState, useEffect } from 'react';

import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    CircularProgress
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    submitButton: {
        color: theme.palette.success.main
    },
    cancelButton: {
        color: theme.palette.error.main
    },
    textField: {
        width: "500px",
    },
}));

const INITIAL_STATE = {
    editValue: "",
    publishingChanges: false,
};

export default function CreateImageModal(props) {
    const theme = useTheme();
    const classes = useStyles(theme);

    const [state, setState] = useState({
        ...INITIAL_STATE
    });

    useEffect(() => {
        setState(prevState => ({
            ...prevState,
            editValue: "",
            publishingChanges: false,
        }));
    }, [props.isOpen]);

    const handleChange = event => {
        const { id, value } = event.target;

        setState(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleSubmit = () => {
        setState(prevState => ({
            ...prevState,
            publishingChanges: true,
        }));
        props.handleSubmitModal(state.editValue)
    };

    //eslint-disable-next-line
    const isInvalid = (props.type === "image") ? (state.editValue === '' || (state.editValue && !/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|jpeg|gif|png)/gi.test(state.editValue))) : state.editValue === '';

    // TODO: Allow for direct uploads of images

    return (
        <Dialog
            open={props.isOpen}
            onClose={props.closeModal}
            aria-labelledby="form-dialog-title"
        >
            <DialogTitle id="form-dialog-title">Create Image Section</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {props.type === "image" ?
                        "To create an image, please submit a new URL ending in .jpg or .png."
                        :
                        "To add a text section, please fill out the body."
                    }
                </DialogContentText>
                {props.type === "image" ?
                    <TextField
                        autoFocus
                        id="editValue"
                        type="url"
                        onChange={handleChange}
                        label="Image URL"
                        // fullWidth
                        disabled={state.merging}
                        required
                        className={classes.textField}
                    />
                    :
                    <TextField
                        autoFocus
                        id="editValue"
                        type="text"
                        onChange={handleChange}
                        label="Body text"
                        // fullWidth
                        disabled={state.merging}
                        required
                        multiline
                        rowsMax={10}
                        className={classes.textField}
                    />
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSubmit} className={classes.submitButton} disabled={isInvalid}>
                    {state.publishingChanges
                        ? <CircularProgress size={20} color="primary" />
                        : 'Create Section'
                    }
                </Button>
                <Button onClick={props.closeModal} className={classes.cancelButton}>
                    Cancel
                 </Button>
            </DialogActions>
        </Dialog>
    );
}