// Keep the original `.js` entry point working while sharing the explicit
// CommonJS module used by deployment hosts.
module.exports = require('./index.cjs')
