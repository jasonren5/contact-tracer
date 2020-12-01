import React from "react";
import Grid from "@material-ui/core/Grid";
import ProfileVersion from './ProfileVersion';
import { getUserContributionHistory } from '../../utils/functions/users';
import { withFirebase } from '../../utils/firebase';

import PageLoading from '../../components/Loading/PageLoading';
import ErrorAlert from '../../components/Alerts/ErrorAlert';


class ProfileHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            versions: null,
            error: false
        }
    }

    componentDidMount() {
        getUserContributionHistory(this.props.firebase, this.props.user_id).then((versions) => {
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
            return (
                <ErrorAlert error={"Error loading history, please try again."} />
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

export default withFirebase(ProfileHistory);
