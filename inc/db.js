const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'us-cdbr-iron-east-05.cleardb.net',
    user: 'b41627b4d1afdf',
    database: 'heroku_2ebc4bb05bbf1d3',
    password: '43960393',
    multipleStatements: true
  });

module.exports = connection;