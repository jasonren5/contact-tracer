import React from 'react';
import ContributeList from '../../components/Browse/ContributeList'
import { Grid, Typography } from "@material-ui/core";

class ContributeBrowse extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            articles: []
        }
    }

    render() {
        return (
            <div>
                <Typography variant="h3" component="h1" style={titleStyle}>
                    Contribute to Articles
                </Typography>
                <Grid container direction="row" justify="center">
                    <ContributeList />
                </Grid>
            </div>
        )
    }
}

export default ContributeBrowse;

const titleStyle = {
    marginTop: 30,
    marginBottom: 20
}