import React from 'react';
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from '@material-ui/core/CardContent';

class ProfileVersion extends React.Component {
    render() {
        const articlePath = "articles/" + this.props.version.article_id;
        return (
            <Grid item xs={6}>
                <Card>
                    <CardContent>
                        <h3><a href={articlePath}>{this.props.version.article_data.title}</a></h3>
                        <p>{this.props.version.version_data.body}</p>
                    </CardContent>
                </Card>
            </Grid>
        )
    }
}

export default ProfileVersion;