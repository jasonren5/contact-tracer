import React from 'react';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

class BrowseHeader extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedValue: "all"
        }

        this.handleTabSelection = this.handleTabSelection.bind(this);
    }

    handleTabSelection(event, newValue) {
        this.setState({selectedValue: newValue});
        this.props.updateParent(newValue);
    }

    render() {
        return(
            <Paper square style={paperStyle}>
                <Tabs
                    value={this.state.selectedValue}
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={this.handleTabSelection}
                    aria-label="Select profile section."
                >
                    <Tab label="All" value="all"/>
                    <Tab label="Politics" value="politics"/>
                    <Tab label="Finance" value="finance"/>
                    <Tab label="Technology" value="technology"/>
                </Tabs>
            </Paper>
        )
    }
}

export default BrowseHeader;

const paperStyle = {
    width: "100%",
    marginBottom: 20
}