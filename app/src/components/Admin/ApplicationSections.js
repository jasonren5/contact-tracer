import React from 'react';
import Grid from "@material-ui/core/Grid";
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ProfileHistory from '../Profiles/ProfileHistory';
import ApplicationDetails from './ApplicationDetails';
import Card from "@material-ui/core/Card";
import CardContent from '@material-ui/core/CardContent';

class ApplicationSections extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedValue: 0
        }
        this.handleTabSelection = this.handleTabSelection.bind(this);
    }

    handleTabSelection(event, newVlaue) {
        this.setState({selectedValue: newVlaue});
    }

    getSelectedSection() {
        switch(this.state.selectedValue) {
            case 0:
                return (<ApplicationDetails application={this.props.application}></ApplicationDetails>);
            case 1:
                return (<ProfileHistory user_id={this.props.user_id}></ProfileHistory>);
            default:
                return (<ApplicationDetails application={this.props.application}></ApplicationDetails>);
        }
    }

    render() {
        return (
            <Grid item xs={8}>
                <Card style={cardStyles}>
                    <Paper square>
                        <Tabs
                            value={this.state.selectedValue}
                            indicatorColor="primary"
                            textColor="primary"
                            onChange={this.handleTabSelection}
                            aria-label="Select profile section."
                        >
                            <Tab label="Application" />
                            <Tab label="History" />
                        </Tabs>
                    </Paper>
                    <CardContent>
                        {this.getSelectedSection()}
                    </CardContent>
                </Card>
            </Grid>
        )
    }
}

export default ApplicationSections;

const cardStyles = {
    margin: 25
}