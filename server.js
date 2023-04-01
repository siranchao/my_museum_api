const express = require('express');
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

const userService = require("./user-service");

const dotenv = require("dotenv");
dotenv.config();

// Middleware: CORS-enabled
const cors = require('cors')
app.use(cors())

// Middleware: Add support for incoming JSON entities
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


// Middleware: add passport support
const passport = require('passport')
const { strategy } = require('./middlewares/strategy')

passport.use(strategy);
app.use(passport.initialize());


app.get('/', (req, res) => {
    res.status(200).json({
        message: "API Listening"
    })
});

// Setup api routes
app.use('/api/user', require('./routes/userRoutes'))


// Middleware: catching error routing request
app.use((req, res) => {
    res.status(404).send("Resource not found!")
})


// MongoDB connection
userService.connect()
    .then(() => {
        app.listen(HTTP_PORT, () => { console.log("API listening on: " + HTTP_PORT) });
    })
    .catch((err) => {
        console.log("unable to start the server: " + err);
        process.exit();
    });