import React, { useState } from 'react';

import { createBlankArticle } from '../../utils/functions/articles';
import { useHistory } from 'react-router-dom';

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
    articleTitle: "",
    imageURL: "",
};

export default function CreateArticleModal(props) {
    const [state, setState] = useState({
        ...INITIAL_STATE
    });

    const history = useHistory();

    const handleChange = event => {
        const { id, value } = event.target;

        setState(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleSubmitModal = () => {
        console.log("creating article...");

        const newArticleInfo = {
            articleTitle: state.articleTitle,
            imageURL: state.imageURL
        };

        console.log(newArticleInfo);
        setState({
            ...INITIAL_STATE
        });
        // TODO: Ideally we call the function in utils, get the address and href to it
        // createBlankArticle();
        // history.push('/article/' + articleId);

        // Not actually sure if we need to close the modal if we navigate away from it
        props.closeModal();
    };

    const isInvalid = state.articleTitle === '';

    return (
        <Dialog open={props.isOpen} onClose={props.closeModal} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Create New Article</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Create a new article, starting with the title and an image address.
          </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="articleTitle"
                    onChange={handleChange}
                    label="Article Title"
                    fullWidth
                    required
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="imageURL"
                    type="url"
                    onChange={handleChange}
                    label="Image URL"
                    fullWidth
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