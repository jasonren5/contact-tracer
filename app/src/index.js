import React from 'react';
import Firebase, { FirebaseContext } from './utils/firebase';
import filter, { FilterContext } from './utils/filter';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ThemeProvider } from '@material-ui/styles';
import theme from './utils/material-ui/theme';
import * as serviceWorker from './serviceWorker';
// TODO: for final release, get rid of strict mode
ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <FirebaseContext.Provider value={new Firebase()}>
        <FilterContext.Provider value={new filter()}>
          <App />
        </FilterContext.Provider>
      </FirebaseContext.Provider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
