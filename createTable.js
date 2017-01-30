'use strict';

// [START setup]
const mysql = require('mysql');
const prompt = require('prompt');
// [END setup]

// [START createTable]
const SQL_STRING = `CREATE TABLE visits (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  timestamp DATETIME NULL,
  userIp VARCHAR(46) NULL,
  PRIMARY KEY (id)
);`;

/**
 * Create the "visits" table.
 *
 * @param {object} connection A mysql connection object.
 * @param {function} callback The callback function.
 */
function createTable (connection, callback) {
  connection.query(SQL_STRING, callback);
}
// [END createTable]

// [START getConnection]
const FIELDS = ['user', 'password', 'database'];

/**
 * Ask the user for connection configuration and create a new connection.
 *
 * @param {function} callback The callback function.
 */
function getConnection (callback) {
  prompt.start();
  prompt.get(FIELDS, (err, config) => {
    if (err) {
      callback(err);
      return;
    }

    const user = encodeURIComponent(config.user);
    const password = encodeURIComponent(config.password);
    const database = encodeURIComponent(config.database);

    const uri = `mysql://${user}:${password}@127.0.0.1:3306/${database}`;
    callback(null, mysql.createConnection(uri));
  });
}
// [END getConnection]

// [START main]
getConnection((err, connection) => {
  if (err) {
    console.error(err);
    return;
  }
  createTable(connection, (err, result) => {
    connection.end();
    if (err) {
      console.error(err);
      return;
    }
    console.log(result);
  });
});
// [END main]
// [END createTables]