import React from 'react';
import PageLoading from '../Loading/PageLoading'
import PublishedThumbnail from '../Browse/PublishedThumbnail'
import { withFirebase } from '../../utils/firebase'
import { getAllArticles } from '../../utils/functions/articles'
import { Grid } from "@material-ui/core";

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
                filteredArticles.push(article);
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
            <Grid container spacing={3} direction="column">
                {filteredArticles.map((article, index) =>
                    <PublishedThumbnail key={article.id + index} article={article} />
                )}
            </Grid>
        )
    }
}

export default withFirebase(PublishedList);