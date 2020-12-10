import React from "react";
import Grid from "@material-ui/core/Grid";
import ProfileCard from "../../components/Profiles/ProfileCard";
import ApplicationSections from '../../components/Admin/ApplicationSections'
import { withFirebase } from '../../utils/firebase';
import { getApplication } from '../../utils/functions/applications';
import PageLoading from '../../components/Loading/PageLoading';
import { verifyAdmin } from '../../utils/functions/applications';

class ApplicationReview extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            application: null
        }

        this.loadApplication = this.loadApplication.bind(this);
    }

    componentDidMount() {
        const application_id = this.props.match.params.appId;

        verifyAdmin(this.props.firebase).then((data) => {
            if(!data.admin) {
                window.location.href = "/page-not-found";
            } else {
                this.loadApplication(application_id)
            }
        }).catch((err) => {
            window.location.href = "/page-not-found";
        })
    }

    loadApplication(application_id) {
        getApplication(this.props.firebase, application_id).then((data) => {
            if(data.error === null) {
                window.location.href = ('/admin');
            } else {
                console.log(data)
                this.setState({
                    application: data
                })
            }
        }).catch((err) => {
            window.location.href = ('/admin');
        })
    }

    render() {
        if(this.state.application === null) {
            return (
                <PageLoading />
            )
        }

        return (
            <Grid container >
                <ProfileCard user_id={this.state.application.user_id} private={false}></ProfileCard>
                <ApplicationSections user_id={this.state.application.user_id} application={this.state.application} />
            </Grid>
        )
    }
}

export default withFirebase(ApplicationReview);