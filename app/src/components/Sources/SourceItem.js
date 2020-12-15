import React, { useState } from 'react';

import { Typography, ListItem, Link } from '@material-ui/core';
import ViewSourceModal from './ViewSourceModal';

export default function SourceItem(props) {
    const [sourceModal, setSourceModal] = useState(false);

    const handleOpenSourceModal = () => {
        setSourceModal(true);
    }

    const handleCloseSourceModal = () => {
        setSourceModal(false);
    }

    return (
        <div className="root">
            <ListItem>
                <Typography noWrap color="secondary">
                    <Link color="inherit" onClick={handleOpenSourceModal}>
                        {"[" + props.source.order + "]"}
                    </Link>
                    {": "}
                    <Link href={props.source.url}>
                        {props.source.url}
                    </Link>
                </Typography>
            </ListItem>
            <ViewSourceModal
                open={sourceModal}
                source={props.source}
                closeModal={handleCloseSourceModal}
                article_id={props.article_id}
            />
        </div>
    );
}