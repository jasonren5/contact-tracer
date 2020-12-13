import React from 'react';
import EditArticleSection from "../../components/Articles/EditArticles/EditArticleSection";
import EditArticleHeader from "../../components/Articles/EditArticles/EditArticleHeader";
import AddSectionField from "../../components/Sections/AddSectionField";
import { getFullArticle } from '../../utils/functions/articles';
import { withAuthorization, userLoggedInCondition } from '../../utils/session';
import { Container } from '@material-ui/core';

import PageLoading from '../../components/Loading/PageLoading';

class EditArticlePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            article: null
        }
        this.addSectionToArticle = this.addSectionToArticle.bind(this);
    }

    componentDidMount() {
        let article_id = this.props.match.params.articleId
        getFullArticle(this.props.firebase, article_id).then((article) => {
            this.setState({
                article: article
            });
        }).catch((err) => {
            console.log(err);
            // window.location.href = ('/article-not-found');
        })
    }

    addSectionToArticle(section) {
        var article = this.state.article;
        for (let i = section.order; i < article.sections.length; i++) {
            article.sections[i].order += 1;
        }

        article.sections.splice(section.order, 0, section);
        this.setState({
            article: article
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
        // TODO: ArticleHeader should become legacy once we do an image overhaul
        return (
            <Container
                component="main"
                maxWidth="md"
                spacing={2}
            >
                <EditArticleHeader article={this.state.article} />
                <AddSectionField
                    article_id={this.state.article.id}
                    addSectionToArticle={this.addSectionToArticle}
                    order={-1}
                />
                {this.state.article.sections.map((section) =>
                    <EditArticleSection
                        key={section.id + section.order}
                        section={section}
                        addSectionToArticle={this.addSectionToArticle}
                    >
                    </EditArticleSection>
                )}
            </Container>
        )
    }
}

export default withAuthorization(userLoggedInCondition)(EditArticlePage);