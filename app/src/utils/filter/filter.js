/* File to add any words that we feel need to be banned or any words we don't want to be banned. Eventually we could probaly host this is */

// Currently this calls everytime a page is rendered. This is due to it being a context. Not sure if this is needed, or if these calls are redundent. Something to think about
// TODO: Make this more efficent
// TODO: Add functionality to add/remove words from either list, maybe even display banned words
import axios from 'axios';

class Filter {
    constructor() {
        this.filter = require('leo-profanity');
        this.bannedList = [];
        this.whiteList = [];
        this.updateWords();
    }

    updateWords = () => {
        axios.get('https://us-central1-cse437project.cloudfunctions.net/getFilterSettings').then(res => {
            // bannedList = res.data.banned;
            // whitelistedList = res.data.banned;
            this.filter.add(res.data.banned);
            this.filter.remove(res.data.whitelisted);
            this.filter.add("12312mike");
            this.filter.addWord("test2");
            return ("Success");
        });
    }
}

export default Filter;