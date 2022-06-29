const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'admin',
    password: '',
    database: 'employee_history'
})


module.exports = db