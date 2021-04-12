// TODO: Handle the updating of the words in this function
async function addBannedWord(firebase, filter, newWord) {
    let addBannedWord = firebase.functions.httpsCallable("addBannedWord");
    let response = await addBannedWord({
        word: newWord
    });

    const newFilter = response.data;

    filter.filter.add(newFilter.banned);
    filter.filter.remove(newFilter.whitelisted);

    return filter.filter.list();
}

async function addWhitelistWord(firebase, filter, newWord) {
    let addWhitelistWord = firebase.functions.httpsCallable("addWhitelistWord");

    let response = await addWhitelistWord({
        word: newWord
    });

    const newFilter = response.data;

    filter.filter.add(newFilter.banned);
    filter.filter.remove(newFilter.whitelisted);

    return filter.filter.list();
}

export { addBannedWord, addWhitelistWord };