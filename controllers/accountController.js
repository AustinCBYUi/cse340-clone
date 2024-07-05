const utilities = require("../utilities")
const accountModel = require("../models/account-model")

/* ***********************
* Deliver login view
*************************/
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
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

module.exports = { buildLogin, buildRegister, registerUser }