import React from 'react'

class ArticleHeader extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h1>{this.props.article.title}</h1>
                <img src={this.props.article.image_url} alt={this.props.article.alt_text} style={imageStyle} />
            </div>
        );
    }
}

export default ArticleHeader;

const imageStyle = {
    width: "100%"
}