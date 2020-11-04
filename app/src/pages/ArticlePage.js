import React from 'react';
import Section from "../components/Articles/ArticleSection";
import ArticleHeader from "../components/Articles/ArticleHeader";
import { getFullArticle } from '../utils/functions/articles';
import { Container } from '@material-ui/core';

class ArticlePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            article: null
        }
    }

    componentDidMount() {
        let article_id = this.props.match.params.articleId
        getFullArticle(article_id).then((article) => {
            this.setState({
                article: article
            });
        }).catch((err) => {
            window.location.href = ('/article-not-found');
        })
    }

    render() {
        // If article hasn't loaded yet, render div
        // TODO: render loading animation here
        if (!this.state.article) {
            return (
                <div>
                    <h3>Loading...</h3>
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
                {this.state.article.sections.map((section) =>
                    <Section section={section}></Section>
                )}
            </Container>
        )
    }
}

export default ArticlePage;