async function getPublicProfileData(firebase, user_id) {
    var getData = firebase.functions.httpsCallable("getPublicProfileData");
    var response = await getData({ user_id: user_id });

    // handle user for user_id doesn't exist (null)
    if (response.data) {
        if (response.data.error) {
            return null
        }
        return response.data;
    }
    return null;
}

async function getPrivateProfileData(firebase, user_id) {
    var getData = firebase.functions.httpsCallable("getPrivateProfileData");
    var response = await getData();

    // handle user not signed in
    if (response.data) {
        if (response.data.error) {
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
async function getUserContributionHistory(firebase, user_id) {
    var getData = firebase.functions.httpsCallable("getContributionHistory");
    var response = await getData({ user_id: user_id });

    // handle query error
    if (response.data) {
        if (response.data.error) {
            return null;
        }
        return response.data.versions;
    }
    return null;
}

async function updateUserField(firebase, field, value) {
    var updateUser = firebase.functions.httpsCallable("updateUserField");

    const data = {
        field: field,
        value: value
    }

    return updateUser(data)
}

async function getUsersCount(firebase) {
    var userCount = firebase.functions.httpsCallable("getUserCount");
    var response = await userCount();

    if (response.data) {
        if (response.data.error) {
            return null;
        }
        return response.data;
    }
    return null;
}

export { getPublicProfileData, getPrivateProfileData, getUserContributionHistory, updateUserField, getUsersCount };