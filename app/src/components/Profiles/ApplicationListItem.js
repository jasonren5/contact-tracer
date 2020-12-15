import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';


class ApplicationListItem extends React.Component {

    render() {
        const application = this.props.application;
        return (
            <Grid item >
                <Card variant="outlined">
                    <CardContent>
                        <Typography color="textSecondary">
                            Applying for {application.type} expertise
                        </Typography>
                        <br />
                        <Typography variant="body2" component="p">
                            {application.body}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        {application.status === "pending" && 
                            <Typography variant="body2" component="p" style={pendingStyles}>
                                Status: Pending
                            </Typography>
                        }
                        {application.status === "approved" && 
                            <Typography variant="body2" component="p" style={approvedStyles}>
                                Status: Approved
                            </Typography>
                        }
                        {application.status === "rejected" && 
                            <Typography variant="body2" component="p" style={rejectedStyles}>
                                Status: Rejected
                            </Typography>
                        }
                        {application.status === "denied" && 
                            <Typography variant="body2" component="p" style={rejectedStyles}>
                                Status: Denied
                            </Typography>
                        }
                    </CardActions>
                </Card>
            </Grid>
            
        )
    }
}

const approvedStyles = {
    color: "green"
}

const pendingStyles = {
    color: "gold"
}

const rejectedStyles = {
    color: "brown"
}

export default ApplicationListItem