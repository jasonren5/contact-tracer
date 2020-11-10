import React from "react";
import Grid from "@material-ui/core/Grid";
import ProfileCard from "../components/Profiles/ProfileCard";
import ProfileSections from "../components/Profiles/ProfileSections";

const firebase = require('firebase');

class PublicProfile extends React.Component {

    componentDidMount() {
        const user_id = this.props.match.params.userId;
        const currentUser = firebase.auth().currentUser;
        if(currentUser) {
            if(currentUser.uid === user_id) {
                window.location.href = ('/profile');
            }
        } 
    }

    render(){
        const user_id = this.props.match.params.userId;

        return (
            <Grid container >
                <ProfileCard user_id={user_id} private={false}></ProfileCard>
                <ProfileSections user_id={user_id} private={false}></ProfileSections>
            </Grid>
        )
    }
}

export default PublicProfile;