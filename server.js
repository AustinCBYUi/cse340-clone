/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const session = require("express-session")
const bodyParser = require("body-parser")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoutes")
const utilities = require("./utilities/")
const pool = require("./database/")
const accountRoute = require("./routes/accountRoute")


/* ***********************
 * Middleware
 *************************/
app.use(session({
  store: new (require("connect-pg-simple")(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: "sessionId",
}))
//express messages middleware
app.use(require("connect-flash")())
app.use(function(req, res, next) {
  res.locals.messages = require("express-messages")(req, res)
  next()
})
//Body Parser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") //Not at views root.


/* ***********************
 * Routes
 *************************/
// Index Route
app.get("/", utilities.handleErrors(baseController.buildHome))
// Account Route
app.use("/account", utilities.handleErrors(accountRoute))
//Inventory Route
app.use("/inv", utilities.handleErrors(inventoryRoute))
app.use(static)
//Catch all error routes
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, it appears while searching for vehicles, you have wondered into a different parking lot!'})
})
app.use(async (req, res, next) => {
  next({status: 500, message: 'This is an intentional error'})
})


/* ***********************
 * Express error handling
 * place after all other middleware
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  //This keeps people from seeing internally a variable name of the server.
  //This is good practice, always use generic messages for errors.
  if (err.status == 404 || err.status == 500) { message = err.message} else {message = 'Oh no! There was an issue routing your destination..'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})


/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})