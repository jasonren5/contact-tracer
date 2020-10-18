import React from 'react';
import firebase from 'firebase';

class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            username: '',
            password: '',
            loginError: '',
            registerError: ''
        };

        this.handleLogin = this.handleLogin.bind(this);
        this.validateLogin = this.validateLogin.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.validateRegister = this.validateRegister.bind(this);
    }

    //login on form submit
    async handleLogin(event) {
        console.log("login detected");
        event.preventDefault();

        if (this.validateLogin()) {
            firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).catch(error => {
                this.setLoginError(error.message);
                console.error(error);
            });
        }
    }

    //validates the login field
    validateLogin() {
        if (this.state.email.length < 1) {
            this.setLoginError("Email cannot be empty");
            return false;
        }

        if (this.state.password.length < 1) {
            this.setLoginError("Password cannot be empty");
            return false;
        }

        return true;
    }

    //sets loginError in state
    //errorMessage: string containing error message
    setLoginError(errorMessage) {
        this.setState({
            loginError: "Error: " + errorMessage
        });
    }

    //register form submission
    handleRegister(event) {
        if (this.validateRegister()) {
            firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).catch(error => {
                // Handle Errors here.
                this.setRegisterError(error.message);
                console.error(error);
            });
        }

        event.preventDefault();
    }

    //validate the registration form. return true if valid, false otherwise
    validateRegister() {
        if (this.state.email.length < 1) {
            this.setRegisterError("Email cannot be empty.");
            return false;
        }

        if (this.state.username.length < 1) {
            this.setRegisterError("Username cannot be empty.")
            return false;
        }

        if (this.state.password.length < 1) {
            this.setRegisterError("Password cannot be empty.");
            return false;
        }

        return true;
    }

    //sets registerError in state
    //errorMessage: string containing error message
    setRegisterError(errorMessage) {
        this.setState({
            registerError: "Error: " + errorMessage
        });
    }


    //set state variables accordingly if value is changed in forms
    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    render() {
        return (
            <div>
                <h1>sign in</h1>
                <p class="error">{this.state.loginError}</p>
                <form onSubmit={this.handleLogin}>
                    <label>email:
                            <input type="text" name="email" value={this.state.email} onChange={this.handleInputChange} />
                    </label>
                    <label>password:
                            <input type="password" name="password" value={this.state.password} onChange={this.handleInputChange} />
                    </label>
                    <input type="submit" name="login-button" value="login" />
                </form>

                <h1>or create an account</h1>
                <p class="error">{this.state.registerError}</p>
                <form onSubmit={this.handleRegister}>
                    <label>email:
                            <input type="text" name="email" value={this.state.email} onChange={this.handleInputChange} />
                    </label>
                    <label>username:
                            <input type="text" name="username" value={this.state.username} onChange={this.handleInputChange} />
                    </label>
                    <label>password:
                            <input type="password" name="password" value={this.state.password} onChange={this.handleInputChange} />
                    </label>
                    <input type="submit" name="register-button" value="register" />
                </form>
            </div>
        );
    }
}

export default SignIn;