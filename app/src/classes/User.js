/*
    Stores user information.
    id: UID tied to firebase auth ID and firestore users collection document ID 
    username: string tied to users collection "username" field
*/
class User {
    constructor(id, username, numberOfContributions) {
        this.id = id;
        this.username = username;
        this.numberOfContributions = numberOfContributions
    }
}