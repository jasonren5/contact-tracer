import React, { useState } from "react";
import logo from './logo.svg';
import './App.css';
import SignIn from './components/SignIn.js';
import firebaseConfig from './firebase/config.js'
import firebase from 'firebase'
import Home from './components/Home.js';

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
    if (this.state.user) {
      return (
        <div className="App">
          <Home />
        </div>
      );
    }
    return (
      <div className="App">
        <SignIn />
      </div>
    );
  }
}

export default App;
