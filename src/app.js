const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const compression = require("compression");
const app = express();

// init middlewares
app.use(morgan("dev")) // hiển thị status khi code được khởi chạy
app.use(helmet()) // giấu thông tin mình dùng gì để code
app.use(compression()) // nén băng thông

// init db

// init routes
app.get('/', (req, res, next) => {
    return res.status(200).json({
        message: 'Welcome my web'
    })
})
// handling error


module.exports = app