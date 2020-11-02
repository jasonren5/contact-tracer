import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import { getAllArticles } from '../utils/functions/articles';

const INITIAL_STATE = {
    articles: {}
};

export default function HomePage() {
    const [state, setState] = useState({
        ...INITIAL_STATE
    });

    useEffect(() => {
        getAllArticles().then((articles) => {
            setState({ articles: articles.article_list });
        }).catch((err) => {
            console.log(err);
        })
    });

    return (
        <div id="home-page">
            <NavBar />
            <p>this is the new home page</p>
        </div>
    );
}