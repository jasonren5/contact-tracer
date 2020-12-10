import React from "react";
import {Typography} from '@material-ui/core';
import SchoolIcon from '@material-ui/icons/School';
import ScheduleIcon from '@material-ui/icons/Schedule';
import Button from '@material-ui/core/Button';
import { approveApplication, rejectApplication } from '../../utils/functions/applications';
import { withFirebase } from '../../utils/firebase';


class ApplicationDetails extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            loadingApprove: false,
            loadingReject: false,
        }

        this.handleApprove = this.handleApprove.bind(this);
        this.handleReject = this.handleReject.bind(this);
    }

    handleApprove() {
        if(this.state.loadingReject) {
            return
        }

        this.setState({
            loadingApprove: true
        })

        const application_id = this.props.application.application_id;

        approveApplication(this.props.firebase, application_id).then((res) => {
            if(res.error) {
                this.setState({loadingApprove: false})
            } else {
                window.location.href = ('/admin');
            }
        }).catch((err) => {
            this.setState({loadingApprove: false})
        })
    }

    handleReject() {
        if(this.state.loadingApprove) {
            return
        }

        this.setState({
            loadingReject: true
        })

        const application_id = this.props.application.application_id;

        rejectApplication(this.props.firebase, application_id).then((res) => {
            if(res.error) {
                this.setState({loadingReject: false})
            } else {
                window.location.href = ('/admin');
            }
        }).catch((err) => {
            this.setState({loadingReject: false})
        })
    }

    render() {
        const application = this.props.application;

        var datePublished = new Date(0);
        datePublished.setUTCSeconds(application.submitted._seconds);
        const dateString = datePublished.toDateString();
        return (
            <div>
                <Typography variant="h5" component="h2">
                    {application.name}
                </Typography>
                <br />
                <Typography color="textSecondary">
                    <SchoolIcon fontSize="small"/> {application.type}
                </Typography>
                <Typography color="textSecondary">
                    <ScheduleIcon fontSize="small" /> {dateString}
                </Typography>
                <br />
                <Typography color="textSecondary">
                    "{application.body}"
                </Typography>
                <br />
                <Button 
                    variant="contained" 
                    color="secondary" 
                    onClick={this.handleReject} 
                    style={buttonStyles}
                    disabled={this.state.loadingApprove || this.state.loadingReject}
                >
                    Reject
                </Button>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={this.handleApprove} 
                    style={buttonStyles}
                    disabled={this.state.loadingApprove || this.state.loadingReject}
                >
                    Approve
                </Button>
            </div>
        )
    }
}

const buttonStyles = {
    margin: 10
}

export default withFirebase(ApplicationDetails);