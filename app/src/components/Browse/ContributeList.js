import React from 'react';
import PageLoading from '../Loading/PageLoading';
import { withFirebase } from '../../utils/firebase';
import { getAllUnpublishedArticles } from '../../utils/functions/articles';
import { Grid, Card, Typography } from "@material-ui/core";
import ArticleContainer from '../Homepage/ArticleContainer';

class ContributeList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            articles: null
        }
    }

    componentDidMount() {
        getAllUnpublishedArticles(this.props.firebase).then((articles) => {
            this.setState({
                articles: articles.article_list
            })
        })
    }
    render() {
        if (!this.state.articles) {
            return (
                <PageLoading />
            )
        }
        if (this.state.articles.length <= 0) {
            return (
                <Card fontWeight="fontWeightBold" style={cardStyle}>
                    <Typography variant="h5">No new articles to edit, check back in a few hours!</Typography>
                </Card>
            )
        }
        return (
            <Grid
                container
                direction={this.props.mediaQuery ? "column" : "row"}
                justify="center"
                alignItems="center"
                spacing={4}
            >
                {this.state.articles.map((article, index) =>
                    <ArticleContainer
                        key={article.id + index}
                        contribute
                        article={article}
                        mediaQuery={this.props.mediaQuery}
                        maxWidth={this.props.maxWidth}
                    />
                )}
            </Grid>
        )
    }
}

export default withFirebase(ContributeList);

const cardStyle = {
    marginTop: 30,
    marginBottom: 20
}