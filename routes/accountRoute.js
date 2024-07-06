const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountValidation = require("../utilities/account-validation")
const accountController = require("../controllers/accountController")

//Get login view.
router.get("/login", utilities.handleErrors(accountController.buildLogin))
//Get register view.
router.get("/register", utilities.handleErrors(accountController.buildRegister))
//Establish the POST for registration
router.post(
    "/register",
    accountValidation.registrationRules(),
    accountValidation.checkRegData,
    utilities.handleErrors(accountController.registerUser))
//Establish the POST for logging in
router.post(
    "/login",
    accountValidation.loginRules(),
    accountValidation.checkLoginData,
    utilities.handleErrors(accountController.loginTester))

module.exports = router