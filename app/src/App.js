import React, { useState } from "react";
import './App.css';
import SignIn from './components/SignIn.js';
// import firebaseConfig from './utils/firebase/config.js'
import firebase from 'firebase'
import Home from './components/Pages/Home.js';

class App extends React.Component {
  constructor(props) {
    super(props);

    //store user information in the state for now?
    this.state = {
      user: {}
    }
  }

  componentDidMount() {
    this.authListener();
  }

  authListener() {
    firebase.auth().onAuthStateChanged((user) => {
      console.log("Auth state changed.");
      console.log(user);
      if (user) {
        this.setState({ user });
      } else {
        this.setState({ user: null });
      }

    });
  }

  render() {
    //if user is authenti
    if (this.state.user != null) {
      return (
        <div className="App">
          <Home user={this.state.user} />
        </div>
      );
    } else {
      return (
        < div className="App" >
          <SignIn />
        </div >
      );
    }

  }
}

export default App;
