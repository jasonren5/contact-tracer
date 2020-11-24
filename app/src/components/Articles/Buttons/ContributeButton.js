import React from 'react';
import { useHistory } from 'react-router-dom';

import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    articleButton: {
        margin: "5px",
    },
}));


export default function ContributeButton(props) {
    const history = useHistory();
    const editArticleURL = "/contribute/" + props.articleID;
    const classes = useStyles();

    const handleEditClick = () => {
        history.push(editArticleURL);
    };

    return (
        <div className="Contribute Button">
            {
                props.inArticleButton ?
                    <Button
                        color="secondary"
                        variant="outlined"
                        className={classes.articleButton}
                        endIcon={<NavigateNextIcon />}
                        onClick={handleEditClick}
                        size="large"
                    >
                        Contribute
                    </Button>
                    :
                    <Button
                        color="secondary"
                        endIcon={<NavigateNextIcon />}
                        onClick={handleEditClick}
                    >
                        Contribute
                    </Button>
            }
        </div>
    );
}