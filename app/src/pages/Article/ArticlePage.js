import React from 'react';
import Section from "../../components/Articles/ArticleSection";
import ArticleHeader from "../../components/Articles/ArticleHeader";
import { Container } from '@material-ui/core';
import PageLoading from '../../components/Loading/PageLoading';
import LikeButton from '../../components/Articles/LikeButton';

import { getFullArticle } from '../../utils/functions/articles';
import { withFirebase } from '../../utils/firebase';

class ArticlePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            article: null
        }
    }

    componentDidMount() {
        let article_id = this.props.match.params.articleId
        getFullArticle(this.props.firebase, article_id).then((article) => {
            this.setState({
                article: article
            });
        }).catch((err) => {
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
                <LikeButton article_id={this.state.article.id} liked_users={[]} />
                {this.state.article.sections.map((section) =>
                    <Section section={section}></Section>
                )}
            </Container>
        )
    }
}

export default withFirebase(ArticlePage);