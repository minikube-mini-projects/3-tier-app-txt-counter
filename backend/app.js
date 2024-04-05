const express = require('express');
const multer = require('multer');
const mysql = require('mysql');
const cors = require('cors'); // Import the cors middleware


const app = express();
const upload = multer({ dest: 'uploads/' });


// Use cors middleware
app.use(cors());


const db = mysql.createConnection({
    host: 'localhost',
    user: 'admin',
    password: 'Password=T3$t#DBu53r', // Change this to your MySQL password
    database: 'file_upload_app'
});

// Connect to MySQL database
db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Create file_data table if not exists
const createTableQuery = `CREATE TABLE IF NOT EXISTS file_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    character_count VARCHAR(1),
    count INT
);`;

db.query(createTableQuery, (err, result) => {
    if (err) {
        console.error('Error creating table:', err);
        return;
    }
    console.log('File_data table created or already exists');
});

// Upload route
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    // Read the uploaded file
    const fs = require('fs');
    fs.readFile(req.file.path, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Error reading file.');
        }

        // Process file data
        const characterCountMap = new Map();
        for (const char of data) {
            const normalizedChar = char.toLowerCase();
            if (/[a-z0-9]/.test(normalizedChar)) {
                characterCountMap.set(normalizedChar, (characterCountMap.get(normalizedChar) || 0) + 1);
            }
        }

        // Delete existing data
        db.query('DELETE FROM file_data', (err, result) => {
            if (err) {
                console.error('Error deleting existing data:', err);
                return res.status(500).send('Error deleting existing data.');
            }

            // Insert new data into database
            const inserts = [];
            for (const [character, count] of characterCountMap.entries()) {
                inserts.push([character, count]);
            }

            const sql = 'INSERT INTO file_data (character_count, count) VALUES ?';
            db.query(sql, [inserts], (err, result) => {
                if (err) {
                    console.error('Error inserting data into database:', err);
                    return res.status(500).send('Error inserting data into database.');
                }
                console.log(`${result.affectedRows} rows inserted.`);
                res.status(200).send('File uploaded and data processed successfully.');
            });
        });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
