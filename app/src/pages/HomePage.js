import React from 'react';
import NavBar from '../components/NavBar';
import { getAllArticles } from '../utils/functions/articles';

class HomePage extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        getAllArticles().then((articles) => {
            this.setState({
                articles: articles
            });
        }).catch((err) => {
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