import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import './App.css';
// import SignIn from './pages/SignIn';
import SignInPage from './pages/Auth2.0/SignIn';
import SignUpPage from './pages/Auth2.0/SignUp';
import PasswordForgetPage from './pages/Auth2.0/PasswordForget';
import firebaseConfig from './utils/firebase/config.js';
import firebase from 'firebase'
import HomePage from './pages/HomePage';
import PageNotFound from './pages/PageNotFound.js';
import ArticlePage from './pages/ArticlePage';
import EditArticlePage from './pages/EditArticlePage';
import PublicProfile from './pages/PublicProfile';
import NavBar from './components/NavBar';

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
    return (
      <div className="App">
        <div>
          <NavBar />
          <Router>
            <Switch>
              <Route exact path={'/'} component={HomePage} />
              <Route path={'/signin'} component={SignInPage} />
              <Route path={'/signup'} component={SignUpPage} />
              <Route path={'/forgot-password'} component={PasswordForgetPage} />
              <Route path={'/article/:articleId'} component={ArticlePage} />
              <Route path={'/contribute/:articleId'} component={EditArticlePage} />
              <Route path={'/user/:userId'} component={PublicProfile} />
              <Route component={PageNotFound} />
            </Switch>
          </Router>
        </div>
      </div>
    )
  }
}

export default App;
