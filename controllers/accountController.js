const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
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
* Deliver logged in view
*************************/
async function buildAccountManage(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/acc-manage", {
        title: "Logged In",
        nav,
        errors: null,
    })
}


/* ***********************
* Register user
*************************/
async function registerUser(req, res) {
    const saltRounds = 10;
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body
    const hashedPassword = await bcrypt.hash(account_password, saltRounds);

    const regResult = await accountModel.insertUserData(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )

    if (regResult) {
        req.flash("notice-good",
            `Welcome ${account_firstname} ${account_lastname}, you have successfully registered!`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
            errors: null,
        })
    } else {
        req.flash("notice-bad",
            "Sorry, the registration failed. Please try again later."
        )
        res.status(501).render("account/register", {
            title: "Register",
            nav,
            errors: null,
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
    console.log(accountData)
    if (!accountData) {
        req.flash("notice-bad", "Sorry, the email or password is incorrect.")
        res.status(400).render("account/login", {
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
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
            if (process.env.NODE_ENV === 'development') {
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
            } else {
                res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
            }
            res.locals.loggedin = true
            res.redirect("/account/")
        }
    } catch (error) {
        return new Error('Access Forbidden')
    }
}

module.exports = { buildLogin, buildRegister, buildAccountManage, registerUser, loginTester, accountLogin }