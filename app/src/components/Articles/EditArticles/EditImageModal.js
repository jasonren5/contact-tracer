import React, { useState, useContext } from 'react';

import {
    createArticleWithTitleAndImage
} from '../../../utils/functions/articles';
import { FirebaseContext } from '../../../utils/firebase';

import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@material-ui/core';

const INITIAL_STATE = {
    imageURL: "",
};

export default function CreateArticleModal(props) {
    const [state, setState] = useState({
        ...INITIAL_STATE
    });

    const firebase = useContext(FirebaseContext);

    const handleChange = event => {
        const { id, value } = event.target;

        setState(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleSubmitModal = () => {
        // Get input information from state
        const newArticleInfo = {
            image_url: state.imageURL
        };

        // Clear state (clear modal inputs)
        setState({
            ...INITIAL_STATE
        });

        // TODO: Need to create firebase function to update image

        // // Firebase functions call to createArticleWithTitleAndImage
        // createArticleWithTitleAndImage(firebase, newArticleInfo).then(response => {
        //     if (response && response.status === 200) {
        //          props.closeModal();
        //     }
        // });

    };


    //eslint-disable-next-line
    const isInvalid = state.imageURL === '' || (state.imageURL && !/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|jpeg|gif|png)/gi.test(state.imageURL));

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
                    id="imageURL"
                    type="url"
                    onChange={handleChange}
                    label="Image URL"
                    fullWidth
                    required
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.closeModal} color="primary">
                    Cancel
          </Button>
                <Button onClick={handleSubmitModal} color="primary" disabled={isInvalid}>
                    Create
          </Button>
            </DialogActions>
        </Dialog>
    );
}