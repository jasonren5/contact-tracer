async function getWeather(firebase, latitude, longitude) {
    var getData = firebase.functions.httpsCallable("getWeather");

    if (latitude === null || longitude === null) {
        var response = await getData({ retrieved: false });
    }
    else {
        var response = await getData({ retrieved: true, latitude: latitude, longitude: longitude });
    }

    // handle user for user_id doesn't exist (null)
    if (response.data) {
        if (response.data.error) {
            return null
        }
        return response.data;
    }
    return null;
}

export { getWeather };