import React from "react";
import Grid from "@material-ui/core/Grid";
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import {getPublicProfileData} from '../../utils/functions/users';

class ProfileCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user_data: null
        }
    }

    componentDidMount() {
        getPublicProfileData(this.props.user_id).then((user_data) => {
            if(!user_data) {
                window.location.href = ('/user-not-found');
            }
            this.setState({user_data: user_data})
        })
    }

    getUsername() {
        // This is a temporary implementation
        // Waiting for a User Data refactor
        if (!this.state.user_data.username) {
            return "Anonymous User"
        }
        const email = this.state.user_data.username;
        var splitEmail = email.split("@")
        return splitEmail[0];
    }

    render() {
        if(!this.state.user_data) {
            // TODO Handle Loading Better
            return (
                <p>Loading...</p>
            )
        }
        const user_data = this.state.user_data;
        return (
            <Grid item xs={4}>
                <Paper style={cardStyles}>
                    <h1>{this.getUsername()}</h1>
                    <p><strong>{user_data.number_of_contributions}</strong> Contributions</p>
                    <Divider></Divider>
                    <p>{user_data.username}</p>
                </Paper>
            </Grid>
        )
    }
}

export default ProfileCard;

const cardStyles = {
    margin: 25,
    padding: 15
}