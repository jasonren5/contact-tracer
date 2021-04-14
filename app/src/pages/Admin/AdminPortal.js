import React from 'react';
import ApplicationList from '../../components/Admin/ApplicationList';
import { Container, Grid, Typography } from '@material-ui/core';
import { verifyAdmin } from '../../utils/functions/applications';
import { withFirebase } from '../../utils/firebase';

class AdminPortal extends React.Component {

    componentDidMount() {
        verifyAdmin(this.props.firebase).then((data) => {
            if (!data.admin) {
                window.location.href = "/page-not-found";
            }
        }).catch((err) => {
            console.log(err);
            window.location.href = "/page-not-found";
        })
    }

    render() {
        return (
            <Container component="main">
                <Typography variant="h2">Admin Portal</Typography>
                <Grid container justify="center">
                    <ApplicationList />
                </Grid>
            </Container>
        )
    }
}

export default withFirebase(AdminPortal);