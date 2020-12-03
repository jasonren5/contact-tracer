import React from 'react';
import { withFirebase } from '../../utils/firebase';
import { updateUserField } from '../../utils/functions/users';
import {Typography, TextField, Grid} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';

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
        this.updateUser = this.updateUser.bind(this);
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

    updateUser() {
        const oldValue = this.state.fieldValue;
        this.setState({
            editing: false,
            fieldValue: this.state.value
        })
        updateUserField(this.props.firebase, this.props.fieldKey, this.state.value).then((res) => {
            if (res.error) {
                this.setState({
                    fieldValue: oldValue,
                    value: oldValue
                })
            }
        }).catch(() => {
            this.setState({
                fieldValue: oldValue,
                value: oldValue
            })
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
        const icon = this.getIcon()
        return (
            <Grid item xs={3}>
                {icon && 
                    <IconButton disabled>
                        {icon}
                    </IconButton>
                }
            </Grid>
        )
    }

    renderText() {
        return (
            <Grid item xs={6}>
                {this.state.editing 
                    ? (
                        <TextField
                            label={this.props.fieldKey}
                            value={this.state.value}
                            onChange={(event) => this.handleInput(event)}
                            multiline={this.props.multiline}
                        />
                    )
                    : (
                        <Typography variant="body1" component="span">
                            {this.getLink()}
                        </Typography>
                    )
                }
            </Grid>
        )
    }

    renderButtons() {
        if(!this.props.private) {
            return (
                <Grid item xs={3} />
            )
        }
        return (
            <Grid item xs={3}>
                {this.state.editing 
                    ? (
                        <div>
                            <IconButton aria-label="back" color="default" onClick={() => this.toggleEditing()}>
                                <ClearIcon />
                            </IconButton>
                            <IconButton aria-label="publish" color="primary" onClick={() => this.updateUser()}>
                                <SendIcon />
                            </IconButton>
                        </div>
                    )
                    : (
                        <div>
                            <IconButton aria-label="edit" color="primary" onClick={() => this.toggleEditing()}>
                                <EditIcon />
                            </IconButton>
                        </div>
                    )
                }
            </Grid>
        )
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

    getLink() {
        switch(this.props.fieldKey) {
            case "twitter":
                const url = "https://twitter.com/" + this.state.fieldValue;
                //return (<a href={url}> {this.state.fieldValue} </a>);
                return (<Link href={url}>{this.state.fieldValue}</Link>)
            case "linkedin":
                const name = (this.props.user.name ? this.props.user.name : "Profile Link")
                // return (<a href={this.state.fieldValue}> {name} </a>);
                return (<Link href={this.state.fieldValue}>{name}</Link>)
            default:
                return (<span>{this.state.fieldValue}</span>);
        }
    }

    render() {
        return ( 
            <div style={itemStyles}>
                <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                >
                    {this.renderIcon()}
                    {this.renderText()}
                    {this.renderButtons()}
                </Grid>
            </div>
        )
    }
}

export default withFirebase(ProfileCardItem);

const itemStyles = {
    marginTop: 10,
    marginBottom:10
}