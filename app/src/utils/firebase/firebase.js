import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import firebaseConfig from './config';

class Firebase {
    constructor() {
        app.initializeApp(firebaseConfig);

        this.auth = app.auth();
        this.db = app.firestore();
        this.functions = app.functions();

        // Local functions line  
        // this.localFunctions = app.functions().useFunctionsEmulator("http://localhost:5001");
    }

    // Firebase Auth API
    doCreateUserWithEmailAndPassword = (email, password) => this.auth.createUserWithEmailAndPassword(email, password);
    doSignInWithEmailAndPassword = (email, password) => this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () => this.auth.signOut();

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);
    doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);

    doDeleteUser = () => this.auth.currentUser.delete();

    doReauthenticateWithCredential = credential => this.auth.currentUser.reauthenticateWithCredential(credential);

    doGetCurrentUser = () => {return this.auth.currentUser;};
}

export default Firebase;