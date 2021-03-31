/* File to add any words that we feel need to be banned or any words we don't want to be banned. Eventually we could probaly host this is */
var filter = require('leo-profanity');

filter.add(['b00b', 'fucks']);

module.exports = { filter };