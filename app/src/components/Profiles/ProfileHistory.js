import React from "react";
import Grid from "@material-ui/core/Grid";
import {Typography} from '@material-ui/core';
import ProfileVersion from './ProfileVersion';
import { getUserContributionHistory } from '../../utils/functions/users';
import { withFirebase } from '../../utils/firebase';
import Link from '@material-ui/core/Link';

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
        if(this.state.versions.length < 1) {
            return (
                <Typography variant="caption" component="p" style={emptyTextStyles}>
                    No contributions yet! <Link href="/browse/contribute"> Contribute here.</Link>
                </Typography>
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

const emptyTextStyles = {
    marginTop: 100,
    marginBottom: 100
}