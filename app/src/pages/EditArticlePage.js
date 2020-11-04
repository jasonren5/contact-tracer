import React from 'react';
import EditArticleSection from "../components/Articles/EditArticleSection";
import ArticleHeader from "../components/Articles/ArticleHeader";
import { getFullArticle } from '../utils/functions/articles';
import { Container } from '@material-ui/core';

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
        getFullArticle(article_id).then((article) => {
            this.setState({
                article: article
            });
        }).catch((err) => {
            console.log(err);
            window.location.href = ('/article-not-found');
        })
    }

    addSectionToArticle(section){
        var article = this.state.article;

        console.log(article.sections.join());
        for (let i = section.order; i < article.sections.length; i++) { 
            article.sections[i].order+=1;
          }
        
        article.sections.splice(section.order, 0, section);
        console.log(article.sections.join());

        this.setState({
            article: article
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
                    <EditArticleSection 
                        key={section.id+section.order} 
                        section={section}
                        addSectionToArticle={this.addSectionToArticle}
                    >
                    </EditArticleSection>
                )}
            </Container>
        )
    }
}

export default EditArticlePage;