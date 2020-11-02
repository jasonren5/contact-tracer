import React from 'react';

export default function ArticleContainer(props) {
    const articleURL = "/article/" + props.article.id;

    return (
        <div className="Article Container">
            <a href={articleURL}>
                <img src={props.article.image_url} alt={props.article.title} />
                <p>{props.article.title}</p>
                <p>{props.article.id}</p>
            </a>
        </div>
    );
}