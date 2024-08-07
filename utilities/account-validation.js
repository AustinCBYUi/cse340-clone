const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const { body, validationResult } = require("express-validator")
const validate = {}

/* ***********************
* Validate Data for logging in.
*************************/
validate.loginRules = () => {
    return [
        body("account_email")
            .trim()
            .isEmail()
            .normalizeEmail()
            .withMessage("A valid email is required.")
            .custom(async (account_email) => {
                //Still checks if the email exists...
                const emailExists = await accountModel.checkExistingEmail(account_email)
                //If it does NOT exist, it will say the email doesn't exist.
                //The function returns a rowcount, not a boolean. This requires the 0 check
                if (emailExists === 0) {
                    throw new Error("Email or password does not exist. Please try again or register an account.")
                }
            }),
        body("account_password")
            .trim()
            .notEmpty()
    ]
}

/* ***********************
* Validate the password meets the requirements specified.
*************************/
validate.passwordUpdateRules = () => {
    return [
        body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet the specifications."),
    ]
}

/* ***********************
* Validate the new data people are updating their accounts with.
* Cannot include email because it will check if the email is already in use?
*************************/
validate.updateDataRules = () => {
    return [
        body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("First name is required."),

    body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Last name is required."),
    ]
}

/* ***********************
* Validate the data users are registering with.
*************************/
validate.registrationRules = () => {
    return [
        body("account_firstname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("First name is required."),

        body("account_lastname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Last name is required."),

        body("account_email")
            .trim()
            .isEmail()
            .normalizeEmail()
            .withMessage("A valid email is required.")
            .custom(async (account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email)
                if (emailExists) {
                    throw new Error("Email is already in use. Please login or use a different email.")
                }
            }),

        body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet the specifications."),
    ]
}


/* ***********************
* Check data and return errors
*************************/
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email, account_password } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/register", {
            errors,
            title: "Register",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    next()
}

/* ***********************
* Check login data and return errors
*************************/
validate.checkLoginData = async (req, res, next) => {
    const {account_email, account_password } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/login", {
            errors,
            title: "Login",
            nav,
            account_email,
        })
        return
    }
    next()
}

/* ***********************
* Check data and return errors for updating account
*************************/
validate.checkUpdateData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/update-account", {
            errors,
            title: "Update Account",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    next()
}

/* ***********************
* Check data and return errors for updating passwords
*************************/
validate.checkUpdatePassword = async (req, res, next) => {
    const { account_password } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/update-account", {
            errors,
            title: "Update Password",
            nav,
        })
        return
    }
    next()
}


module.exports = validate