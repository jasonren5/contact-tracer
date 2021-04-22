import React from "react";
import Grid from "@material-ui/core/Grid";
import ProfileCard from "../../components/Profiles/ProfileCard";
import ProfileSections from "../../components/Profiles/ProfileSections";
import { withFirebase } from '../../utils/firebase';
import { canViewProfile } from '../../utils/functions/users';

class PublicProfile extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const user_id = this.props.match.params.userId;
        const currentUser = this.props.firebase.auth.currentUser;
        if (currentUser) {
            if (currentUser.uid === user_id) {
                window.location.href = ('/profile');
            }
        }
        canViewProfile(this.props.firebase, user_id).then((allowed) => {
            if (!allowed) {
                window.location.href = ('/');
            }
        })

    }

    render() {
        const user_id = this.props.match.params.userId;

        return (
            <Grid container >
                <ProfileCard user_id={user_id} private={false}></ProfileCard>
                <ProfileSections user_id={user_id} private={false}></ProfileSections>
            </Grid>
        )
    }
}

export default withFirebase(PublicProfile);