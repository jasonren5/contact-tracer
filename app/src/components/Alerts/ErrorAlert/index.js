import React from 'react';

import { Alert, AlertTitle } from '@material-ui/lab';
import { Box, Collapse, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

export default function ErrorAlert(props) {
    const [open, setOpen] = React.useState(true);
    return (
        <Collapse in={open}>
            <Box my=".5rem">
                <Alert variant="outlined" severity="error" action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                            setOpen(false);
                        }}
                    >
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                }>
                    {props.errorTitle && <AlertTitle>Error {props.errorTitle} </AlertTitle>}
                    {props.error}
                </Alert>
            </Box>
        </Collapse>
    );
}