const app = require('./src/app')

const PORT = process.env.PORT || 3056

const server = app.listen(PORT, () => {
    console.log(`WSV eCommerce start with ${PORT}`, `localhost:${PORT}` )
})

process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection:', reason);
});
  

// process.on('SIGINT', () => {
//     server.close(() => console.log(`Exit Server Express`))
// })