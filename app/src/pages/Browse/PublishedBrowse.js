import React from 'react';
import BrowseHeader from '../../components/Browse/BrowseHeader'
import PublishedList from '../../components/Browse/PublishedList'
import { Grid } from "@material-ui/core";
import Typography from '@material-ui/core/Typography';

class PublishedBrowse extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            typeFilter: "all"
        }
        this.selectType = this.selectType.bind(this);
    }

    selectType(type) {
        this.setState({
            typeFilter: type
        })
    }
    // TODO: Move search bar - have it actually query the database? (probally not because speed)
    render() {
        return (
            <Grid container justify="center">
                <Grid container xs={6} justify="center">
                    <Typography variant="h3" component="h1" style={titleStyle}>
                        Browse Articles
                    </Typography>
                    <BrowseHeader updateParent={this.selectType} />
                    <PublishedList typeFilter={this.state.typeFilter} />
                </Grid>
            </Grid>
        )
    }
}

export default PublishedBrowse;

const titleStyle = {
    marginTop: 30,
    marginBottom: 20
}