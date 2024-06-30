/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const expressLayouts = require("express-ejs-layouts")
const baseController = require("./controllers/baseController")
const invController = require("./controllers/inventoryController")
const utilities = require("./utilities/")

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") //Not at views root.

/* ***********************
 * Routes
 *************************/
app.use(static)
// Index Route
app.get("/", utilities.handleErrors(baseController.buildHome))
app.get("/inv/type/:type", function(req, res) {
  utilities.handleErrors(invController.buildInv(req, res, req.params["type"]))
})
app.get("/inv/:id", function(req, res) {
  utilities.handleErrors(invController.buildItem(req, res, req.params["id"]))
})
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