import React from 'react';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    CircularProgress
} from '@material-ui/core';

import { makeStyles, useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    successButton: {
        color: theme.palette.success.main,
    },
    errorButton: {
        color: theme.palette.error.main,
    },
    cancelButton: {
        color: theme.palette.primary.main,
    },
}));

export default function AlertDialog(props) {
    const theme = useTheme();
    const classes = useStyles(theme);

    return (
        <div className="Confirmation Dialog">
            <Dialog
                open={props.open}
                onClose={props.closeModal}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{props.confirmAction}?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to {props.confirmAction.toLowerCase()}? This action is irreversible, so please take care before confirming.
                     </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={props.handleConfirm}
                        autoFocus
                        disabled={props.publishingConfirm}
                        className={classes.errorButton}
                    >
                        {props.publishingConfirm
                            ? <CircularProgress size={20} color="primary" />
                            : props.confirmAction}

                    </Button>
                    <Button
                        onClick={props.closeModal}
                        className={classes.cancelButton}
                        disabled={props.publishingConfirm}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}