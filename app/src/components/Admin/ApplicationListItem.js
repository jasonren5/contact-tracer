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
                        <Typography variant="h5" component="h2">
                            {application.name}
                        </Typography>
                        <Typography color="textSecondary">
                            Applying for {application.type} expertise
                        </Typography>
                        <br />
                        <Typography variant="body2" component="p">
                            {application.body}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small" href={"admin/review/" + application.application_id}>Review</Button>
                    </CardActions>
                </Card>
            </Grid>
            
        )
    }
}

export default ApplicationListItem