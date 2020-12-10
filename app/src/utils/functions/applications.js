async function submitApplication(firebase, type, body) {
    var submitApplication = firebase.functions.httpsCallable("applyForMod");

    const name = (firebase.doGetCurrentName() ? firebase.doGetCurrentName() : "Anonymous User");

    const data = {
        type: type,
        body: body,
        name: name
    }

    try {
        var response = await submitApplication(data);
        return response
    }
    catch{
        return {
            error: "Error submitting application."
        }
    }
}

async function getUserApplications(firebase) {
    var getApplications = firebase.functions.httpsCallable("getUserApplications");

    try {
        var response = await getApplications();
        return response.data
    }
    catch{
        return {
            error: "Error getting applications."
        }
    }
}

async function getPendingApplications(firebase) {
    var getApplications = firebase.functions.httpsCallable("getPendingApplications");

    try {
        var response = await getApplications();
        console.log(response);
        return response.data
    }
    catch{
        return {
            error: "Error getting applications."
        }
    }
}

async function getApplication(firebase, application_id) {
    var getApplication = firebase.functions.httpsCallable("getApplicationById");

    const data = {
        application_id: application_id,
    }

    try {
        var response = await getApplication(data);
        return response.data
    }
    catch{
        return {
            error: "Error getting applications."
        }
    }
}

export {
    submitApplication,
    getUserApplications,
    getPendingApplications,
    getApplication
}