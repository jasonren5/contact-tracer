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
        var loggedInUser = "None";
        if(this.props.user) {
            loggedInUser = this.props.user.email;
        }
        return (
            <div>
                <h1>you are logged in with user {loggedInUser}</h1>
                <button type="button" onClick={this.handleLogout}>Logout</button>
            </div>
        )
    }
}

export default Home;