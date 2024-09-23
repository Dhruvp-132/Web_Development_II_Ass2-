const express = require("express");
const cors = require("cors");  // Import CORS middleware

const connection = require('./crowdfunding_db');
const app = express();

// Use CORS middleware for all routes
app.use(cors());

// Retrieve all active fundraisers including category
app.get('/fundraisers', (req, res) => {
    const { organizer, city, category } = req.query;
    
    // Base SQL query
    let sql = `SELECT fundraiser.*, category.NAME as CATEGORY 
               FROM fundraiser 
               JOIN CATEGORY ON fundraiser.CATEGORY_ID = category.CATEGORY_ID 
               WHERE fundraiser.ACTIVE = 1`;
    
    // Add filtering conditions
    const conditions = [];
    if (organizer) {
        conditions.push(`fundraiser.ORGANIZER LIKE '%${organizer}%'`);
    }
    if (city) {
        conditions.push(`fundraiser.CITY LIKE '%${city}%'`);
    }
    if (category) {
        conditions.push(`category.NAME LIKE '%${category}%'`);
    }
    
    // If any conditions exist, append them to the SQL query
    if (conditions.length > 0) {
        sql += ' AND ' + conditions.join(' AND ');
    }

    // Execute the query
    connection.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// Retrieve all categories
app.get('/categories', (req, res) => {
    connection.query('SELECT * FROM CATEGORY', (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// Retrieve fundraiser details by ID
app.get('/fundraiser/:id', (req, res) => {
    const sql = `SELECT fundraiser.*, category.NAME as CATEGORY 
                 FROM fundraiser 
                 JOIN CATEGORY ON fundraiser.CATEGORY_ID = category.CATEGORY_ID 
                 WHERE fundraiser.ACTIVE = 1 AND fundraiser.FUNDRAISER_ID = ?`;  // Filter by ID
    connection.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
