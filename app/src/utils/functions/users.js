const firebase = require("firebase");
require("firebase/functions");

var functions = firebase.functions();

async function getPublicProfileData(user_id) {
    var getData = functions.httpsCallable("getPublicProfileData");
    var response = await getData({user_id: user_id});

    // handle user for user_id doesn't exist (null)
    if(response.data){
        if(response.data.error){
            return null
        }
        return response.data;
    }
    return null;
}

async function getPrivateProfileData(user_id) {
    var getData = functions.httpsCallable("getPrivateProfileData");
    var response = await getData();

    // handle user not signed in
    if(response.data){
        if(response.data.error){
            return null
        }
        return response.data;
    }
    return null;
}

/*
* get a user's most recent contributions
* params
*   user_id: The id of the user who's contributions to get
* return
*   versions: an array of the most recent contributed versions (null if there was an error)
*   version: {
*       article_id: the id of the version's article_id
*       version_data: the version's data
*   }
*/
async function getUserContributionHistory(user_id) {
    var getData = functions.httpsCallable("getContributionHistory");
    var response = await getData({user_id: user_id});

    // handle query error
    if(response.data){
        if(response.data.error){
            return null;
        }
        return response.data.versions;
    }
    return null;
}

export {getPublicProfileData, getPrivateProfileData, getUserContributionHistory};