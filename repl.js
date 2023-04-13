//Use the Node.js REPL to list the methods provided by the Node.js core crypto module. Use one of these methods to generate a random ID.
const crypto =  require("crypto")
const id = crypto.randomInt(0, 100)
console.log(id);