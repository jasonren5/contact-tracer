/* File to add any words that we feel need to be banned or any words we don't want to be banned. Eventually we could probaly host this is */

// Currently this calls everytime a page is rendered. This is due to it being a context. Not sure if this is needed, or if these calls are redundent. Something to think about
// TODO: Make this more efficent
// TODO: Add functionality to add/remove words from either list, maybe even display banned words

var filter = require('leo-profanity');
import axios from 'axios';

// var bannedList = [];

// var whitelistedList = [];

const updateWords = () => {
    axios.get('https://us-central1-cse437project.cloudfunctions.net/getFilterSettings').then(res => {
        // bannedList = res.data.banned;
        // whitelistedList = res.data.banned;
        filter.add(res.data.banned);
        filter.remove(res.data.whitelisted);
    });
}
updateWords();

export default filter;

export { updateWords };