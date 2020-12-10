import React from 'react';
import Grid from '@material-ui/core/Grid';
import { getPendingApplications } from '../../utils/functions/applications';
import { withFirebase } from '../../utils/firebase';
import ApplicationListItem from './ApplicationListItem';
import PageLoading from '../Loading/PageLoading';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider'

class ApplicationList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            applications: null
        }
    }

    componentDidMount() {
        getPendingApplications(this.props.firebase).then((data) => {
            if(data.error === null) {
                this.setState({
                    applications: []
                })
            } else {
                this.setState({
                    applications: data
                })
            }
        }).catch((err) => {
            this.setState({
                applications: []
            })
        })
    }

    render() {
        if(this.state.applications === null) {
            return (
                <Grid>
                    <PageLoading />
                </Grid>
            )
        }
        if(this.state.applications.length === 0) {
            return (
                <Grid>
                    <p>No Pending Applications</p>
                </Grid>
            )
        }
        return (
            <Grid 
                item
                xs={6}
            >
                <Paper style={paperStyles}>
                    <Typography variant="h4">
                        Pending Applications
                    </Typography>
                    <br />
                    <Divider />
                    <br />
                    <Grid
                        container 
                        spacing={2}
                        direction="column"
                    >
                        {this.state.applications.map((application, index) =>
                            <ApplicationListItem key={application.application_id + index} application = {application} />
                        )}
                    </Grid>
                </Paper>
            </Grid>
        )
    }
}

const paperStyles = {
    padding: 15,
    marginTop: 15
}

export default withFirebase(ApplicationList);