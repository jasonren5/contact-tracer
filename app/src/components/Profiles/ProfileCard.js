import React from "react";
import { Grid, Divider, Paper } from "@material-ui/core";
import { getPublicProfileData } from '../../utils/functions/users';
import { withFirebase } from '../../utils/firebase';
import PageLoading from '../../components/Loading/PageLoading';
import ProfileCardItem from './ProfileCardItem';
import Chip from '@material-ui/core/Chip';

const cardStyles = {
    margin: 25,
    padding: 15
}
class ProfileCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user_data: null
        }
    }

    componentDidMount() {
        getPublicProfileData(this.props.firebase, this.props.user_id).then((user_data) => {
            if (!user_data) {
                window.location.href = ('/user-not-found');
            }
            this.setState({ user_data: user_data })
        })
    }

    getUsername() {
        // This is a temporary implementation
        // Waiting for a User Data refactor
        if (!this.state.user_data.username) {
            return "Anonymous User"
        }
        if (this.state.user_data.name) {
            return this.state.user_data.name;
        }
        const email = this.state.user_data.username;
        var splitEmail = email.split("@");
        return splitEmail[0];
    }

    render() {
        if (!this.state.user_data) {
            // TODO: Going to need to do a bit better loading animation for final product
            return (
                <Grid item xs={4}>
                    <PageLoading />
                </Grid>
            )
        }
        const user_data = this.state.user_data;
        const bio = (user_data.bio ? user_data.bio : "This user hasn't added a bio yet.")
        const twitter = (user_data.twitter ? user_data.twitter : "Twitter not added.")
        const linkedin = (user_data.linkedin ? user_data.linkedin : "LinkedIn not added.")
        const expertises = (user_data.expertises ? user_data.expertises : []);
        return (
            <Grid item sm={12} md={4}>
                <Paper style={cardStyles}>
                    <h1>{this.getUsername()}</h1>
                    <p><strong>{user_data.number_of_contributions}</strong> Contributions</p>

                    <Divider />

                    <ProfileCardItem user={user_data} fieldKey="bio" fieldValue={bio} multiline={true} private={this.props.private}/>

                    <Divider />
                    <ProfileCardItem user={user_data} fieldKey="username" fieldValue={user_data.username} multiline={false} private={false}/>
                    <ProfileCardItem user={user_data} fieldKey="twitter" fieldValue={twitter} multiline={false} private={this.props.private}/>
                    <ProfileCardItem user={user_data} fieldKey="linkedin" fieldValue={linkedin} multiline={false} private={this.props.private}/>
                    {(expertises.length > 0 || user_data.admin) && 
                        <div>
                            <Divider />
                            {user_data.expertises.map((expertise) => <Chip label={expertise + " expert"} color="primary" style={chipStyles}/>)}
                            {user_data.admin && <Chip label="admin" color="secondary" style={chipStyles}/>}
                        </div>
                    }
                </Paper>
            </Grid>
        )
    }
}

const chipStyles = {
    marginLeft: 5,
    marginRight: 5,
    marginTop: 15
}

export default withFirebase(ProfileCard);