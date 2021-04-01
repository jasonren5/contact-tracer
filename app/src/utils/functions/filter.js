async function addBannedWord(firebase, data) {
    let addBannedWord = firebase.functions.httpsCallable("addBannedWord");

    let response = await addBannedWord(data);

    return response.data;
}

async function addWhitelistWord(firebase, data) {
    let addWhitelistWord = firebase.functions.httpsCallable("addWhitelistWord");

    let response = await addWhitelistWord(data);

    return response.data;
}

// async function removeBannedWord(firebase, data) {
//     let removeBannedWord = firebase.functions.httpsCallable("removeBannedWord");

//     let response = await removeBannedWord(data);

//     return response.data;
// }

// async function removeWhitelistWord(firebase, data) {
//     let removeWhitelistWord = firebase.functions.httpsCallable("removeWhitelistWord");

//     let response = await removeWhitelistWord(data);

//     return response.data;
// }

