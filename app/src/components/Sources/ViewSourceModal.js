import React from 'react';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@material-ui/core';

export default function ViewSourceModal(props) {
    return (
        <div className="Sourec Dialog">
            <Dialog
                open={props.open}
                onClose={props.closeModal}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Source: {props.source.order}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to {props.confirmAction.toLowerCase()}? This action is irreversible, so please take care before confirming.
                     </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={props.closeModal}
                        color="primary"
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}