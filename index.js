const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

const { auth } = require('googleapis/build/src/apis/abusiveexperiencereport');
const { Console } = require('console');
const { resolve } = require('path');
const { rejects } = require('assert');
const { gmail } = require('googleapis/build/src/apis/gmail');
const { send } = require('process');
const { Buffer } = require('buffer');

// scope..
const SCOPES = ['https://mail.google.com/'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
//credentials...
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Gmail API.
  authorize(JSON.parse(content), sendMail); //authorize...
});

/**
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
//auth config...
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  //write token.json...
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);   //generate new token...
    oAuth2Client.setCredentials(JSON.parse(token));        //set credentials...
    callback(oAuth2Client);
  });
}

/**
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
// generate... only for first time...
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);   //set credentials...
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
/*
function listLabels(auth) {
  const gmail = google.gmail({version: 'v1', auth});
  gmail.users.labels.list({
    userId: 'me',
    
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const labels = res.data.labels;
    if (labels.length) {
      console.log('Labels:');
      labels.forEach((label) => {
        console.log(`- ${label.name}`);
      });
    } else {
      console.log('No labels found.');
    }
  });
}
*/

//sendMail contain a kay and its values..
//simple implementation of base64 encoding.. 
function sendMail(auth, from, to, subject, content) {
   var encodedEmail = new Buffer(
   'from:'+'tteessttsite95@gmail.com' + '\r\n' +
   'to:'+'majgaonkarpranav14@gmail.com' + '\r\n' +
   'subject:'+'Testing task' + '\r\n\r\n' +
    'This is the task testing message.'+ '\r\n\r\n' 
  ).toString('base64').replace(/\+/g, '-').replace(/\//g, '_'); 

 
  var gmail = google.gmail('v1');
  //message send method
  var request = gmail.users.messages.send({
    auth: auth,
    //user's email address..
    userId: 'tteessttsite95@gmail.com',
    resource: {
      raw: encodedEmail
    
    }    
  }, function (err, result) {
    if(result){
      console.log('Successfully sent..',result);
    }
    else{
      console.log('get an Error...',err);
    }
  });
 };
 



