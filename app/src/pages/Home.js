import React from 'react'
import firebase from 'firebase'

import NavBar from '../components/NavBar'

class Home extends React.Component {
    constructor(props) {
        super(props);
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

export default Home;