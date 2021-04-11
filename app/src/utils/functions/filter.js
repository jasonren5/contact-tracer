async function addBannedWord(firebase, newWord) {
    let addBannedWord = firebase.functions.httpsCallable("addBannedWord");
    let response = await addBannedWord({
        word: newWord
    });

    return response.data;
}

async function addWhitelistWord(firebase, newWord) {
    let addWhitelistWord = firebase.functions.httpsCallable("addWhitelistWord");

    let response = await addWhitelistWord({
        word: newWord
    });

    return response.data;
}

export { addBannedWord, addWhitelistWord };