import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Grid } from "@material-ui/core";


class PublishedThumbnail extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var datePublished = new Date(0);
        datePublished.setUTCSeconds(this.props.article.created._seconds);
        const dateString = datePublished.toDateString();

        const article_url = '/article/' + this.props.article.id;
        return(
            <Grid item>
                <Card>
                    <CardHeader 
                        title={this.props.article.title}
                        subheader={dateString}
                    />
                    <CardContent>
                        <Typography variant="body2" color="textSecondary" component="p">
                            {this.props.article.summary}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small" color="primary" href={article_url}>
                            Read More
                        </Button>
                    </CardActions>
                </Card>
            </Grid>
        )
    }
}

export default PublishedThumbnail;