const mysql = require('mysql2');

const db = mysql.createConnection({
  multipleStatements: true,
  host: 'localhost',
  // Your MySQL username,
  user: 'root',
  // Your MySQL password
  password: 'password12345',
  database: 'employeeTracker'
});

module.exports = db;
