import React from 'react';
import Grid from "@material-ui/core/Grid";
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ProfileHistory from './ProfileHistory';
import ProfileModApp from './ProfileModApp';
import ProfileSettings from './ProfileSettings';
import Card from "@material-ui/core/Card";
import CardContent from '@material-ui/core/CardContent';

class ProfileSections extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedValue: 0
        }
        this.handleTabSelection = this.handleTabSelection.bind(this);
    }

    handleTabSelection(event, newVlaue) {
        console.log(newVlaue);
        this.setState({selectedValue: newVlaue});
    }

    getSelectedSection() {
        switch(this.state.selectedValue) {
            case 0:
                return (<ProfileHistory user_id={this.props.user_id}></ProfileHistory>);
            case 1:
                return (<ProfileModApp />);
            case 2:
                return (<ProfileSettings user_id={this.props.user_id}></ProfileSettings>);
            default:
                return (<ProfileHistory user_id={this.props.user_id}></ProfileHistory>);
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
                            <Tab label="History" />
                            {this.props.private && 
                                <Tab label="Expertise" />
                            }
                            {this.props.private && 
                                <Tab label="Settings" />
                            }
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

export default ProfileSections;

const cardStyles = {
    margin: 25
}