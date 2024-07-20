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
* Deliver logged in view aka landing page.
*************************/
async function buildAccountLander(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/acc-manage", {
        title: "Logged In",
        nav,
        errors: null,
    })
}


/* ***********************
* Register user.
*************************/
async function registerUser(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body
    const hashedPassword = await utilities.hashPassword(account_password);

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
* Login the user, compare passwords as well obviously.
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
            res.redirect("/account/")
        }
    } catch (error) {
        return new Error('Access Forbidden')
    }
}


/* ***********************
* Logout user (DOES WORK!!)
*************************/
async function accountLogout(req, res) {
    delete res.locals
    res.clearCookie("jwt")
    req.flash("notice-good", "You have been logged out.")
    res.redirect("/")
}


/* ***********************
* Deliver account manager view
*************************/
async function buildAccountManage(req, res, next) {
    const accountData = res.locals.accountData
    let nav = await utilities.getNav()
    res.render("account/update-account", {
        title: "Account Manager",
        nav,
        errors: null,
        account_firstname: accountData.account_firstname,
        account_lastname: accountData.account_lastname,
        account_email: accountData.account_email,
        account_id: accountData.account_id,
    })
}

/* ***********************
* Update account via account manager
*************************/
async function updateAccount(req, res) {
    const { account_firstname, account_lastname, account_email, account_id } = req.body
    const updateResult = await accountModel.updateAccountData(
        account_firstname,
        account_lastname,
        account_email,
        account_id
    )

    if (updateResult) {
        req.flash("notice-good",
            `Your account has been updated successfully! Please re-log to see changes!`
        )
        res.redirect("/account/")
    } else {
        req.flash("notice-bad",
            "There was an error updating your account. Please try again and check the format."
        )
        return res.status(501).render("account/update-account", {
            title: "Account Manager",
            nav,
            errors: null,
            account_firstname,
            account_lastname,
            account_email,
            account_id,
        })
    }
}

/* ***********************
* Update password via account manager
*************************/
async function updatePassword(req, res) {
    const { account_old_password, new_account_password, account_id } = req.body
    const accountData = await accountModel.getAccountById(account_id)

    try {
        if (await bcrypt.compare(account_old_password, accountData.account_password)) {
            delete accountData.account_password
            const hashedPassword = await utilities.hashPassword(new_account_password)
            const updateResult = await accountModel.updateAccountPassword(
                hashedPassword,
                account_id
            )

        if (updateResult) {
            req.flash("notice-good",
                `Your password has been updated successfully! Please log in with the new password.`
            )
            // accountLogout(res, req)
            res.redirect("/account/login")
        } else {
            req.flash("notice-bad",
                "There was an error updating your password. Please try again and check the format."
            )
            return res.status(501).render("account/update-account", {
                title: "Account Manager",
                nav,
                errors: null,
                account_firstname,
                account_lastname,
                account_email,
                account_id,
            })
        }
    }
} catch (error) {
        req.flash("notice-bad",
            "Sorry, the old password you entered is incorrect."
        )
        return res.status(400).render("account/update-account", {
            title: "Account Manager",
            nav,
            errors: null,
            account_firstname,
            account_lastname,
            account_email,
            account_id,
        })
    }
}


/* ***********************
* Build Admin Panel
*************************/
async function buildAdminAccountManager(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/admin/admin-panel", {
        title: "Administarator Panel",
        nav,
        errors: null,
    })
}


/* ***********************
* Build the accounts edit view for admins
*************************/
async function buildAdminAccountEditor(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/admin/admin-view-users", {
        title: "Users",
        nav,
        errors: null,
    })
}


/* ***********************
* Return the accounts to the client as JSON,
* ONLY USED BY ADMIN / EMPLOYEE
*************************/
async function getAccountJSON(req, res, next) {
    //Need to get all accounts from the database
    const accountData = await accountModel.getAllAccounts()
    if (accountData[0].account_id) {
        return res.json(accountData)
    } else {
        next(new Error("No data was returned!"))
    }
}


/* ***********************
* Deliver account manager view for admins
*************************/
async function buildAdminAccountEdit(req, res, next) {
    const account_id = parseInt(req.params["account_id"])
    const userData = await accountModel.getAccountById(account_id, true)
    const accountData = userData[0]
    let nav = await utilities.getNav()
    res.render("./account/admin/admin-edit-user", {
        title: "Admin User Editor",
        nav,
        errors: null,
        accountData,
        account_firstname: accountData.account_firstname,
        account_lastname: accountData.account_lastname,
        account_email: accountData.account_email,
        account_id: accountData.account_id,
    })
}


/* ***********************
* Updating user accounts for admins
*************************/
async function adminUpdateUserAccount(req, res, next) {
    const { account_firstname, account_lastname, account_email, account_id } = req.body
    const updateResult = await accountModel.updateAccountData(
        account_firstname,
        account_lastname,
        account_email,
        account_id
    )

    if (updateResult) {
        req.flash("notice-good",
            `The account has been updated successfully!`
        )
        res.redirect("/account/admin/admin-view-users")
    } else {
        req.flash("notice-bad",
            "There was an error updating the account. Please try again and check the format."
        )
        return res.status(501).render("account/admin/admin-edit-user", {
            title: "Admin User Editor",
            nav,
            errors: null,
            account_firstname,
            account_lastname,
            account_email,
            account_id,
        })
    }
}


/* ***********************
* Build user accounts delete for admins
*************************/
async function buildAdminAccountDelete(req, res) {
    const account_id = parseInt(req.params["account_id"])
    const userData = await accountModel.getAccountById(account_id, true)
    const accountData = userData[0]
    let nav = await utilities.getNav()
    res.render("./account/admin/admin-delete-user", {
        title: "Admin User Deleter",
        nav,
        errors: null,
        accountData,
        account_firstname: accountData.account_firstname,
        account_lastname: accountData.account_lastname,
        account_email: accountData.account_email,
        account_id: accountData.account_id,
    })
}


/* ***********************
* Delete user accounts for admins
*************************/
async function adminDeleteUserAccount(req, res) {
    const { account_firstname, account_lastname, account_email, account_id } = req.body
    const deleteResult = await accountModel.deleteAccountById(account_id)

    if (deleteResult) {
        req.flash("notice-good",
            `The account has been deleted successfully!`
        )
        res.redirect("/account/admin/admin-view-users")
    } else {
        req.flash("notice-bad",
            "There was an error deleting the account. Please try again and check the format."
        )
        return res.status(501).render("account/admin/admin-delete-user", {
            title: "Admin Delete User",
            nav,
            errors: null,
            account_firstname,
            account_lastname,
            account_email,
            account_id,
        })
    }
}


module.exports = { 
    buildLogin,
    buildRegister,
    buildAccountLander,
    buildAccountManage,
    registerUser,
    accountLogin,
    accountLogout,
    updateAccount,
    updatePassword,
    buildAdminAccountManager,
    buildAdminAccountEditor,
    getAccountJSON,
    buildAdminAccountEdit,
    adminUpdateUserAccount,
    buildAdminAccountDelete,
    adminDeleteUserAccount,
}