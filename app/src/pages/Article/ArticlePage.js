import React from 'react';
import ArticleSection from "../../components/Articles/ArticleSection";
import ArticleHeader from "../../components/Articles/ArticleHeader";
import { Container, Grid, Typography } from '@material-ui/core';
import PageLoading from '../../components/Loading/PageLoading';
import { LikeButton } from '../../components/Articles/Buttons';
import ArticleContributors from '../../components/Articles/Buttons/ArticleContributors';
import ArticleContributions from '../../components/Articles/Buttons/ArticleContributions';
import ArticleDate from '../../components/Articles/Buttons/ArticleDate';

import { getPublishedArticleByID } from '../../utils/functions/articles';
import { withFirebase } from '../../utils/firebase';
import SourcesList from '../../components/Sources/SourcesList';
import LastUpdated from '../../components/Articles/LastUpdated';

class ArticlePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            article: null,
            updated: null,
        }
    }

    componentDidMount() {
        let article_id = this.props.match.params.articleId
        getPublishedArticleByID(this.props.firebase, article_id).then((article) => {
            const date = new Date(article.updated._seconds * 1000).toLocaleString();
            this.setState({
                article: article,
                updated: date,
            });
        }).catch((err) => {
            console.log(err);
            window.location.href = ('/article-not-found');
        })
    }

    render() {
        // If article hasn't loaded yet, render div
        if (!this.state.article) {
            return (
                <div>
                    <PageLoading />
                </div>
            )
        }
        // Render the article
        return (
            <Container
                component="main"
                maxWidth="md"
                spacing={2}
            >
                <ArticleHeader article={this.state.article} />

                <Grid container direction="row">
                    <Grid item >
                        <ArticleContributions contributors={this.state.article.contributors} />
                    </Grid>
                    <Grid item >
                        <ArticleContributors contributors={this.state.article.contributors} />
                    </Grid>
                    <Grid item >
                        <LikeButton article_id={this.state.article.id} liked_users={this.state.article.liked_users} />
                    </Grid>
                    <Grid>
                        <ArticleDate article={this.state.article}/>
                    </Grid>
                    {this.state.article.updated._seconds !== this.state.article.created._seconds &&
                        <Grid item>
                            <LastUpdated updated={this.state.updated} />
                        </Grid>
                    }
                </Grid>
                {this.state.article.sections.map((section) =>
                    <ArticleSection key={section.id} section={section} article_id={this.state.article.id} />
                )}
                {this.state.article.sources &&
                    <SourcesList
                        article_id={this.state.article.id}
                        sources={this.state.article.sources}
                    />
                }
            </Container>
        )
    }
}

export default withFirebase(ArticlePage);