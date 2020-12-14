import React, { useState, useContext } from 'react';

import {
    Link,
    ListItem,
    Typography,
    ListItemIcon,
    IconButton
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import { FirebaseContext } from '../../utils/firebase';
import ConfirmModal from '../Modals/ConfirmModal';
import { removeSource } from '../../utils/functions/articles';

const useStyles = makeStyles((theme) => ({
    button: {
        paddingTop: ".2rem",
        paddingBottom: ".2rem",
    }
}));

export default function SourcesList(props) {
    const classes = useStyles();
    const firebase = useContext(FirebaseContext);
    const [removeModal, setRemoveModal] = useState(false);
    const [publishingDelete, setPublishingDelete] = useState(false);

    // const handleScroll = () => {
    //     document.getElementById("title").scrollIntoView()
    // };

    const handleDeleteSource = () => {
        setPublishingDelete(true);
        removeSource(firebase, props.source.article_id, props.source.id).then((response) => {
            console.log(response);
            handleCloseRemoveModal();
            props.refreshArticle();
        });
    }

    const handleEditSource = () => {

    }

    const handleOpenRemoveModal = () => {
        setPublishingDelete(false);
        setRemoveModal(true);
    }

    const handleCloseRemoveModal = () => {
        setPublishingDelete(false);
        setRemoveModal(false);
    }

    return (
        <div className="root">
            <ListItem>
                <Typography noWrap>
                    {props.source.order + ": "}
                    <Link href={props.source.url}>
                        {props.source.url}
                    </Link>
                </Typography>
                {(firebase.auth.currentUser.uid === props.source.user_id) &&
                    <ListItemIcon>
                        <IconButton
                            disabled={publishingDelete}
                            onClick={handleEditSource}
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
        </div>
    )
}