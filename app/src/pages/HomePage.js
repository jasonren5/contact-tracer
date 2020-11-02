import React from 'react';
import NavBar from '../components/NavBar';
import ArticleList from '../components/Homepage/ArticleList';

export default function HomePage() {
    return (
        <div className="home-page">
            <NavBar />
            <p>This is the new home page</p>
            <ArticleList />
        </div>
    );
}