var admin = require("firebase-admin"); //npm i firebase-admin --save
var firebase = admin;

var serviceAccount = require("./firebaseKey.json");

admin.initializeApp({
  credential: firebase.credential.cert(serviceAccount)
});

module.exports = firebase;
