import User from "../../classes/User";

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

export {getPublicProfileData, getPrivateProfileData};