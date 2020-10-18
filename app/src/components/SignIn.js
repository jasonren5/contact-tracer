import React from 'react';
import firebase from 'firebase'


class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    //login on form submit
    handleSubmit(event) {
        console.log("login detected");
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("login error " + errorCode + ": " + errorMessage);
        });
        event.preventDefault();
    }


    //from register button
    handleRegister(event) {
        console.log("register detected");
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("register error " + errorCode + ": " + errorMessage);
            // ...
        });
    }

    //set state variables accordingly if value is changed in form
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
                <form onSubmit={this.handleSubmit}>
                    <label>email:
                        <input type="text" name="email" value={this.state.email} onChange={this.handleInputChange} />
                    </label>
                    <label>password:
                        <input type="password" name="password" value={this.state.password} onChange={this.handleInputChange} />
                    </label>
                    <input type="submit" name="login-button" value="Login" />
                    <button type="button" onClick={this.handleRegister}>Register</button>
                </form>
            </div>
        );
    }
}

export default SignIn;