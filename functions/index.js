// Default code, needed to interface with firebase cloud functions
const functions = require('firebase-functions');

// Used for fetch requests to third party APIs
const axios = require('axios');

// Needed to interface with firebase firestore
const admin = require('firebase-admin');
require('firebase-functions/lib/providers/auth');
admin.initializeApp();

// Returns user data based on input UID that corresponds to a document ID (and auth ID)
exports.getUserById = functions.https.onRequest((req, res) => {
    // Grab the id parameter.
    const id = req.query.id;
    const db = admin.firestore();

    functions.logger.info("Getting user with id: '" + id + "'", { structuredData: true });

    // Get document from users collection with id == id
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

// Returns user data based on input username that corresponds to a username stored in a document in the users collection
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

// On auth creation, adds a document to the users collection with the same ID as the auth ID.
// Defaults username to the auth email and sets number of contributions to 0.
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
exports.getFullArticleByID = functions.https.onCall((data) => {
    const db = admin.firestore();
    let article_id = data.article_id;

    var promises = [];
    promises.push(db.collection("articles").doc(article_id).get());
    promises.push(db.collection("articles").doc(article_id).collection("sections").orderBy('order').get());
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

async function _getFullArticleByID(db, article_id) {
    var promises = [];
    promises.push(db.collection("articles").doc(article_id).get());
    promises.push(db.collection("articles").doc(article_id).collection("sections").orderBy('order').get());
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
}

exports.addVersionToSection = functions.https.onCall((data, context) => {
    const db = admin.firestore();
    const article_id = data.article_id;
    const section_id = data.section_id;
    const previous_version_id = data.previous_version_id;

    const versionsPromise = db.collection("articles").doc(article_id).collection("sections").doc(section_id).collection("versions").orderBy('order', 'desc').get();

    return versionsPromise.then((versions) => {
        let latestVersion = versions.docs[0];
        let latestVersionData = versions.docs[0].data();

        if (latestVersion.id !== previous_version_id && previous_version_id) {
            // executes if the previous_verson_id is not null and also different then the most recent version in the database
            let resData = {
                conflict: true,
                current_version: latestVersionData
            }
            return Promise.resolve(resData)
        }

        // assigns the order param of the new version, 0 if this is the first version of a new section
        const newVersionOrder = (previous_version_id ? latestVersionData.order : -1) + 1;
        const user_id = (context.auth ? context.auth.uid : null);

        // if there is a signed in user, increment thier contribution count
        if (user_id) {
            incrementContributions(user_id);
        }

        var newVersionData = {
            body: data.body,
            previous_version_id: previous_version_id,
            user_id: user_id,
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

function incrementContributions(userID) {
    const db = admin.firestore();
    const docRef = db.collection("users").doc(userID);
    const increment = admin.firestore.FieldValue.increment(1);
    docRef.update({ number_of_contributions: increment });
}

/*
* Adds Section at correct index. 
* Params:
* section: the section object that should be added
* 
*/
exports.addSectionAtIndex = functions.https.onCall((data, context) => {
    const db = admin.firestore();
    const index = data.section.order;
    const article_id = data.section.article_id;

    const increment = admin.firestore.FieldValue.increment(1);

    var reorderPromise = db.collection("articles").doc(article_id).collection("sections").where("order", ">=", index).get().then((sections) => {
        const batch = db.batch();

        sections.forEach((section) => {
            batch.set(section.ref, { order: increment }, { merge: true });
        });

        return batch.commit();
    })

    var sectionPromise = reorderPromise.then(() => {
        let sectionData = {
            order: index,
            type: data.section.type
        }
        return db.collection("articles").doc(article_id).collection("sections").add(sectionData);
    })

    var versionPromise = sectionPromise.then((section) => {
        let versionData = {
            order: 0,
            body: data.section.body,
            user_id: (context.auth ? context.auth.uid : null)
        }
        return db.doc(section.path).collection("versions").add(versionData);
    })

    var finalPromise = Promise.all([sectionPromise, versionPromise]);

    return finalPromise.then((results) => {
        return {
            section_id: results[0].id,
            version_id: results[1].id
        }
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
        .catch(() => {
            res.send(200);
            return;
        });

});


/*
* Get the all of the articles in the collection. Just get the ID, title, and image URL
*/
exports.getAllArticles = functions.https.onCall(() => {
    const db = admin.firestore();
    const articlesPromise = db.collection("articles").get();

    return articlesPromise.then(snapshot => {
        let resData = { "article_list": [] };
        snapshot.forEach(doc => {
            resData["article_list"].push({
                "id": doc.id,
                "title": doc.data().title,
                "image_url": doc.data().image_url,
                "type": doc.data().type,
                "created": doc.data().created,
                "published": doc.data().published
            });
        });

        return resData;
    }).catch(error => {
        return error;
    });
});

/*
* Get all the articles, as well as a short summary. Summary is pulled from the first section, and the latest version. This is pacckaged with id, title, and imageURL
*/
// TODO: Order the returned articles by date edited
exports.getAllArticlesWithSummaries = functions.https.onCall(() => {
    const db = admin.firestore();
    const articlesPromise = db.collection("articles").get();

    return articlesPromise.then(async (snapshot) => {
        let resData = { "article_list": [] };
        await Promise.all(snapshot.docs.map(async (article) => {
            // Default the snippet to having no summary data
            var snippet = "There is nothing written for this article yet. Be the first to contribute by editing!";

            // See if there is section data 
            const sectionQuery = await db.collection("articles").doc(article.id).collection("sections").where("type", "==", "text").orderBy("order", "asc").limit(1).get();
            var section = sectionQuery.docs[0];

            // If there is section data 
            if (section !== undefined) {
                // Get the most recent version, and retrieve body and save to snippet
                const versionQuery = await db.collection("articles").doc(article.id).collection("sections").doc(section.id).collection("versions").orderBy("order", "desc").limit(1).get();
                var latestVersion = versionQuery.docs[0];
                snippet = latestVersion.data().body;

                // If the snippet is over 30 characters, truncate it
                if (snippet.length > 250) {
                    snippet = snippet.substring(0, 249) + "...";
                }
            }
            // Push the article information to the array
            resData["article_list"].push({
                "id": article.id,
                "title": article.data().title,
                "image_url": article.data().image_url,
                "type": article.data().type,
                "created": article.data().created,
                "published": article.data().published,
                "summary": snippet
            });
        }));
        // Send the array of articles
        return resData;
    }).catch(error => {
        return error;
    });
});

/*
* Get all the published articles, as well as a short summary. Summary is pulled from the first section, and the latest version.
*/
// TODO: Order the returned articles by date edited
exports.getAllPublishedArticlesWithSummaries = functions.https.onCall(() => {
    const db = admin.firestore();
    const articlesPromise = db.collection("published_articles").get();

    return articlesPromise.then(async (articles) => {
        let resData = { "article_list": [] };
        articles.forEach((article) => {
            var data = article.data();
            const articleJSONString = data.article_json;
            const articleJSON = JSON.parse(articleJSONString);

            const article_data = articleJSON.article_data;
            const section_data = articleJSON.section_data;

            var snippet = "There is nothing written for this article yet. Be the first to contribute by editing!";

            if (section_data[0]) {
                if (section_data[0].body.length > 0) {
                    snippet = section_data[0].body;
                }
            }

            if (snippet.length > 250) {
                snippet = snippet.substring(0, 249) + "...";
            }

            resData["article_list"].push({
                "id": article_data.article_id,
                "title": article_data.title,
                "image_url": article_data.image_url,
                "type": data.type,
                "created": data.created,
                "published": data.published,
                "summary": snippet
            });
        })

        return resData;
    }).catch(error => {
        return error;
    });
});

/*
* Test GET request for the getAllArticles
*/

// exports.getArticleListGetRequest = functions.https.onRequest(async (req, res) => {
//     // Get db and articles
//     const db = admin.firestore();
//     const articlesPromise = db.collection("articles").get();

//     // Articles promise
//     articlesPromise.then(async (snapshot) => {
//         // Preset return array
//         let resData = { "article_list": [] };
//         // For each article
//         await Promise.all(snapshot.docs.map(async (article) => {
//             // Default the snippet to having no summary data
//             var snippet = "There is nothing written yet for this article. Be the first to contribute!";

//             // See if there is section data 
//             const sectionQuery = await db.collection("articles").doc(article.id).collection("sections").where("type", "==", "text").orderBy("order", "asc").limit(1).get();
//             var section = sectionQuery.docs[0];

//             // If there is section data 
//             if (section !== undefined) {
//                 // Get the most recent version, and retrieve body and save to snippet
//                 const versionQuery = await db.collection("articles").doc(article.id).collection("sections").doc(section.id).collection("versions").orderBy("order", "desc").limit(1).get();
//                 var latestVersion = versionQuery.docs[0];
//                 snippet = latestVersion.data().body;

//                 // If the snippet is over 30 characters, trunacte it
//                 if (snippet.length > 30) {
//                     snippet = snippet.substring(0, 29) + "...";
//                 }
//             }
//             // Push the article information to the array
//             resData["article_list"].push({
//                 "id": article.id,
//                 "title": article.data().title,
//                 "image_url": article.data().image_url,
//                 "summary": snippet
//             });
//         }));
//         // send the array of articles
//         res.send(resData);
//     }).catch(error => {
//         console.log(error);
//         res.send(error);
//     });
// });

/*
*   Creates a blank article with two sections that have one version each
*         using firestore batch commits
*/
exports.createBlankArticle = functions.https.onCall(() => {
    const db = admin.firestore();
    const batch = db.batch();

    let articleData = {
        title: "placeholder title",
        image_url: "http://clipart-library.com/data_images/69339.gif"
    };

    let versionData = {
        body: "first version of section",
        order: "0",
        previous_version_id: ""
    }

    let sectionData1 = {
        order: 0,
        type: "text"
    };

    let sectionData2 = {
        order: 1,
        type: "text"
    };

    //Even with batch writes, this still counts as five write operations... lol
    let newArticleRef = db.collection("articles").doc();
    batch.set(newArticleRef, articleData);

    let newSectionRef1 = newArticleRef.collection("sections").doc();
    batch.set(newSectionRef1, sectionData1);

    let newSectionRef2 = newArticleRef.collection("sections").doc();
    batch.set(newSectionRef2, sectionData2);

    let versionRef1 = newSectionRef1.collection("versions").doc();
    batch.set(versionRef1, versionData);

    let versionRef2 = newSectionRef2.collection("versions").doc();
    batch.set(versionRef2, versionData);

    batch.commit()
        .then(() => {
            return {
                "status": 200,
                "message": "Successfully created blank article"
            }
        })
        .catch(() => {
            return {
                "status": 500,
                "message": "Failed to create blank article"
            }
        })
});

/*
*   Creates a blank article with one section
*   Params:
*       articleTitle = title of article
*       image_url: url of article image
*/
exports.createArticleWithTitleAndImage = functions.https.onCall((data, context) => {
    const db = admin.firestore();
    const batch = db.batch();

    const title = data.title;
    const image = data.image_url;
    const created = admin.firestore.Timestamp.now();
    const type = (data.type ? data.type : "general");
    const published = false;

    //validate inputs
    if (!title.length || title.length < 1) {
        return {
            error: functions.https.HttpsError("400")
        };
    }
    if (!image || image.length < 1) {
        return {
            error: functions.https.HttpsError("400")
        };
    }

    //validate auth
    if (!context.auth) {
        return {
            error: functions.https.HttpsError("401")
        };
    }

    const articleData = {
        title: title,
        image_url: image,
        type: type,
        published: published,
        created: created
    };

    const versionData = {
        body: "",
        order: "0",
        previous_version_id: ""
    }

    const sectionData = {
        order: 0,
        type: "text"
    };

    const newArticleRef = db.collection("articles").doc();
    batch.set(newArticleRef, articleData);

    const newSectionRef = newArticleRef.collection("sections").doc();
    batch.set(newSectionRef, sectionData);

    const versionRef = newSectionRef.collection("versions").doc();
    batch.set(versionRef, versionData);

    return batch.commit()
        .then(() => {
            return {
                status: 200,
                message: "Successfully created article",
                article_id: newArticleRef.id
            }
        })
        .catch(error => {
            return {
                status: 500,
                message: "Failed to create article",
                error: error
            }
        })

});

function _createArticleWithTitleAndImage(title, image, type, body) {
    const db = admin.firestore();
    const batch = db.batch();

    const created = admin.firestore.Timestamp.now();
    const published = false;

    const articleData = {
        title: title,
        image_url: image,
        type: type,
        published: published,
        created: created
    };

    const versionData = {
        body: body,
        order: "0",
        previous_version_id: ""
    }

    const sectionData = {
        order: 0,
        type: "text"
    };

    const newArticleRef = db.collection("articles").doc();
    batch.set(newArticleRef, articleData);

    const newSectionRef = newArticleRef.collection("sections").doc();
    batch.set(newSectionRef, sectionData);

    const versionRef = newSectionRef.collection("versions").doc();
    batch.set(versionRef, versionData);

    return batch.commit()
        .then(() => {
            return {
                status: 200,
                message: "Successfully created article",
                article_id: newArticleRef.id
            }
        })
        .catch(error => {
            return {
                status: 500,
                message: "Failed to create article",
                error: error
            }
        })
}

exports.getPrivateProfileData = functions.https.onCall((data, context) => {
    if (!context.auth) {
        return {
            error: new functions.https.HttpsError("401")
        }; // send not-authed error
    }
    const db = admin.firestore();
    return db.collection("users").doc(context.auth.uid).get().then((doc) => {
        return doc.data();
    })
})

exports.getPublicProfileData = functions.https.onCall((data) => {
    const db = admin.firestore();
    return db.collection("users").doc(data.user_id).get().then((doc) => {
        return doc.data();
    }).catch((error) => {
        return {
            error: error
        }
    })
})

exports.getContributionHistory = functions.https.onCall((data) => {
    const db = admin.firestore();
    const versionsPromise = db.collectionGroup("versions").where("user_id", "==", data.user_id).limit(10).get()

    const articlePromise = versionsPromise.then((querySnapshot) => {
        var promises = [];
        querySnapshot.docs.forEach((doc) => {
            const path = doc.ref.path;
            const articlePathIndex = path.indexOf("/sections");
            const articlePath = path.substring(0, articlePathIndex);
            var article = db.doc(articlePath).get();

            var versionDataPromise = article.then((article) => {
                return {
                    article_id: article.id,
                    article_data: article.data(),
                    version_data: doc.data()
                }
            })
            promises.push(versionDataPromise)
        })
        return Promise.all(promises);
    })

    return articlePromise.then((versions) => {
        return {
            versions: versions
        };
    })
});

// compiles an article and publishes it to the published_articles collection in firestore
exports.publishArticleByID = functions.https.onRequest(async (req, res) => {
    const db = admin.firestore();
    const article_id = req.query.article_id;

    _publishArticleByID(db, article_id).then((doc) => {
        res.send(doc);
    }).catch((err) => {
        res.send(err);
    });
})

// Shared functionality for publishing an article
async function _publishArticleByID(db, article_id) {
    const article = await _getFullArticleByID(db, article_id);
    const type = (article.article_data.type ? article.article_data.type : "general");
    const article_json = JSON.stringify(article);
    const time_now = admin.firestore.Timestamp.now();

    const data = {
        article_json: article_json,
        type: type,
        liked_users: [],
        strikes: [],
        created: time_now,
        updated: time_now
    }

    return db.collection("published_articles").doc(article_id).set(data);
}

exports.toggleLikeByArticleID = functions.https.onCall(async (data, context) => {
    const db = admin.firestore();

    if (!context.auth) {
        return {
            error: 401
        };
    }
    if (!data.article_id) {
        return {
            error: 400
        };
    }

    const user_id = context.auth.uid;
    const article_id = data.article_id;

    const articleRef = db.collection("published_articles").doc(article_id);
    const publishedArticle = await articleRef.get();
    var liked_users = publishedArticle.data().liked_users;

    if (liked_users.includes(user_id)) {
        return articleRef.update({
            liked_users: admin.firestore.FieldValue.arrayRemove(user_id)
        })
    } else {
        return articleRef.update({
            liked_users: admin.firestore.FieldValue.arrayUnion(user_id)
        })
    }

})

// decodes a published article and returns it 
exports.getPublishedArticleByID = functions.https.onCall(async (data) => {
    const db = admin.firestore();
    const article_id = data.article_id;

    return _getPublishedArticleByID(db, article_id).then((data) => {
        return data;
    }).catch((err) => {
        return {
            error: err
        }
    });
})

// Shared functionality for getting a published article
async function _getPublishedArticleByID(db, article_id) {
    const article = await db.collection("published_articles").doc(article_id).get();
    var data = article.data();

    const articleJSONString = data.article_json;
    const articleJSON = JSON.parse(articleJSONString);

    var resData = articleJSON.article_data;

    resData.created = data.created;
    resData.liked_users = data.liked_users;
    resData.strikes = data.strikes;
    resData.type = data.type;
    resData.updated = data.updated;
    resData.sections = articleJSON.section_data;

    return resData;
}

/*
*   At midnight every day, gets top english headlines from news API, 
*   and then takes first three entries (definied in const articlesToCreate)
*   and creates an unpublished article entry in firestore.
*/
exports.insertTopHeadlines = functions.pubsub.schedule('every day 00:00').onRun(function () {
    const articlesToCreate = 3;

    // get API key from firebase config
    const apiKey = functions.config().news_api.key;
    const url = "https://newsapi.org/v2/top-headlines?language=en&apiKey=" + apiKey;

    // make fetch request using axios package
    axios.get(url)
        .then(function (response) {
            let data = response.data;
            if (data.status == "ok") {
                let i;
                for (i = 0; i < articlesToCreate; i++) {
                    _createArticleWithTitleAndImage(data.articles[i].title, data.articles[i].urlToImage, "general", data.articles[i].description);
                }
                //console.log("Successfully added daily articles");
            }
        });
    /*
    * Why does our linter not allow logging to console? It would be very helpful in situations like this.
    .catch (function (error) {
    console.log("Failed to add daily articles");
    console.log(error);
}); */
})

exports.insertTopHeadlinesRequest = functions.https.onRequest((req, res) => {
    const articlesToCreate = 3;

    const apiKey = functions.config().news_api.key;
    const url = "https://newsapi.org/v2/top-headlines?language=en&apiKey=" + apiKey;

    axios.get(url)
        .then(function (response) {

            let data = response.data;
            if (data.status == "ok") {
                let i;
                for (i = 0; i < articlesToCreate; i++) {
                    _createArticleWithTitleAndImage(data.articles[i].title, data.articles[i].urlToImage, "general", data.articles[i].description);
                }
            }
            res.status(200).send({
                message: "ok"
            });
        })
        .catch(function (error) {
            res.send(error);
        });
});
