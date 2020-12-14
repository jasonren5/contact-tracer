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
        let article_id = props.match.params.articleId
        getFullArticle(props.firebase, article_id).then((article) => {
            setArticle(article);
        }).catch((err) => {
            console.log(err);
        })
    }, []);

    const addSectionToArticle = (section) => {
        var updateArticle = article;
        for (let i = section.order; i < updateArticle.sections.length; i++) {
            updateArticle.sections[i].order += 1;
        }

        updateArticle.sections.splice(section.order, 0, section);
        setArticle(updateArticle);
    }

    // jumpArticleSection(ref) {
    //     this.myRef.current.scrollIntoView();
    // }


    // Render the article
    return (
        <Container
            component="main"
            maxWidth="md"
            spacing={2}
        >
            {article ?
                <div className="holder">
                    <EditArticleHeader id="title" article={article} />
                    <AddSectionField
                        article_id={article.id}
                        addSectionToArticle={addSectionToArticle}
                        order={-1}
                    />
                    {article.sections.map((section) =>
                        <EditArticleSection
                            id={section.id}
                            key={section.id + section.order}
                            section={section}
                            addSectionToArticle={addSectionToArticle}
                        >
                        </EditArticleSection>
                    )}
                    {article.sources && <SourcesList editing sources={article.sources} />}
                </div>
                :
                <PageLoading />
            }
        </Container>
    );
}

export default withAuthorization(userLoggedInCondition)(EditArticlePage);