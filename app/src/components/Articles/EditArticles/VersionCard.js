import React from 'react';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import { Typography, IconButton } from '@material-ui/core';

import RotateLeftIcon from '@material-ui/icons/RotateLeft';

import NameTag from '../../Profiles/NameTag';

const Diff = require('diff');

class VersionCard extends React.Component {
    constructor(props) {
        super(props);
    }

    getBlockStyles(block) {
        if(block.added) {
            return {
                color: "green"
            }
        }
        if(block.removed) {
            return {
                color: "red"
            }
        }
        return {

        };
    }

    render() {
        const difs = Diff.diffChars(this.props.version.prevBody, this.props.version.body)
        return (
            <Card style={cardStyles}>
                <CardHeader
                    title={<NameTag variant="h5" user={this.props.version.user}></NameTag>}
                />
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {difs.map(block => <span style={this.getBlockStyles(block)}>{block.value}</span>)}
                    </Typography>
                </CardContent>
                <CardActions>
                    <IconButton aria-label="Restore this Version">
                        <RotateLeftIcon />
                    </IconButton>
                </CardActions>
            </Card>
        )
    }
}

const cardStyles = {
    margin: 20
}

export default VersionCard;