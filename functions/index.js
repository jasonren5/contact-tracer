//default code, needed to interface with firebase cloud functions
const functions = require('firebase-functions');

//needed to interface with firebase firestore
const admin = require('firebase-admin');
admin.initializeApp();

/*
*   This test function is visible through the firebase emulator: https://firebase.google.com/docs/functions/get-started#emulate-execution-of-your-functions
*   To what extend should we be using the emulator and setting up a dev environment? We should definitely be using it at the very least to test functions.
*   In order to deploy firebase functions, you are required to use the pay as you go plan -- the free tier limits still exist, but if you go over, you pay.
*   As a result, any errors like an infinite loop could potentially be very costly in production -- so to some extent we should definitely be using the emulator.
*/
exports.helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from Firebase!");
});
