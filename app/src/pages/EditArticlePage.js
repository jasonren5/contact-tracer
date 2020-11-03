import React from 'react';
import EditArticleSection from "../components/Articles/EditArticleSection";
import ArticleHeader from "../components/Articles/ArticleHeader";
import { getFullArticle } from '../utils/functions/articles';

class EditArticlePage extends React.Component {
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
            console.log(err);
            // window.location.href = ('/article-not-found');
        })
    }

    render() {
        // If article hasn't loaded yet, render div
        // TODO: render loading animation here
        if (!this.state.article) {
            return (
                <div>

                </div>
            )
        }
        // Render the article
        return (
            <div>
                <ArticleHeader article={this.state.article} />
                {this.state.article.sections.map((section) =>
                    <EditArticleSection section={section}></EditArticleSection>
                )}
            </div>
        )
    }
}

export default EditArticlePage;