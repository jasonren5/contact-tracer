import React from 'react';
import ApplicationList from '../../components/Admin/ApplicationList';
import Grid from '@material-ui/core/Grid';
import { verifyAdmin } from '../../utils/functions/applications';
import { withFirebase } from '../../utils/firebase';

class AdminPortal extends React.Component {

    componentDidMount() {
        verifyAdmin(this.props.firebase).then((data) => {
            if(!data.admin) {
                window.location.href = "/page-not-found";
            }
        }).catch((err) => {
            window.location.href = "/page-not-found";
        })
    }

    render() {
        return (
            <Grid container justify="center">
                <ApplicationList />
            </Grid>
        )
    }
}

export default withFirebase(AdminPortal);