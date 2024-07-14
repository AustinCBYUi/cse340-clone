const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountValidation = require("../utilities/account-validation")
const accountController = require("../controllers/accountController")

/* ***********************
* GETS for account route
*************************/

//Get login view.
router.get("/login", utilities.handleErrors(accountController.buildLogin))
//Get register view.
router.get("/register", utilities.handleErrors(accountController.buildRegister))
//Get logged in?
router.get("/", utilities.checkLogin,
    utilities.checkAccountType(["Admin", "Employee", "Client"]),
    utilities.handleErrors(accountController.buildAccountLander))
router.get("/logout",
    utilities.handleErrors(accountController.accountLogout))
//account manager
router.get("/manage", utilities.checkLogin,
    utilities.checkAccountType(["Admin", "Employee", "Client"]),
    utilities.handleErrors(accountController.buildAccountManage))



/* ***********************
* POSTS for account route
*************************/

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
    utilities.handleErrors(accountController.accountLogin))

    //POST for updating account
router.post("/update", utilities.checkLogin,
    accountValidation.updateDataRules(),
    accountValidation.checkUpdateData,
    utilities.checkAccountType(["Admin", "Employee", "Client"]),
    utilities.handleErrors(accountController.updateAccount))

    //POST for changing password
router.post("/password",
    utilities.checkLogin,
    accountValidation.passwordUpdateRules(),
    accountValidation.checkUpdatePassword,
    utilities.handleErrors(accountController.updatePassword)
)

module.exports = router