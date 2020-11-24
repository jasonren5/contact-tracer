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
import ContributeBrowse from './pages/Browse/ContributeBrowse'
import PublishedBrowse from './pages/Browse/PublishedBrowse'
import PageNotFound from './pages/PageNotFound.js';
import ArticlePage from './pages/Article/ArticlePage';
import EditArticlePage from './pages/Article/EditArticlePage';
import PublicProfile from './pages/Profile/PublicProfile';
import PrivateProfile from './pages/Profile/PrivateProfile';
import Navbar from './components/Navbar/Navbar';
import Loading from './components/Loading/PageLoading'

import { withAuthentication } from './utils/session';

// TODO: Add footer to site

const App = () => (
  <div className="App">
    <Router>
      <Navbar />
      <Switch>
        <Route exact path={'/'} component={HomePage} />
        <Route path={'/signin'} component={SignInPage} />
        <Route path={'/signup'} component={SignUpPage} />
        <Route path={'/forgot-password'} component={PasswordForgetPage} />
        <Route path={'/browse/contribute'} component={ContributeBrowse} />
        <Route path={'/browse/published'} component={PublishedBrowse} />
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
