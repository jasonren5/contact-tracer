import React from "react";
import Grid from "@material-ui/core/Grid";
import ProfileVersion from './ProfileVersion';
import { getUserContributionHistory } from '../../utils/functions/users';

import PageLoading from '../../components/Loading/PageLoading';

class ProfileHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            versions: null,
            error: false
        }
    }

    componentDidMount() {
        getUserContributionHistory(this.props.user_id).then((versions) => {
            if (!versions) {
                this.setState({ error: true })
            } else {
                this.setState({ versions: versions })
            }
        })
    }

    render() {
        if (!this.state.versions) {
            return (
                <PageLoading />
            )
        }
        if (this.state.error) {
            // TODO Handle Errors Better
            return (
                <p>Error loading history, please try again.</p>
            )
        }
        return (
            <Grid container spacing={2}>
                {this.state.versions.map((version, index) =>
                    <ProfileVersion key={"historyVersion" + index} version={version}></ProfileVersion>
                )}
            </Grid>
        )
    }
}

export default ProfileHistory;
