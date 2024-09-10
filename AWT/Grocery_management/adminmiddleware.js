const db = require("./db");

function validateAdmin(req, res, next) {
    const admin_id = req.query.admin_id || req.body.admin_id;
    console.log("Admin ID for validation:", admin_id);

    const query = 'SELECT * FROM admin_table WHERE admin_id = ?';
    db.query(query, [admin_id], (err, results) => {
        if (err) {
            console.error("Database query error:", err);
            res.status(500).send("Internal Server Error");
            return;
        }
        if (results.length > 0) {
            next(); // Admin verified, proceed to the next middleware or route handler
        } else {
            res.status(401).send("You are not an admin, you can't access this resource");
        }
    });
}

module.exports = validateAdmin;