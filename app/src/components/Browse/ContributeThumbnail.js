import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Grid } from "@material-ui/core";


class ContributeThumbnail extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const article_url = '/contribute/' + this.props.article.id;
        return(
            <Grid item>
                <Card>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {this.props.article.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            {this.props.article.summary}
                        </Typography>

                    </CardContent>
                    <CardActions>
                        <Button size="small" color="primary" href={article_url}>
                            Contribute
                        </Button>
                    </CardActions>
                </Card>
            </Grid>
        )
    }
}

export default ContributeThumbnail;