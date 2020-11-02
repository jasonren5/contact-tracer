import React, { useState, useEffect } from 'react';
import { getAllArticles } from '../../utils/functions/articles';

export default function ArticleList(props) {
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
        <div>
            {state.articles.length > 0 && state.articles.map(article => {
                return <p>{article.title}</p>;
            })
            }
        </div>
    );
}