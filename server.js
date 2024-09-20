const express = require("express");
const connection = require('./crowdfunding_db');
const app = express();

// Retrieve all active fundraisers including category
app.get('/fundraisers', (req, res) => {
    const sql = `SELECT fundraiser.*, category.NAME as CATEGORY 
                 FROM fundraiser 
                 JOIN CATEGORY ON fundraiser.CATEGORY_ID = category.CATEGORY_ID 
                 WHERE fundraiser.ACTIVE = 1`;
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

// Retrieve fundraisers based on search criteria
app.get('/search', (req, res) => {
    const { organizer, city, category } = req.query;
    let sql = `SELECT fundraiser.*, category.NAME as CATEGORY 
                 FROM fundraiser 
                 JOIN CATEGORY ON fundraiser.CATEGORY_ID = category.CATEGORY_ID 
                 WHERE fundraiser.ACTIVE = 1`;
    
    if (organizer) sql += ` AND FUNDRAISER.ORGANIZER = '${organizer}'`;
    if (city) sql += ` AND FUNDRAISER.CITY = '${city}'`;
    if (category) sql += ` AND CATEGORY.NAME = '${category}'`;
    
    connection.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// Retrieve fundraiser details by ID
app.get('/fundraiser/:id', (req, res) => {
    const sql = `SELECT fundraiser.*, category.NAME as CATEGORY 
                 FROM fundraiser 
                 JOIN CATEGORY ON fundraiser.CATEGORY_ID = category.CATEGORY_ID 
                 WHERE fundraiser.ACTIVE = 1`;
    connection.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3306');
});