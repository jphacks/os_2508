const express = require('express');
const path = require('path');
const router = express.Router();
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");
const InverseCookieObserver = require('../Tools/InverseCookieObserver');

//use系
router.use(cookieParser());

