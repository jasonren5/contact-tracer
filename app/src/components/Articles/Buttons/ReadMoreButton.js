import React from 'react';
import { useHistory } from 'react-router-dom';

import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { Button } from '@material-ui/core';


export default function ReadMoreButton(props) {
    const history = useHistory();
    const articleURL = "/article/" + props.articleID;

    const handleReadMoreClick = () => {
        history.push(articleURL);
    };

    return (
        <Button
            color="secondary"
            endIcon={<NavigateNextIcon />}
            onClick={handleReadMoreClick}
        >
            Read More
        </Button>
    );
}