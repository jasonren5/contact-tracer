async function submitApplication(firebase, type, body) {
    var submitApplication = firebase.functions.httpsCallable("applyForMod");

    const data = {
        type: type,
        body: body
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

export {
    submitApplication
}