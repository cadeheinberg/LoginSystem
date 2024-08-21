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
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET"],
    credentials: true
}));
app.use(cookieParser());

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectTimeout: 6000
};

const pool = mysql.createPool(dbConfig, (err, response) => {
    if (err) {
        console.log('Database Error 1', err);
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

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ Error: "You are not authenticated" })
    } else {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.json({ Error: "Token is not associated with account" })
            } else {
                console.log(decoded)
                req.userName = decoded.userName;
                next();
            }
        })
    }
}

app.get("/", verifyUser, async (req, res) => {
    return res.json({ Status: "Success", userName: req.userName })
});

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
    console.log("login requested")
    const { email, password } = req.body;
    try {
        const [rows] = await db.query("SELECT * FROM login WHERE email = ?", [email]);
        if (rows.length === 0) {
            return res.json({ Error: "No user with that email" });
        }
        const hashword = rows[0].password;
        const isMatch = await bcrypt.compare(password, hashword);
        if (isMatch) {
            const userName = rows[0].name;
            console.log(userName + " logged in successfully");
            const token = jwt.sign({ userName }, process.env.JWT_SECRET, { expiresIn: '1d' });
            res.cookie('token', token)
            return res.json({ Status: "Success" });
        } else {
            res.json({ Error: "Incorrect password" });
        }
    } catch (err) {
        console.error("Error during login:", err.message);
        res.json({ Error: err.message });
    }
});

app.get("/logout", async (req, res) => {
    console.log("logout requested")
    res.clearCookie('token');
    return res.json({ Status: "Success" });
});

app.listen(5002, () => {
    console.log("Nodejs server listening at 5002")
})
