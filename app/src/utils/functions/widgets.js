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

async function getStocks(firebase) {
    var stocks = firebase.functions.httpsCallable("getLatestStocks");
    var response = await stocks();
    if (response.data) {
        if (response.data.error) {
            return null;
        }
        return response.data;
    }
    return null;
}


export { getWeather, getUsersCount, getStocks };