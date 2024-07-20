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
//Admin panel
router.get("/admin",
    utilities.checkLogin,
    utilities.checkAccountType(["Admin"]),
    utilities.handleErrors(accountController.buildAdminAccountManager)
)
router.get("/admin/admin-view-users",
    utilities.checkLogin,
    utilities.checkAccountType(["Admin"]),
    utilities.handleErrors(accountController.buildAdminAccountEditor)
)
//Get all accounts as a JSON
router.get("/admin/getAccounts",
    utilities.checkLogin,
    utilities.checkAccountType(["Admin"]),
    utilities.handleErrors(accountController.getAccountJSON)
)
//Edit individual accounts by account_id
router.get("/admin/edit/:account_id",
    utilities.checkLogin,
    utilities.checkAccountType(["Admin"]),
    utilities.handleErrors(accountController.buildAdminAccountEdit)
)
//Delete individual accounts by account_id
router.get("/admin/delete/:account_id",
    utilities.checkLogin,
    utilities.checkAccountType(["Admin"]),
    utilities.handleErrors(accountController.buildAdminAccountDelete)
)



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

//POST for updating a user account as an admin
router.post("/admin/edit/",
    utilities.checkLogin,
    utilities.checkAccountType(["Admin"]),
    accountValidation.updateDataRules(),
    accountValidation.checkUpdateData,
    utilities.handleErrors(accountController.adminUpdateUserAccount)
)

//POST for deleting a user account as an administrator
router.post("/admin/delete/",
    utilities.checkLogin,
    utilities.checkAccountType(["Admin"]),
    accountValidation.updateDataRules(),
    utilities.handleErrors(accountController.adminDeleteUserAccount)
)

module.exports = router