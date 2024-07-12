const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ***********************
* Deliver login view
*************************/
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}

async function loginTester(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Logged in",
        nav,
        errors: null,
    })
}

/* ***********************
* Deliver register view
*************************/
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
    })
}


/* ***********************
* Register user
*************************/
async function registerUser(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    const regResult = await accountModel.insertUserData(
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )

    if (regResult) {
        req.flash("notice-good",
            `Welcome ${account_firstname} ${account_lastname}, you have successfully registered!`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
        })
    } else {
        req.flash("notice-bad",
            "Sorry, the registration failed. Please try again later."
        )
        res.status(501).render("account/register", {
            title: "Register",
            nav,
        })
    }
}


/* ***********************
* Login user
*************************/
async function accountLogin(req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
        req.flash("notice-bad", "Sorry, the email or password is incorrect.")
        res.status(401).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
        })
        return
    }
    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "3600" })
            if (process.env.NODE_ENV === "development") {
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
            } else {
                res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
            }
            return res.redirect("/account/")
        }
    } catch (error) {
        return new Error("Access Forbidden")
    }
}

module.exports = { buildLogin, buildRegister, registerUser, loginTester }