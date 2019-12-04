const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'user',
    database: 'controlefuncionario',
    password: '#Operadoryale10',
    multipleStatements: true
  });

module.exports = connection;