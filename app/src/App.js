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
import HomePage from './pages/HomePage';
import PageNotFound from './pages/PageNotFound.js';
import ArticlePage from './pages/Article/ArticlePage';
import EditArticlePage from './pages/Article/EditArticlePage';
import PublicProfile from './pages/Profile/PublicProfile';
import PrivateProfile from './pages/Profile/PrivateProfile';
import Navbar from './components/Navbar/Navbar';

import { withAuthentication } from './utils/session';

const App = () => (
  <div className="App">
    <Router>
      <Navbar />
      <Switch>
        <Route exact path={'/'} component={HomePage} />
        <Route path={'/signin'} component={SignInPage} />
        <Route path={'/signup'} component={SignUpPage} />
        <Route path={'/forgot-password'} component={PasswordForgetPage} />
        <Route path={'/article/:articleId'} component={ArticlePage} />
        <Route path={'/contribute/:articleId'} component={EditArticlePage} />
        <Route path={'/user/:userId'} component={PublicProfile} />
        <Route path={'/profile'} component={PrivateProfile} />
        <Route component={PageNotFound} />
      </Switch>
    </Router>
  </div>
);

export default withAuthentication(App);
