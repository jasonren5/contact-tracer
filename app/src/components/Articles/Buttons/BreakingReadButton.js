import React from 'react';
import { useHistory } from 'react-router-dom';

import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { Button } from '@material-ui/core';


export default function BreakingReadMoreButton(props) {
    const history = useHistory();
    const articleURL = "/breaking/" + props.articleID;

    const handleReadMoreClick = () => {
        history.push(articleURL);
    };

    return (
        <Button
            color="primary"
            endIcon={<NavigateNextIcon />}
            onClick={handleReadMoreClick}
        >
            Read Breaking News
        </Button>
    );
}