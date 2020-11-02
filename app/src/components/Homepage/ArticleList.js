import React, { useState, useEffect } from 'react';
import { getAllArticles } from '../../utils/functions/articles';
import ArticleContainer from './ArticleContainer';

export default function ArticleList() {
    const INITIAL_STATE = {
        articles: []
    };
    const [state, setState] = useState({
        ...INITIAL_STATE
    });

    useEffect(() => {
        getAllArticles().then((articles) => {
            setState({ articles: articles.article_list });
        }).catch((err) => {
            console.log(err);
        })
    }, []);

    return (
        <div className="Articles List">
            {state.articles.length > 0 && state.articles.map(article => {
                return <ArticleContainer key={article.id} article={article} />;
            })
            }
        </div>
    );
}