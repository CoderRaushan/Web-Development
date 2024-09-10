const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const path = require('path');
const validateAdmin=require("./adminmiddleware");


const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',  // Ensure this matches your MySQL root password
    database: 'expence_management'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
        return;
    }
    console.log('connected to db');
});

// register route 
app.get("/register",(req,res)=>
{
   res.render("user/register.ejs");
});

//register post route
app.post('/user/register', (req, res) => {
    const { user_id, username, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    const sql = 'INSERT INTO Member_table (user_id, username, email, password, timestamp) VALUES (?, ?, ?, ?, NOW())';
    db.query(sql, [user_id, username, email, hashedPassword], (err, result) => {
        if (err) {
            console.error('Error during registration:', err.message);
            res.status(500).send('Server error');
            return;
        }
        // res.send('User registered successfully');
        console.log("User registered successfully");
        res.render("user/login.ejs");
    });
});

//login form route
app.get("/login",(req,res)=>
{
    res.render("user/login.ejs");
});

// User login
app.post('/user/login', (req, res) => 
    { 
    const { user_id, password } = req.body;
    const sql = 'SELECT * FROM Member_table WHERE user_id = ?';
    db.query(sql, [user_id], (err, results) => 
        {
        if (err) 
        {
            console.error('Error during login:', err.message);
            res.status(500).send('Server error');
            return;
        }
        if (results.length > 0) 
            {
            const user = results[0];
            const passwordIsValid = bcrypt.compareSync(password, user.password);
            if (passwordIsValid) {
                // res.send(`Welcome ${user.username} you are loged in`);
                res.render("user/addExpense.ejs");

            } else {
                res.send('Invalid password');
            }
        } else {
            res.send('User not found');
        }
    });
});

app.get("/newItem",(req,res)=>
{
    res.render("user/admin.ejs");
});
app.post("/validateAdmin", (req, res) => 
{
    const { admin_id } = req.body;
    const query = 'SELECT * FROM admin_table WHERE admin_id = ?';
    // Assuming you're using a MySQL connection (e.g., using the mysql or mysql2 package)
    db.query(query, [admin_id], (err, results) => {
        if (err) {
            console.error("Database query error:", err);
            res.status(500).send("Internal Server Error");
            return;
        }
        if (results.length > 0) {
            console.log("Admin verified successfully!");
            res.render("admin/additem.ejs"); // Note: No leading slash in the view name
        } else {
            console.log("Admin verification error");
            res.status(401).send("your are not admin, you can't add new items");
        }
    });
});

app.post('/admin/newItem', (req, res) => 
{
    const { item_id, item_name } = req.body;
    const sql = 'INSERT INTO item_table (item_id, item_name, timestamp) VALUES (?, ?, NOW())';
    db.query(sql, [item_id, item_name], (err, result) => 
    {
        if (err) 
        {
            console.error('Error adding item:', err.message);
            res.status(500).send('Server error');
            return;
        }
        console.log('Item added successfully');
        res.render("user/addExpense.ejs");
    });
});

app.get("/show",(req, res) => 
{
    const sql = 'SELECT * FROM admin_table';
    db.query(sql, (err, results) => 
    {
        if (err) 
        {
            console.error('Error retrieving data:', err.message);
            res.status(500).send('Server error');
            return;
        }
        res.render("index.ejs", { admins: results });
    });
});

// User adds expense
app.post('/user/newItem', (req, res) => {
    const { item_name, user_id, username, expences } = req.body;
    
    console.log('Received data:', { item_name, user_id, username, expences });

    // Retrieve item_id from item_table using item_name
    const sql = 'SELECT item_id FROM item_table WHERE item_name = ?';
    db.query(sql, [item_name], (err, results) => {
        if (err) {
            console.error('Error retrieving item_id:', err.message);
            res.status(500).send('Server error');
            return;
        }

        console.log('Query results:', results);

        if (results.length > 0) {
            const item_id = results[0].item_id;

            // Insert expense into expences_table
            const insertExpenseSql = 'INSERT INTO expences_table (item_id, item_name, user_id, username, expences, timestamp) VALUES (?, ?, ?, ?, ?, NOW())';
            db.query(insertExpenseSql, [item_id, item_name, user_id, username, expences], (err, result) => {
                if (err) {
                    console.error('Error adding expense:', err.message);
                    res.status(500).send('Server error');
                    return;
                }
                res.send('Expense added successfully');
            });
        } else {
            res.status(404).send('Item not found');
        }
    });
});

// show all user items for admin
app.post('/adminAllItem', (req, res) => {
    const query = 'SELECT * FROM expences_table'; // Query to select all data
    db.query(query, (err, results) => { // No need for [admin_id] if fetching all items
        if (err) {
            console.error("Database query error:", err);
            res.status(500).send("Internal Server Error");
            return;
        }
        if (results.length > 0) {
            console.log("Admin verified successfully!");
            // Pass results to the EJS file for rendering
            res.render("user/allitems.ejs", { items: results });
        } else {
            console.log("No expenses found");
            res.status(404).send("No expenses found");
        }
    });
});

// Admin edits item expense
// app.post('/edit-expense', (req, res) => {
//     const { item_id, item_expences } = req.body;

//     const sql = 'UPDATE item_table SET item_expences = ? WHERE item_id = ?';
//     db.query(sql, [item_expences, item_id], (err, result) => {
//         if (err) throw err;
//         res.redirect('/admin/edit-expense');
//     });
// });



// Admin edits item expense
app.put('/admin/edit-expense', (req, res) => {
    const { item_id, item_expences } = req.body;

    const sql = 'UPDATE item_table SET item_expences = ? WHERE item_id = ?';
    db.query(sql, [item_expences, item_id], (err, result) => {
        if (err) {
            console.error('Error editing expense:', err.message);
            res.status(500).send('Server error');
            return;
        }
        res.send('Item expense updated successfully');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
