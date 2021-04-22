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
import SearchArticles from './pages/Browse/SearchArticles'
import PageNotFound from './pages/PageNotFound.js';
import ArticlePage from './pages/Article/ArticlePage';
import BreakingArticlePage from './pages/Article/BreakingArticlePage'
import EditArticlePage from './pages/Article/EditArticlePage';
import PublicProfile from './pages/Profile/PublicProfile';
import PrivateProfile from './pages/Profile/PrivateProfile';
import Navbar from './components/Navbar/Navbar';
import AdminPortal from './pages/Admin/AdminPortal';
import ModPortal from './pages/Mods/ModPortal';
import ApplicationReview from './pages/Admin/ApplicationReview';

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
        <Route path={'/search'} component={SearchArticles} />
        <Route path={'/article/:articleId'} component={ArticlePage} />
        <Route path={'/breaking/:articleId'} component={BreakingArticlePage} />
        <Route path={'/contribute/:articleId'} component={EditArticlePage} />
        <Route path={'/user/:userId'} component={PublicProfile} />
        <Route path={'/profile'} component={PrivateProfile} />
        <Route path={'/admin/review/:appId'} component={ApplicationReview} />
        <Route exact path={'/admin'} component={AdminPortal} />
        <Route exact path={'/mod'} component={ModPortal} />
        <Route component={PageNotFound} />
      </Switch>
    </Router>
  </div>
);

export default withAuthentication(App);
