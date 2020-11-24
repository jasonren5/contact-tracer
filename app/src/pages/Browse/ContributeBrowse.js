import React from 'react';
import ContributeList from '../../components/Browse/ContributeList'
import { Grid } from "@material-ui/core";

class ContributeBrowse extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            articles: []
        }
    }

    render() {
        return(
            <div>
                <h1>Contribute to Articles</h1>
                <Grid container direction="row" justify="center">
                    <ContributeList />
                </Grid>
            </div>
        )
    }
}

export default ContributeBrowse;