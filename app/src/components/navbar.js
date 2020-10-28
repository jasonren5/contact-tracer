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

class navbar extends React.Component {
  touchnavbar() {
    firebase.auth().signOut()
      .then(function () {
        // Sign-out successful.
      })
      .catch(function (error) {
        // An error happened
      });

  }
  render() {
    return (
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            News
    </Typography>
          <Button color="inherit" onPress={this.touchnavbar} href="/">logout;</Button>
          <Button color="inherit" href="/">home</Button>
        </Toolbar>
      </AppBar>
    )

  }
}