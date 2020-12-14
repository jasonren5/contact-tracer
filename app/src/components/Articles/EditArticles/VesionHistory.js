import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography'
import VersionCard from './VersionCard';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Chip from '@material-ui/core/Chip';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton'

import { withFirebase } from '../../../utils/firebase';
import { getSectionByID } from "../../../utils/functions/articles"
import { Icon } from '@material-ui/core';

class VersionHistory extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            versions: null
        }

        this.handleClose = this.handleClose.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
    }

    componentDidMount() {
        getSectionByID(this.props.firebase, this.props.section.article_id, this.props.section.id).then((versions) =>{
            this.setState({
                versions: versions
            })
        })
    }

    handleClose() {
        this.setState({
            open: false
        })
    }

    handleOpen() {
        this.setState({
            open: true
        })
    }

    componentDidUpdate(){
        if(this.props.open != this.state.open){
            this.setState({          
                open: this.props.open
            });
        }
    }

    render() {
        if(this.state.versions === null) {
            return (
                <Dialog
                    open={this.state.open}
                    onClose={this.props.close}
                    maxWidth="sm"
                >
                        <Paper>
                            <DialogTitle style={titlePaperStyles}>
                                <Typography variant="h5" style={titleStyles}>
                                    Version History
                                </Typography>
                            </DialogTitle>
                            <DialogContent>
                                <Typography variant="body2" color="textSecondary">
                                    Loading...
                                </Typography>
                            </DialogContent>
                        </Paper>
                </Dialog>
            )
        }
        if(this.state.versions.length < 1) {
            return (
                <Dialog
                    open={this.state.open}
                    onClose={this.props.close}
                    maxWidth="sm"
                >
                        <Paper>
                            <DialogTitle style={titlePaperStyles}>
                                <Typography variant="h5" style={titleStyles}>
                                    Version History
                                </Typography>
                            </DialogTitle>
                            <DialogContent>
                                <Typography variant="body2" color="textSecondary">
                                    No versions to show.
                                </Typography>
                            </DialogContent>
                        </Paper>
                </Dialog>
            )
        }
        return(
            <Dialog
                open={this.state.open}
                onClose={this.props.close}
                maxWidth="sm"
            >
                    <Paper>
                        <DialogTitle style={titlePaperStyles}>
                            <Typography variant="h5" style={titleStyles}>
                                Version History
                            </Typography>
                        </DialogTitle>
                        <DialogContent>
                            <div>
                                <Chip label="First Contribution" color="primary" size="small" style={chipStyles} />
                            </div>
                            {this.state.versions.map(
                                version => <VersionCard version={version} />
                            )}
                            <Chip label="Most Recent Contribution" color="primary" size="small" style={chipStyles}/>
                        </DialogContent>
                    </Paper>
            </Dialog>
        )
    }
}

const titleStyles = {
    color: "black"
}

const titlePaperStyles = {
    background: "#688494",
    padding: 15
}

const chipStyles = {
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "10px",
    marginBottom: "10px",
    display: "flex"
}

const buttonStyles = {
    float: 'right'
}

export default withFirebase(VersionHistory);