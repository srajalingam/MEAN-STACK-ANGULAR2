// Asynchronous
const crypto = require('crypto').randomBytes(256).toString('hex');
//const crypto='test';
module.exports={
    //"uri":"mongodb://localhost:27017/mean-angular-2",
    "uri":"mongodb://rajalingam299:rajalingam299@ds233551.mlab.com:33551/coolapp", // for production
    "secret" : crypto,
    "db" : 'coolapp'
}


