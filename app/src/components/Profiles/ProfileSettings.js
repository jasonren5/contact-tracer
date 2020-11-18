import React, { } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { withFirebase } from '../../utils/firebase';

const firebase = require('firebase');

class ProfileSettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
            allFieldsFull: false,
            loading: false
        }

        this.currentPasswordChange = this.currentPasswordChange.bind(this);
        this.newPasswordChange = this.newPasswordChange.bind(this);
        this.confirmPasswordChange = this.confirmPasswordChange.bind(this);
        this.resetPassword = this.resetPassword.bind(this);
    }

    currentPasswordChange(event) {
        this.setState({
            currentPassword: event.target.value
        }, () => this.checkAllFieldsFull());
    }

    newPasswordChange(event) {
        this.setState({
            newPassword: event.target.value
        }, () => this.checkAllFieldsFull());
    }

    confirmPasswordChange(event) {
        this.setState({
            confirmPassword: event.target.value
        }, () => this.checkAllFieldsFull());
    }

    resetPassword() {
        var self = this;
        var currentUser = this.props.firebase.currentUser;
        const passwordsMatch = (self.state.newPassword === self.state.confirmPassword)
        if (currentUser && passwordsMatch) {
            self.setState({ loading: true })
            const credential = firebase.auth.EmailAuthProvider.credential(
                currentUser.email,
                self.state.currentPassword
            );
            this.props.firebase.doReauthenticateWithCredential(credential).then((result) => {
                result.user.updatePassword(self.state.newPassword).then(() => {
                    self.setState({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                        allFieldsFull: false,
                        loading: false
                    })
                })
            }).catch((error) => {
                // password reset unsuccessful
                self.setState({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                    allFieldsFull: false,
                    loading: false
                });
            });
        }
    }

    checkAllFieldsFull() {
        const currentPasswordEntered = this.state.currentPassword.length > 0;
        const newPasswordEntered = this.state.newPassword.length > 0;
        const confirmPasswordEntered = this.state.confirmPassword.length > 0;

        if (currentPasswordEntered && newPasswordEntered && confirmPasswordEntered) {
            this.setState({
                allFieldsFull: true
            });
        } else {
            this.setState({
                allFieldsFull: false
            });
        }
    }

    render() {
        return (
            <Grid container direction="column">
                <h3>Reset Password</h3>
                <TextField
                    id="current-password-input"
                    label="Current Password"
                    type="password"
                    value={this.state.currentPassword}
                    onChange={(event) => this.currentPasswordChange(event)}
                />
                <TextField
                    id="new-password-input"
                    label="New Password"
                    type="password"
                    value={this.state.newPassword}
                    onChange={(event) => this.newPasswordChange(event)}
                />
                <TextField
                    id="confirm-password-input"
                    label="Confirm Password"
                    type="password"
                    value={this.state.confirmPassword}
                    onChange={(event) => this.confirmPasswordChange(event)}
                />
                <Button
                    variant="contained"
                    color="primary"
                    disabled={!this.state.allFieldsFull}
                >
                    Change Password
                </Button>
            </Grid>
        )
    }
}

export default withFirebase(ProfileSettings);