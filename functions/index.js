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

// Get a full article by id
exports.getFullArticleByID = functions.https.onCall((data) => {
    const db = admin.firestore();
    let article_id = data.article_id;

    var promises = [];
    promises.push(db.collection("articles").doc(article_id).get());
    promises.push(db.collection("articles").doc(article_id).collection("sections").orderBy('order').get());
    promises.push(db.collection("articles").doc(article_id).collection("sources").orderBy('created').get());
    return Promise.all(promises).then(async (values) => {
        var articleData = values[0].data();
        articleData["article_id"] = values[0].id;

        let sectionData = values[1];

        var sourcesData = [];
        var sourceIndexCounter = 1;
        values[2].forEach(source => {
            var sourceData = source.data();
            if (!sourceData.deleted) {
                sourceData["source_id"] = source.id;
                sourceData["order"] = sourceIndexCounter;
                sourcesData.push(sourceData);
                sourceIndexCounter += 1;
            }
        });

        let sections = await Promise.all(sectionData.docs.map(async (doc) => {
            const versions = await db.collection("articles").doc(article_id).collection("sections").doc(doc.id).collection("versions").orderBy('order', 'desc').get();
            var section = doc.data();
            let latestVersion = versions.docs[0];
            let latestVersionData = versions.docs[0].data();

            section["section_id"] = doc.id;
            section["current_version"] = latestVersion.id;
            section["body"] = latestVersionData.body;

            var localSources = [];

            sourcesData.forEach(source => {
                if (source.section === doc.id) {
                    localSources.push(source);
                }
            });
            section["sources"] = localSources;

            return section;
        }))

        let data = {
            article_data: articleData,
            section_data: sections,
            sources_data: sourcesData,
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
    promises.push(db.collection("articles").doc(article_id).collection("sources").orderBy('created').get());
    return Promise.all(promises).then(async (values) => {
        var articleData = values[0].data();
        articleData["article_id"] = values[0].id;

        let sectionData = values[1];

        var sourcesData = [];
        var sourceIndexCounter = 1;
        values[2].forEach(source => {
            var sourceData = source.data();
            if (!sourceData.deleted) {
                sourceData["source_id"] = source.id;
                sourceData["order"] = sourceIndexCounter;
                sourcesData.push(sourceData);
                sourceIndexCounter += 1;
            }
        });

        let sections = await Promise.all(sectionData.docs.map(async (doc) => {
            const versions = await db.collection("articles").doc(article_id).collection("sections").doc(doc.id).collection("versions").orderBy('order', 'desc').get();
            var section = doc.data();
            let latestVersion = versions.docs[0];
            let latestVersionData = versions.docs[0].data();

            section["section_id"] = doc.id;
            section["current_version"] = latestVersion.id;
            section["body"] = latestVersionData.body;

            var localSources = [];
            sourcesData.forEach(source => {
                if (source.section === doc.id) {
                    localSources.push(source);
                }
            });
            section["sources"] = localSources;

            return section;
        }))

        let data = {
            article_data: articleData,
            section_data: sections,
            sources_data: sourcesData,
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
    const merging = data.merging;

    const versionsPromise = db.collection("articles").doc(article_id).collection("sections").doc(section_id).collection("versions").orderBy('order', 'desc').get();

    return versionsPromise.then((versions) => {
        let latestVersion = versions.docs[0];
        let latestVersionData = versions.docs[0].data();

        if (latestVersion.id !== previous_version_id && previous_version_id && !merging) {
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

    const user_id = (context.auth ? context.auth.uid : null);

    // if there is a signed in user, increment thier contribution count
    if (user_id) {
        incrementContributions(user_id);
    }

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
    const articlesPromise = db.collection("articles").orderBy("created", "desc").get();

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
exports.getAllArticlesWithSummaries = functions.https.onCall(async () => {
    const db = admin.firestore();
    const snapshot = await db.collection("articles").where("published", "==", false).get();

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
            snippet = (latestVersion.data().body ? latestVersion.data().body : "This is an empty article. Edit to add content.");

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
    return resData;
});

/*
* Get all the published articles, as well as a short summary. Summary is pulled from the first section, and the latest version.
*/

exports.getAllPublishedArticlesWithSummaries = functions.https.onCall(() => {
    const db = admin.firestore();
    const articlesPromise = db.collection("published_articles").orderBy('updated', 'desc').get();

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
    const source = data.source;
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

    const sourceData = {
        url: source,
        user: "generated",
        section: "title",
        deleted: false,
    };

    const newSourceRef = newArticleRef.collection("sources").doc();
    batch.set(newSourceRef, sourceData);

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
function _createArticleWithTitleAndImage(title, image, type, body, source) {
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

    const sourceData = {
        url: source,
        user: "generated",
        section: newArticleRef.id,
        deleted: false,
        created: created,
    };

    const newSourceRef = newArticleRef.collection("sources").doc();
    batch.set(newSourceRef, sourceData);

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
    const url = "https://newsapi.org/v2/top-headlines?language=en&sources=google-news&apiKey=" + apiKey;

    // make fetch request using axios package
    return axios.get(url)
        .then(function (response) {
            let data = response.data;
            if (data.status == "ok") {
                let i;
                let numCreated = 0;
                for (i = 0; i < articlesToCreate; i++) {
                    if (data.articles[i] != null) {
                        _createArticleWithTitleAndImage(data.articles[i].title, data.articles[i].urlToImage, "general", data.articles[i].description, data.articles[i].url);
                        numCreated++;
                    }
                }
                return {
                    message: "Successfully created " + numCreated + " articles"
                }
            } else {
                return {
                    message: "Failed to add articles -- NewsAPI request failed",
                    data: data
                }
            }
        });
})

/*
*   Failsafe in case the scheduled function fails and we need to 
*/
exports.insertTopHeadlinesRequest = functions.https.onRequest((req, res) => {
    const articlesToCreate = 3;

    const apiKey = functions.config().news_api.key;
    const url = "https://newsapi.org/v2/top-headlines?language=en&sources=google-news&apiKey=" + apiKey;

    axios.get(url)
        .then(function (response) {
            let data = response.data;
            if (data.status == "ok") {
                let i;
                for (i = 0; i < articlesToCreate; i++) {
                    if (data.articles[i] != null) {
                        _createArticleWithTitleAndImage(data.articles[i].title, data.articles[i].urlToImage, "general", data.articles[i].description, data.articles[i].url);
                    }
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

exports.publishArticles = functions.pubsub.schedule('every day 23:00').onRun(async function () {
    const db = admin.firestore();
    var articles = await db.collection("articles").where('published', "==", false).get();

    var promises = [];
    articles.forEach((article) => {
        const publishPromise = _publishArticleByID(db, article.id);
        const updatePromise = db.collection('articles').doc(article.id).update({ published: true });
        promises.push(publishPromise);
        promises.push(updatePromise);
    })

    return Promise.all(promises).then(() => {
        return null;
    })
});

/*
*   Basic functionality for editing a title of an article in the articles collection by article ID
*
*/
exports.editArticleTitle = functions.https.onCall(async (data) => {
    const db = admin.firestore();
    let article_id = data.article_id;
    let newTitle = data.title;

    if (!article_id) {
        return {
            error: 400,
            message: "article_id cannot be null"
        };
    }

    if (!newTitle) {
        return {
            error: 400,
            message: "new title cannot be null"
        }
    }

    const articleRef = db.collection("articles").doc(article_id);
    const doc = await articleRef.get();

    // check if doc exists before updating
    if (doc.exists) {
        await articleRef.update({
            title: newTitle
        });

        return {
            status: 200,
            message: "Successfully updated title of document",
            new_title: newTitle
        }
    } else {
        return {
            error: 500,
            message: "cannot find existing document"
        }
    }
});

exports.editArticleHeaderImage = functions.https.onCall(async (data) => {
    const db = admin.firestore();
    let article_id = data.article_id;
    let newImage = data.image_url;

    if (!article_id) {
        return {
            error: 400,
            message: "article_id cannot be null"
        };
    }

    if (!newImage) {
        return {
            error: 400,
            message: "new image cannot be null"
        }
    }

    const articleRef = db.collection("articles").doc(article_id);
    const doc = await articleRef.get();

    // check if doc exists before updating
    if (doc.exists) {
        await articleRef.update({
            image_url: newImage
        });

        return {
            status: 200,
            message: "Successfully updated image of document",
            new_image: newImage
        }
    } else {
        return {
            error: 500,
            message: "cannot find existing document"
        }
    }
});

// Function to create user and a corresponding database entry
exports.createUser = functions.https.onCall((data) => {
    const userPromise = admin.auth().createUser({
        email: data.email,
        emailVerified: false,
        password: data.password,
        displayName: data.displayName,
        disabled: false
    });
    const documentPromise = userPromise.then((user) => {
        const userData = {
            displayName: user.displayName,
            name: data.name,
            username: user.email,
            number_of_contributions: 0,
            expertises: [],
            liked_articles: [],
            viewed_articles: [],
            admin: false
        };
        return admin.firestore().collection('users').doc(user.uid).set(userData).then(() => { return user; }).catch(async (err) => {
            await admin.auth().deleteUser(user.uid);
            return {
                error: err
            }
        });
    }).catch((err) => {
        return {
            error: err
        }
    });

    return documentPromise;
});

exports.updateUserField = functions.https.onCall((data, context) => {
    if (!context.auth) {
        return null;
    }

    var userData = {};
    userData[data.field] = data.value

    return admin.firestore().collection('users').doc(context.auth.uid).update(userData).catch((err) => {
        return {
            error: err
        }
    })
});

exports.applyForMod = functions.https.onCall((data, context) => {
    const db = admin.firestore();

    if (!context.auth) {
        // not authorized, return error
        return {
            error: 401
        };
    }

    const body = (data.body ? data.body : "");
    const status = "pending";
    const type = (data.type ? data.type : "general");
    const user_id = context.auth.uid;
    const submitted = admin.firestore.Timestamp.now();
    const review_body = "";
    const name = (data.name ? data.name : "Anonymous User");

    const applicationData = {
        user_id: user_id,
        body: body,
        type: type,
        status: status,
        submitted: submitted,
        review_body: review_body,
        name: name
    }

    var applicationPromise = db.collection("mod_applications").add(applicationData);

    return applicationPromise;
})

exports.getUserApplications = functions.https.onCall(async (data, context) => {
    const db = admin.firestore();

    if (!context.auth) {
        // not authorized, return error
        return {
            error: 401
        };
    }

    // var applications = await db.collection("mod_applications").where("status", "==", "pending")
    var applications = await db.collection("mod_applications").where("user_id", "==", context.auth.uid).get()

    var resData = [];

    applications.forEach((application) => {
        var appData = application.data();
        appData["application_id"] = application.id;
        resData.push(appData);
    })

    return resData
})

exports.getPendingApplications = functions.https.onCall(async (data, context) => {
    const db = admin.firestore();

    if (!context.auth) {
        // not authorized, return error
        return {
            error: 401
        };
    }

    var applications = await db.collection("mod_applications").where("status", "==", "pending").get();

    var resData = [];

    applications.forEach((application) => {
        var appData = application.data();
        appData["application_id"] = application.id;
        resData.push(appData);
    })

    return resData
})

exports.getApplicationById = functions.https.onCall(async (data) => {
    const db = admin.firestore();

    const application_id = data.application_id;

    if (application_id === null) {
        // poorly formatted request, return error
        return {
            error: 400
        };
    }

    var application = await db.collection("mod_applications").doc(application_id).get();

    var appData = application.data();
    appData["application_id"] = application.id;

    return appData;
})

exports.approveApplicationById = functions.https.onCall(async (data, context) => {
    const db = admin.firestore();

    if (!context.auth) {
        // not authorized, return error
        return {
            error: 401
        };
    }

    const user_id = context.auth.uid;

    const adminData = await _verifyAdmin(db, user_id)

    if (!adminData.admin) {
        // not admin, return error
        return {
            error: 401
        };
    }

    const application_id = data.application_id;

    if (application_id === null) {
        // poorly formatted request, return error
        return {
            error: 400
        };
    }

    const application = await db.collection("mod_applications").doc(application_id).get();

    const type = application.data().type;
    const app_user_id = application.data().user_id;

    var promises = []

    const applicationPromise = db.collection("mod_applications").doc(application_id).update({ status: "approved" });
    promises.push(applicationPromise);

    const userPromise = db.collection("users").doc(app_user_id).update({ expertises: admin.firestore.FieldValue.arrayUnion(type) });
    promises.push(userPromise);

    return Promise.all(promises);
})

exports.rejectApplicationById = functions.https.onCall(async (data, context) => {
    const db = admin.firestore();

    if (!context.auth) {
        // not authorized, return error
        return {
            error: 401
        };
    }

    const user_id = context.auth.uid;

    const adminData = await _verifyAdmin(db, user_id)

    if (!adminData.admin) {
        // not admin, return error
        return {
            error: 401
        };
    }

    const application_id = data.application_id;

    if (application_id === null) {
        // poorly formatted request, return error
        return {
            error: 400
        };
    }

    return db.collection("mod_applications").doc(application_id).update({ status: "rejected" });
})

exports.verifyAdmin = functions.https.onCall(async (data, context) => {
    const db = admin.firestore();

    if (!context.auth) {
        // not authorized, return error
        return {
            error: 401
        };
    }

    const user_id = context.auth.uid;

    return _verifyAdmin(db, user_id);
})

async function _verifyAdmin(db, user_id) {

    const response = await db.collection("users").doc(user_id).get();

    const userData = response.data()

    return {
        admin: userData.admin
    }
}

exports.addSourceToArticle = functions.https.onCall((data, context) => {
    const db = admin.firestore();
    const article_id = data.article_id;
    const section_id = data.section_id;
    const source_url = data.source_url;
    const user_id = (context.auth ? context.auth.uid : null);
    const created = admin.firestore.Timestamp.now();

    const sourceData = {
        url: source_url,
        user: user_id,
        section: section_id,
        deleted: false,
        created: created,
    };

    if (!article_id) {
        return {
            error: 400,
            message: "article_id cannot be null"
        };
    }
    const articleRef = db.collection("articles").doc(article_id);

    var sourcePromise = articleRef.collection("sources").add(sourceData);

    return sourcePromise.then((doc) => {
        sourceData["id"] = doc.id;

        return sourceData;
    });

})

exports.getAllSources = functions.https.onCall((data) => {
    const db = admin.firestore();
    const article_id = data.article_id;

    return _getAllSources(db, article_id).then((data) => {
        return data;
    }).catch((err) => {
        return {
            error: err
        }
    });
})

async function _getAllSources(db, article_id) {
    const snapshot = await db.collection("articles").doc(article_id).collection("sources").orderBy('created').get();

    if (snapshot.empty) {
        return "No source found";
    }

    var resData = [];
    var indexCounter = 1;
    snapshot.forEach((source) => {
        var sourceData = source.data();
        if (!sourceData.deleted) {
            sourceData["source_id"] = source.id;
            sourceData["order"] = indexCounter;
            resData.push(sourceData);
            indexCounter += 1;
        }
    });
    return resData;
}

exports.deleteSource = functions.https.onCall(async (data) => {
    const db = admin.firestore();
    let article_id = data.article_id;
    let source_id = data.source_id;

    return _deleteSource(db, article_id, source_id).then((data) => {
        return data;
    }).catch((err) => {
        return {
            error: err
        }
    });
})

async function _deleteSource(db, article_id, source_id) {
    if (!article_id) {
        return {
            error: 400,
            message: "article_id cannot be null"
        };
    }

    if (!source_id) {
        return {
            error: 400,
            message: "source_id cannot be null"
        }
    }

    const sourceRef = db.collection("articles").doc(article_id).collection("sources").doc(source_id);
    const doc = await sourceRef.get();

    // check if doc exists before updating
    if (doc.exists) {
        await sourceRef.update({
            deleted: true
        });

        return {
            status: 200,
            message: "Successfully deleted source",
        }
    } else {
        return {
            error: 500,
            message: "cannot delete source"
        }
    }
}

exports.editSource = functions.https.onCall(async (data) => {
    const db = admin.firestore();
    let article_id = data.article_id;
    let source_id = data.source_id;
    let new_url = data.new_url;

    return _editSource(db, article_id, source_id, new_url).then((data) => {
        return data;
    }).catch((err) => {
        return {
            error: err
        }
    });
})

async function _editSource(db, article_id, source_id, new_url) {
    if (!article_id) {
        return {
            error: 400,
            message: "article_id cannot be null"
        };
    }

    if (!source_id) {
        return {
            error: 400,
            message: "source_id cannot be null"
        }
    }

    const sourceRef = db.collection("articles").doc(article_id).collection("sources").doc(source_id);
    const doc = await sourceRef.get();

    // check if doc exists before updating
    if (doc.exists) {
        await sourceRef.update({
            url: new_url,
        });

        return {
            status: 200,
            message: "Successfully deleted source",
        }
    } else {
        return {
            error: 500,
            message: "cannot delete source"
        }
    }
}

exports.getSectionByID = functions.https.onCall(async (data) => {
    const db = admin.firestore()

    const article_id = data.article_id;
    const section_id = data.section_id;

    var versions = await db.collection("articles").doc(article_id).collection("sections").doc(section_id).collection("versions").orderBy("order").get();

    var prevBody = "";

    var promises = versions.docs.map(async (version) => {
        var versionData = version.data();
        versionData.version_id = version.id;

        var user_id = versionData.user_id;

        versionData.prevBody = prevBody;
        prevBody = versionData.body;

        try {
            var user = await db.collection("users").doc(user_id).get();

            var userData = user.data();
            userData.user_id = user.id;

            versionData.user = userData;
        } catch (error) {
            var userErrorData = {
                error: "No user found."
            }
            versionData.user = userErrorData;
        }

        return versionData;
    })

    return Promise.all(promises)
})
