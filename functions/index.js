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

//Returns user data based on input UID that corresponds to a document ID (and auth ID)
exports.getUserById = functions.https.onRequest((req, res) => {
    // Grab the id parameter.
    const id = req.query.id;
    const db = admin.firestore();

    functions.logger.info("Getting user with id: '" + id + "'", { structuredData: true });

    //get document from users collection with id == id
    db.collection("users").doc(id).get().then(doc => {
        if (doc.exists) {
            res.send(doc.data());
            return;
        } else {
            res.sendStatus(500);
            return;
        }
    }).catch(err => {
        functions.logger.info(err, { structuredData: true });
        res.sendStatus(500);
    });
});

//Returns user data based on input username that corresponds to a username stored in a document in the users collection
//  Note: this assumes that the 'users' collection exists, and that documents within that collection have a 'username' field.
exports.getUserByUsername = functions.https.onRequest((req, res) => {
    // Grab the username parameter.
    const username = req.query.username;
    const db = admin.firestore();

    functions.logger.info("Getting user with name: '" + username + "'", { structuredData: true });

    //get snapshot of users collection of all documents with field username == username
    db.collection("users").where("username", "==", username).get().then(querySnapshot => {
        //this is a little bad, but as long as usernames are unique this shouldn't be an issue... crosses fingers
        querySnapshot.forEach(doc => {
            res.send(doc.data());
        });
        return;
    }).catch(err => {
        functions.logger.info(err, { structuredData: true });
        res.sendStatus(500);
    });
});

//On auth creation, adds a document to the users collection with the same ID as the auth ID.
//  Defaults username to the auth email and sets number of contributions to 0.
exports.createUserOnAuthCreation = functions.auth.user().onCreate((user) => {
    const db = admin.firestore();
    const uid = user.uid;
    functions.logger.info("Adding user to firestore with uid: '" + uid + "'", { structuredData: true });

    db.collection("users").doc(uid).set({
        username: user.email,
        number_of_contributions: 0
    });
});

// Get a full article by id
exports.getFullArticleByID = functions.https.onCall((data, context) => {
    const db = admin.firestore();
    let article_id = data.article_id;

    var promises = [];
    promises.push(db.collection("articles").doc(article_id).get());
    promises.push(db.collection("articles").doc(article_id).collection("sections").get());
    return Promise.all(promises).then(async (values) => {
        var articleData = values[0].data();
        articleData["article_id"] = values[0].id;

        let sectionData = values[1];

        let sections = await Promise.all(sectionData.docs.map(async (doc) => {
            const versions = await db.collection("articles").doc(article_id).collection("sections").doc(doc.id).collection("versions").orderBy('order', 'desc').get();
            var section = doc.data();
            let latestVersion = versions.docs[0];
            let latestVersionData = versions.docs[0].data();

            section["section_id"] = doc.id;
            section["current_version"] = latestVersion.id;
            section["body"] = latestVersionData.body;

            return section;
        }))

        let data = {
            article_data: articleData,
            section_data: sections
        }

        return data;
    }).catch(err => {
        return err;
    });
});

exports.addVersionToSection = functions.https.onCall((data, context) => {
    const db = admin.firestore();
    const article_id = data.article_id;
    const section_id = data.section_id;
    const previous_version_id = data.previous_version_id;

    const versionsPromise = db.collection("articles").doc(article_id).collection("sections").doc(section_id).collection("versions").orderBy('order', 'desc').get();

    return versionsPromise.then((versions) => {
        let latestVersion = versions.docs[0];
        let latestVersionData = versions.docs[0].data();

        if(latestVersion.id !== previous_version_id && previous_version_id) {
            // executes if the previous_verson_id is not null and is the same as the most recent version in the database
            let resData = {
                conflict: true,
                current_version: latestVersionData
            }
            return Promise.resolve(resData)
        }

        // assigns the order param of the new version, 0 if this is the first version of a new section
        const newVersionOrder = (previous_version_id ? latestVersionData.order : -1) + 1;

        var newVersionData = {
            body: data.body,
            previous_version_id: previous_version_id,
            user_id: context.auth.uid,
            order: newVersionOrder
        }

        var versionPromise = db.collection("articles").doc(article_id).collection("sections").doc(section_id).collection("versions").add(newVersionData);

        return versionPromise.then((doc) => {
            newVersionData["article_id"] = article_id;
            newVersionData["section_id"] = section_id;
            newVersionData["version_id"] = doc.id;

            let resData = {
                conflict: false,
                current_version: newVersionData
            }

            return resData;
        })
    })
})


/*
*   Gets information for an article section from the client, and adds that information to the sections collection.
*   Params: article_id = id of article section is attached to, type = 0 for text, 1 for image,
*       body = either text (if type == 0) or image URL (if type == 1)
*/
exports.createSection = functions.https.onRequest((req, res) => {
    const db = admin.firestore();

    const article_id = req.article_id;
    const type = parseInt(req.type);
    const body = req.body;

    if (isNaN(type)) {
        //send bad request
        res.sendStatus(400);
        return;
    }

    //lack of edits implementation is fine for MVP
    const sectionToAdd = {
        article_id: article_id,
        type: type,
        body: body,
        edits: null
    };

    db.collection("sections").add(sectionToAdd)
        .then(docRef => {
            functions.logger.info("Seciton document written with ID: " + docRef.id, { structuredData: true });
            res.send(200);
            return;
        })
        .catch(error => {
            functions.logger.info("Error adding section with ID: " + docRef.id, { structuredData: true });
            res.send(200);
            return;
        });

});

exports.getAllArticles = functions.https.onCall((data, context) => {
    const db = admin.firestore();
    const articlesPromise = db.collection("articles").get();

    return articlesPromise.then(snapshot => {
        let resData = { "article_list": [] };
        snapshot.forEach(doc => {
            resData["article_list"].push({
                "id": doc.id,
                "title": doc.data().title,
                "image_url": doc.data().image_url
            });
        });

        return resData;
    }).catch(error => {
        console.log(error);
        return error;
    });

});

// exports.getArticleListGetRequest = functions.https.onRequest(async (req, res) => {
//     const db = admin.firestore();
//     const articlesPromise = db.collection("articles").get();

//     articlesPromise.then(snapshot => {
//         let resData = { "article_list": {} };
//         snapshot.forEach(doc => {
//             resData["article_list"][doc.id] = {
//                 "title": doc.data().title,
//                 "image_url": doc.data().image_url
//             };
//         });

//         res.send(resData);
//     }).catch(error => {
//         console.log(error);
//         res.send(error);
//     });

// });