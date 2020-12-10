import React from 'react';
import PageLoading from '../Loading/PageLoading'
import PublishedThumbnail from '../Browse/PublishedThumbnail'
import { withFirebase } from '../../utils/firebase'
import { getAllArticles } from '../../utils/functions/articles'
import { Grid, Card, Typography } from "@material-ui/core";

class PublishedList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            articles: [],
            filteredArticles: []
        }

        this.getFilteredArticles = this.getFilteredArticles.bind(this);
    }

    componentDidMount() {
        getAllArticles(this.props.firebase).then((articles) => {
            var articleList = articles.article_list
            var filteredArticles = this.getFilteredArticles(articleList);
            this.setState({
                articles: articles.article_list,
                filteredArticles: filteredArticles
            })
        })
    }

    getFilteredArticles(articles, typeFilter) {
        var filteredArticles = [];
        const includeAll = (typeFilter === "all");
        articles.forEach((article) => {
            const includeThis = article.type === typeFilter;
            if (includeAll || includeThis) {
                if (this.props.searchTerm === "" || article.title.toLowerCase().includes(this.props.searchTerm.toLowerCase()) || article.summary.toLowerCase().includes(this.props.searchTerm.toLowerCase())) {
                    filteredArticles.push(article);
                }
            }
        })

        return filteredArticles;
    }

    render() {
        var filteredArticles = this.getFilteredArticles(this.state.articles, this.props.typeFilter);
        if (this.state.articles.length <= 0) {
            return (
                <PageLoading />
            )
        }
        return (
            <Grid
                container
                spacing={4}
                justify="center"
                alignItems="center"
                direction={this.props.mediaQuery ? "column" : "row"}
            >
                {filteredArticles.length > 0 ?
                    filteredArticles.map((article, index) =>
                        <PublishedThumbnail key={article.id + index} article={article} />
                    )
                    :
                    <Card fontWeight="fontWeightBold" >
                        <Typography variant="h5" >No articles found with that keyword/filter!</Typography>
                    </Card>
                }
            </Grid>
        )
    }
}

export default withFirebase(PublishedList);