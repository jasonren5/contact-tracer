/* File to add any words that we feel need to be banned or any words we don't want to be banned. Eventually we could probaly host this is */
var filter = require('leo-profanity');
import axios from 'axios';

axios.get('https://us-central1-cse437project.cloudfunctions.net/getFilterSettings').then(res => {
    console.log(res.data);
    filter.add(res.data.banned);
    filter.remove(res.data.whitelisted);
});

export default filter;