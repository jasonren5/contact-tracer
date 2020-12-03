import React from 'react'
import {Typography, TextField} from '@material-ui/core'
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import SendIcon from '@material-ui/icons/Send';
import ClearIcon from '@material-ui/icons/Clear';
import EditIcon from '@material-ui/icons/Edit';

import EmailIcon from '@material-ui/icons/Email';
import TwitterIcon from '@material-ui/icons/Twitter';
import LinkedInIcon from '@material-ui/icons/LinkedIn';

class ProfileCardItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: this.props.fieldValue,
            fieldValue:this.props.fieldValue,
            editing: false
        }
        
        this.handleInput = this.handleInput.bind(this);
        this.toggleEditing = this.toggleEditing.bind(this);
    }

    handleInput(event) {
        this.setState({
            value: event.target.value
        });
    }

    toggleEditing() {
        this.setState({
            editing: !this.state.editing
        })
    }

    renderStatic() {
        const icon = this.getIcon()
        return (
            <div>
                {icon && 
                    <IconButton disabled>
                        {icon}
                    </IconButton>
                }
                <Typography variant="body1" component="span">
                    {this.state.fieldValue}
                </Typography>
                <IconButton aria-label="edit" color="primary" onClick={() => this.toggleEditing()}>
                    <EditIcon />
                </IconButton>
            </div>
        )
    }

    renderEditing() {
        const icon = this.getIcon()
        return (
            <div>
                {icon && 
                    <IconButton disabled>
                        {icon}
                    </IconButton>
                }
                <TextField
                    label={this.props.fieldKey}
                    value={this.state.value}
                    onChange={(event) => this.handleInput(event)}
                />
                <IconButton aria-label="back" color="default" onClick={() => this.toggleEditing()}>
                    <ClearIcon />
                </IconButton>
                <IconButton aria-label="publish" color="primary">
                    <SendIcon />
                </IconButton>
            </div>
        )
    }

    renderIcon() {
        
    }

    getIcon() {
        switch(this.props.fieldKey) {
            case "username":
                return (<EmailIcon />);
            case "twitter":
                return (<TwitterIcon />);
            case "linkedin":
                return (<LinkedInIcon />);
            default:
                return null;
        }
    }

    render() {
        return ( 
            <div style={itemStyles}>
                {this.state.editing 
                    ? this.renderEditing()
                    : this.renderStatic()
                }
            </div>
        )
    }
}

export default ProfileCardItem;

const itemStyles = {
    marginTop: 10,
    marginBottom:10
}