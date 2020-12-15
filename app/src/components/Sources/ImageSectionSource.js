import React, { useState, useEffect } from 'react';

import { Typography, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ViewSourceModal from './ViewSourceModal';

const useStyles = makeStyles(() => ({
    root: {
        marginLeft: "5rem",
        marginRight: "5rem",
        textAlign: "center",
    },
}));

export default function TextSectionSources(props) {
    const classes = useStyles();
    const [openSourceModal, setOpenSourceModal] = useState(false);
    const [primarySource, setPrimarySource] = useState();

    useEffect(() => {
        const source = props.sources.slice(-1).pop()
        setPrimarySource(source);
    }, [])

    const handleCloseModal = () => {
        setOpenSourceModal(false);
    }

    const handleOpenModal = () => {
        setOpenSourceModal(true);
    }

    return (
        <div className={classes.root}>
            {primarySource &&
                <Typography noWrap color="secondary" >
                    Image From <Link onClick={handleOpenModal}>[{primarySource.order}]: {primarySource.url}</Link>
                </Typography>
            }
            <ViewSourceModal
                open={openSourceModal}
                source={primarySource}
                closeModal={handleCloseModal}
                article_id={props.article_id}
            />
        </div>
    );
}