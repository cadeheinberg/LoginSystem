//added to package.json to be allowed to use import keyword: "type": "module",
require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const salt = 10;

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectTimeout: 6000
};

const pool = mysql.createPool(dbConfig, (err) => {
    if (err) {
        console.log('Database Error 1', err);
    } else {
        console.log("Database connected!");
    }
});

const db = pool.promise();

async function createTodosTable() {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS login (
                user_id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL
            );
        `);
        console.log("Login table is ready");
    } catch (err) {
        console.error("Error creating todos table:", err.message);
    }
}

createTodosTable();

app.post("/register", async (req, res) => {
    //same as: const name = req.body.name;
    const { name, email, password } = req.body;
    try {
        // Hash the password
        const hash = await bcrypt.hash(password.toString(), salt);
        const [result] = await db.query("INSERT INTO login (name, email, password) VALUES (?, ?, ?)", [name, email, hash]);
        res.json({ Status: "Success" });
    } catch (err) {
        console.error("Error during registration:", err.message);
        res.json({ Error: err.message });
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log(email)
    const [result] = await db.query("SELECT * FROM login WHERE email = ?", [email]);
    if (result.length === 0) {
        res.json({ Error: "Not a user" });
    }
    const hashword = result[0].password;
    try {
        if (await bcrypt.compare(password, hashword)) {
            //correct password
            console.log(result[0].name + " logged in")
            res.json({ Status: result[0].name + " logged in!!!" })
        } else {
            //incorrect password
        }
    } catch (err) {
        console.error("Error during login:", err.message);
        res.json({ Error: err.message });
    }
})

app.listen(5002, () => {
    console.log("Nodejs server listening at 5002")
})
