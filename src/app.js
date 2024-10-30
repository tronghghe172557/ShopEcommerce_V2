require('dotenv').config();
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const compression = require("compression");
const app = express();

// init middlewares
app.use(morgan("dev")) // hiển thị status khi code được khởi chạy
app.use(helmet()) // giấu thông tin mình dùng gì để code
app.use(compression()) // nén băng thông
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// init db
require('./dbs/init.mongodb.lvPro')
// checkOverload();
// init routes
app.use('', require('./routes/index'))
// handling error


module.exports = app