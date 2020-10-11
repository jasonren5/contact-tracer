import React from 'react'
import firebase from 'firebase'

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogout() {
        firebase.auth().signOut();
    }

    render() {
        return (
            <div>
                <h1>you are logged in with user {this.props.user.email}</h1>
                <button type="button" onClick={this.handleLogout}>Logout</button>
            </div>
        )
    }
}

export default Home;