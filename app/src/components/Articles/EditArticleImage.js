import React, { useState } from 'react';
import { IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';

const useStyles = makeStyles((theme) => ({
    image: {
        width: "100%",
        borderRadius: "8px",
        transition: ".5s ease",
    },
    wrapper: {
        position: "relative",
        margin: "1rem",
        "&:hover": {
            "& img": {
                opacity: "0.3",
            }
        },
    },
    editButton: {
        position: "absolute",
        top: 0,
        right: 0,
        opacity: "1.0",
    },
}));

export default function EditArticleImage(props) {
    const classes = useStyles();
    const [imageHover, setImageHover] = useState(false);
    const [imageEdit, setImageEdit] = useState(false);

    return (
        <div
            className={classes.wrapper}
            onMouseEnter={() => setImageHover(true)}
            onMouseLeave={() => setImageHover(false)}
        >
            <img src={props.image_url} alt={props.alt_text} className={classes.image} />
            {imageHover &&
                <div className={classes.editButton} >
                    <IconButton
                        onClick={() => setImageEdit(true)}
                        aria-label="edit-title"
                    >
                        <EditIcon />
                    </IconButton>
                </div>
            }
        </div>
    );
}