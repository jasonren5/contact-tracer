import React, { useState, useEffect } from 'react';
import EditArticleSection from "../../components/Articles/EditArticles/EditArticleSection";
import EditArticleHeader from "../../components/Articles/EditArticles/EditArticleHeader";
import AddSectionField from "../../components/Sections/AddSectionField";
import SourcesList from "../../components/Sources/SourcesList";
import { getFullArticle } from '../../utils/functions/articles';
import { withAuthorization, userLoggedInCondition } from '../../utils/session';
import { Container } from '@material-ui/core';

import PageLoading from '../../components/Loading/PageLoading';

function EditArticlePage(props) {
    const [article, setArticle] = useState();

    useEffect(() => {
        fetchArticle();
    }, []);

    const fetchArticle = () => {
        let article_id = props.match.params.articleId;
        getFullArticle(props.firebase, article_id).then((article) => {
            setArticle(article);
        }).catch((err) => {
            console.log(err);
        });
    }

    // Render the article
    return (
        <Container
            component="main"
            maxWidth="md"
            spacing={2}
        >
            {article ?
                <div className="holder">
                    <EditArticleHeader
                        id="title"
                        article={article}
                        refreshArticle={fetchArticle}
                    />
                    <AddSectionField
                        article_id={article.id}
                        refreshArticle={fetchArticle}
                        order={-1}
                    />
                    {article.sections.map((section) =>
                        <EditArticleSection
                            id={section.id}
                            article_id={article.id}
                            key={section.id + section.order}
                            section={section}
                            refreshArticle={fetchArticle}
                        >
                        </EditArticleSection>
                    )}
                    {article.sources &&
                        <SourcesList
                            editing
                            article_id={article.id}
                            sources={article.sources}
                            refreshArticle={fetchArticle}
                        />}
                </div>
                :
                <PageLoading />
            }
        </Container>
    );
}

export default withAuthorization(userLoggedInCondition)(EditArticlePage);