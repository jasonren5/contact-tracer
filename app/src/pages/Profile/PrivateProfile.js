import React from "react";
import Grid from "@material-ui/core/Grid";
import ProfileCard from "../../components/Profiles/ProfileCard";
import ProfileSections from "../../components/Profiles/ProfileSections";
import PageLoading from '../../components/Loading/PageLoading';

import { withFirebase } from '../../utils/firebase';

class PrivateProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user_id: null
        }
    }

    componentDidMount() {
        const currentUser = this.props.currentUser;
        if (!currentUser) {
            console.log(currentUser);
            window.location.href = ('/signin');
        } else {
            this.setState({ user_id: currentUser.uid })
        }
    }

    render() {
        if (!this.state.user_id) {
            return (<PageLoading />)
        }
        return (
            <Grid container >
                <ProfileCard user_id={this.state.user_id} private={true}></ProfileCard>
                <ProfileSections user_id={this.state.user_id} private={true}></ProfileSections>
            </Grid>
        )
    }
}

export default withFirebase(PrivateProfile);