import React, { useState } from 'react';

import { Typography, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    icons: {
        marginLeft: ".25rem",
    }
}));

export default function TextSectionSources(props) {
    const classes = useStyles();
    const [openSourceModal, setOpenSourceModal] = useState(false);
    const [modalSource, setModalSource] = useState();

    const handleOpenModal = (source) => {
        setOpenSourceModal(true);
        setModalSource(source);
    }

    const handleCloseModal = () => {
        setOpenSourceModal(false);
        setModalSource(null);
    }

    return (
        <Typography component="span" color="secondary" >
            {props.sources.map((source) =>
                <Link
                    color="inherit"
                    key={source.url}
                    onClick={(source) => handleOpenModal}
                >
                    <sup className={classes.icons}>
                        {"[" + source.order + "]"}
                    </sup>
                </Link>
            )}
        </Typography>
    );
}