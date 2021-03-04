async function getWeather(firebase, latitude, longitude) {
    var getData = firebase.functions.httpsCallable("getWeather");


    const resPayload = (latitude === null || longitude === null) ? { retrieved: false } : { retrieved: true, latitude: latitude, longitude: longitude };

    var response = await getData(resPayload);

    // handle user for user_id doesn't exist (null)
    if (response.data) {
        if (response.data.error) {
            console.log(response.data.error);
            return null
        }
        return response.data;
    }
    return null;
}

export { getWeather };