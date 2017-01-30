// [START app]
'use strict';

// [START setup]
const express = require('express');
const mysql = require('mysql');
const crypto = require('crypto');

const app = express();
app.enable('trust proxy');
// [END setup]

// [START connect]
var config = {
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
};

if (process.env.INSTANCE_CONNECTION_NAME) {
  config.socketPath = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
}

// Connect to the database
const connection = mysql.createConnection(config);
// [END connect]

// [START insertVisit]
/**
 * Insert a visit record into the database.
 *
 * @param {object} visit The visit record to insert.
 * @param {function} callback The callback function.
 
function insertVisit (visit, callback) {
  connection.query('INSERT INTO `visits` SET ?', visit, (err) => {
    if (err) {
      callback(err);
      return;
    }
    callback();
  });
}*/
// [END insertVisit]

// [START getVisits]
const SQL_STRING = `SELECT * from KRA_Description;`;

/**
 * Retrieve the latest 10 visit records from the database.
 *
 * @param {function} callback The callback function.
 */
function getVisits (callback) {
  connection.query(SQL_STRING, (err, results) => {
    if (err) {
      callback(err);
      return;
    }

    callback(null, results.map((visit) => `Name: ${visit.Name}, BRate: ${visit.BRate}, BComment: ${visit.BComment}, CRate: ${visit.CRate}, CComment: ${visit.CComment}`));
  });
}
// [END getVisits]

app.get('/', (req, res, next) => {
  // Create a visit record to be stored in the database
  /*const visit = {
    timestamp: new Date(),
    // Store a hash of the visitor's ip address
    userIp: crypto.createHash('sha256').update(req.ip).digest('hex').substr(0, 7)
  };*/

  /*insertVisit(visit, (err, results) => {
    if (err) {
      next(err);
      return;
    }*/

    // Query the last 10 visits from the database.
    getVisits((err, visits) => {
      if (err) {
        next(err);
        return;
      }

      res
        .status(200)
        .set('Content-Type', 'text/plain')
        .send(`KRA_Description Table:\n${visits.join('\n')}`);
    });
  });
//});

// [START listen]
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END listen]
// [END app]

module.exports = app;