const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',     // Your MySQL host (usually 'localhost')
    user: 'root',          // Your MySQL username
    password: '123456',    // Your MySQL password
    database: 'expence_management'  // Your MySQL database name
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
        return;
    }
    console.log('MySQL connected...');
});

module.exports = db;
