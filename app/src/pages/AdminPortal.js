import React from 'react';
import ApplicationList from '../components/Admin/ApplicationList';
import Grid from '@material-ui/core/Grid';

class AdminPortal extends React.Component {

    render() {
        return (
            <Grid container justify="center">
                <ApplicationList />
            </Grid>
        )
    }
}

export default AdminPortal;