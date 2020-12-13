import React, { useState, useContext, useEffect } from 'react';

import {
    publishContribution
} from '../../utils/functions/articles';
import { FirebaseContext } from '../../utils/firebase';

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
        color: theme.palette.primary.main
    },
    removeButton: {
        color: theme.palette.error.main
    },
}));

const INITIAL_STATE = {
    editValue: "",
    publishingChanges: false,
    merging: false,
    mergeValue: "",
    section: null,
    mergeSection: null
};

export default function EditImageModal(props) {
    const theme = useTheme();
    const classes = useStyles(theme);

    const [state, setState] = useState({
        ...INITIAL_STATE
    });

    const firebase = useContext(FirebaseContext);

    useEffect(() => {
        setState(prevState => ({
            ...prevState,
            section: props.section
        }));
    }, []);

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

    const handleSubmitModal = () => {
        setState(prevState => ({
            ...prevState,
            publishingChanges: true
        }));

        publishContribution(firebase, state.section, state.editValue, state.merging, state.editValue).then((response) => {
            // handle merge conflict
            if (response.conflict) {
                var localSection = state.section;
                localSection.version_id = response.section.version_id;
                setState(prevState => ({
                    ...prevState,
                    mergeValue: response.section.body,
                    merging: true,
                    section: localSection,
                    publishingChanges: false,
                }));
                return;
            }
            else {
                props.updateImage(response.section);
                setState(prevState => ({
                    ...prevState,
                    merging: false,
                    editValue: "",
                    section: response.section,
                    publishingChanges: false,
                }));
            }
        })
    };

    //eslint-disable-next-line
    const isInvalid = state.editValue === '' || (state.editValue && !/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|jpeg|gif|png)/gi.test(state.editValue));

    // TODO: Allow for direct uploads of images
    return (
        <Dialog open={props.isOpen} onClose={props.closeModal} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Edit Image</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    To edit the image, please submit a new URL ending in <i>.jpg</i> or <i>.png</i>.
          </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="editValue"
                    type="url"
                    onChange={handleChange}
                    label="Image URL"
                    fullWidth
                    disabled={state.merging}
                    required
                />
                {state.merging &&
                    <TextField
                        autoFocus
                        margin="dense"
                        id="mergeValue"
                        type="url"
                        onChange={handleChange}
                        label="Merge Changes"
                        fullWidth
                        required
                    />
                }
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleSubmitModal}
                    className={classes.submitButton}
                    disabled={isInvalid || props.publishingDelete}
                >
                    {state.publishingChanges
                        ? <CircularProgress size={20} color="primary" />
                        : 'Submit Changes'
                    }
                </Button>
                {/* <Button
                    onClick={props.deleteImage}
                    className={classes.removeButton}
                    disabled={state.publishingChanges}
                >
                    {props.publishingDelete
                        ? <CircularProgress size={20} className={classes.removeButton} />
                        : 'Delete Image'
                    }
                </Button> */}
                <Button onClick={props.closeModal} className={classes.removeButton}>
                    Cancel
                 </Button>
            </DialogActions>
        </Dialog>
    );
}