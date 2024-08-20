//added to package.json to be allowed to use import keyword: "type": "module",
import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import jwt from 'jsonwebtokent';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
