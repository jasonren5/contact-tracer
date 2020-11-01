import React from 'react'
import firebase from 'firebase';
import {
  AppBar,
  Toolbar,
  IconButton,
  MenuIcon,
  Typography,
  Button
} from '@material-ui/core';

class NavBar extends React.Component {
  touchnavbar() {
    firebase.auth().signOut()
      .then(function () {
        // Sign-out successful.
      })
      .catch(function (error) {
        // An error happened
      });
  }
  // TODO: Need to import classes
  // for icon button: className={classes.menuButton}
  // For typography: className={classes.title}
  render() {
    return (
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">
            News
          </Typography>
          <Button color="inherit" onPress={this.touchnavbar} href="/">logout;</Button>
          <Button color="inherit" href="/">home</Button>
        </Toolbar>
      </AppBar>
    )

  }
}

export default NavBar;