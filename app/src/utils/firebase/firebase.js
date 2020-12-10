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

        // Local functions line  (uncomment it to use local emulators)
        this.functions.useFunctionsEmulator("http://localhost:5001");
    }

    // Firebase Auth API
    doCreateUserWithEmailAndPassword = (email, password, name) => {
        var createUser = this.functions.httpsCallable("createUser");
        const displayName = name.replace(" ", "");
        const data = {
            email: email,
            password: password,
            name: name,
            displayName: displayName
        }

        return createUser(data).then((res) => {
            if(res.data.error) {
                return Promise.reject(new Error("Error signing up, please try again."));
            }
            return this.doSignInWithEmailAndPassword(email, password);
        })
    }
    doSignInWithEmailAndPassword = (email, password) => this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () => this.auth.signOut();

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);
    doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);

    doDeleteUser = () => this.auth.currentUser.delete();

    doReauthenticateWithCredential = credential => this.auth.currentUser.reauthenticateWithCredential(credential);

    doGetCurrentUser = () => {return this.auth.currentUser;};

    doGetCurrentName = () => {
        const user = this.auth.currentUser

        if(user === null) {
            return null;
        }

        return this.auth.currentUser.displayName;
    };
}

export default Firebase;