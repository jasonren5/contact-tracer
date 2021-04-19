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
    catch {
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
    catch {
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
    catch {
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
    catch {
        return {
            error: "Error getting applications."
        }
    }
}

async function approveApplication(firebase, application_id) {
    var approveApplication = firebase.functions.httpsCallable("approveApplicationById");

    const data = {
        application_id: application_id,
    }

    try {
        var response = await approveApplication(data);
        return response.data
    }
    catch {
        return {
            error: "Error approving application."
        }
    }
}

async function rejectApplication(firebase, application_id) {
    var rejectApplication = firebase.functions.httpsCallable("rejectApplicationById");

    const data = {
        application_id: application_id,
    }

    try {
        var response = await rejectApplication(data);
        return response.data
    }
    catch {
        return {
            error: "Error rejecting application."
        }
    }
}

async function verifyAdmin(firebase) {
    var verifyAdmin = firebase.functions.httpsCallable("verifyAdmin");

    try {
        var response = await verifyAdmin();
        return response.data
    }
    catch {
        return {
            admin: false
        }
    }
}

async function verifyMod(firebase) {
    var verifyMod = firebase.functions.httpsCallable("verifyMod");

    try {
        var response = await verifyMod();
        return response.data
    }
    catch {
        return {
            mod: false
        }
    }
}

export {
    submitApplication,
    getUserApplications,
    getPendingApplications,
    getApplication,
    approveApplication,
    rejectApplication,
    verifyAdmin,
    verifyMod
}