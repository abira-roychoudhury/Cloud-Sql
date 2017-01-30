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


//[START updateKRA]
function updateKRA (kname, data, callback) {
  connection.query(
    'UPDATE `KRA_Description` SET ? WHERE `Name` = ?', [data, kname], (err) => {
      if (err) {
        callback(err);
        return;
      }
      read(id, cb);
    });
  connection.end();
}
//[END updateKRA]








// [START getKRAs]
const SQL_STRING = `SELECT * from KRA_Description;`;

/**
 * Retrieve the latest 10 visit records from the database.
 *
 * @param {function} callback The callback function.
 */
function getKRAs (callback) {
  connection.query(SQL_STRING, (err, results) => {
    if (err) {
      callback(err);
      return;
    }

    callback(null, results.map((visit) => `Name: ${visit.Name}, BRate: ${visit.BRate}, BComment: ${visit.BComment}, CRate: ${visit.CRate}, CComment: ${visit.CComment}`));
  });
}
// [END getKRAs]

app.get('/', (req, res, next) => {
  // Create a KRA record to be stored in the database
  const kraData = {
    BRate: 3,
    BComment:"good",
    CRate: 3,
    CComment:"good"
  };
  kname="abira";
  updateKRA(kname,kraData,err,results) => {
    if(err){
      next(err);
      return;
    }
  }


  /*insertVisit(visit, (err, results) => {
    if (err) {
      next(err);
      return;
    }*/

    // Query the last 10 visits from the database.
    getKRAs((err, visits) => {
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