import React from "react";
import Grid from "@material-ui/core/Grid";
import ProfileCard from "../components/Profiles/ProfileCard"

class PublicProfile extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        const user_id = this.props.match.params.userId;
        return (
            <Grid container >
                <ProfileCard user_id={user_id}></ProfileCard>
            </Grid>
        )
    }
}

export default PublicProfile;