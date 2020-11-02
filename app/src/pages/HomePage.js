import React from 'react';
import NavBar from '../components/NavBar';
import { getAllArticles } from '../utils/functions/articles';

class HomePage extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        getAllArticles().then((articles) => {
            console.log("test");
            console.log(articles);
            this.setState({
                articles: articles
            });
        }).catch((err) => {
            // window.location.href = ('/article-not-found');
            console.log(err);
        })
    }

    render() {
        return (
            <div id="home-page">
                <NavBar />
                <p>this is the home page</p>
            </div>
        )
    }
}

export default HomePage;