const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}


/* ***********************
 * Gets the navigation bars
*************************/
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li class="navhome"><a href="/" title="Home Page">Home</a></li>'
    data.rows.forEach((row) => {
        list += '<li class="navel">'
        //Don't use backticks I suppose!
        list += '<a href="/inventory/type/' +
        row.classification_id + 
        '" title="See our inventory of ' +
        row.classification_name +
        ' vehicles">' + row.classification_name +
        "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}


/* ***********************
* Populates the view with data from the inventory table.
*************************/
Util.getInv = async function (req, res, data) {
    let list = '<ul class="inv-grid">'
    data.rows.forEach((row) => {
        list += '<li class="grid-item-inv">'
        list += '<a id="hoverlink" href="/inventory/' + row.inv_id + '">'
        list += '<h2>' + row.inv_year + ' ' + row.inv_make + ' ' + row.inv_model + '</h2>'
        list += "</a>"
        list += '<a id="hoverlink" href="/inventory/' + row.inv_id + '">'
        list += '<img src="' + row.inv_image + '" alt="Image of ' + row.inv_make + ' ' + row.inv_model + '"/>'
        list += "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}


/* ***********************
* Populates the view with data from a specific vehicle.
*************************/
Util.getItem = async function (req, res, data) {
    let list = '<ul class="inv-detail-view">'
    data.rows.forEach((row) => {
        list += '<li class="item-display-grid">'
        list += '<img class="inv-right" src="' + row.inv_image + '" alt="Image of ' + row.inv_make + ' ' + row.inv_model + '"/>'
        list += '<h2 class="inv-right">' + row.inv_year + ' ' + row.inv_make + ' ' + row.inv_model + '</h2>'
        list += '<p class="inv-right"><b>Description:</b> ' + row.inv_description + '</p>'
        list += '<p class="inv-right"><b>Color:</b> ' + row.inv_color + '</p>'
        list += '<p class="inv-right"><b>Mileage:</b> ' + new Intl.NumberFormat("en-us").format(row.inv_miles) + '</p>'
        list += '<p class="inv-right"><b>Price:</b> $' + new Intl.NumberFormat("en-us").format(row.inv_price) + '</p>'
        list += '<a class="inv-right" href="/contactus">'
        list += '<p class="inv-right" id="buy-car">Buy Now</p>'
        list += "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}


/* ***********************
* Builds the classification Select box
*************************/
Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
        `<select name="classification_id" id="classificationList" title="classification selector" required>`
    classificationList += `<option value="" class="home-select">Select a Classification</option>`
    data.rows.forEach((row) => {
        classificationList += '<option value="' + row.classification_id + '"'
        if (
            classification_id != null &&
            row.classification_id == classification_id
        ) {
            classificationList += " selected "
        }
        classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
}


/* ***********************
* Authorize JWT Token / user
*************************/
Util.checkJWTToken = async (req, res, next) => {
    if (req.cookies.jwt) {
        jwt.verify(
            req.cookies.jwt,
            process.env.ACCESS_TOKEN_SECRET,
            function (err, accountData) {
                if (err) {
                    req.flash("notice-bad", "Please log in.")
                    res.clearCookie("jwt")
                    res.locals.loggedin = 0
                    return res.redirect("/account/login")
                }
            res.locals.accountData = accountData
            res.locals.loggedin = 1
            next()
            })
    } else {
        res.locals.loggedin = 0
        next()
    }
}


/* ***********************
* Check login, this works great compared to the original solution.
*************************/
Util.checkLogin = (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET,
            function (err, accountData) {
                if (err) {
                    req.flash("notice-bad", "Please log in.")
                    return res.redirect("/account/login")
                } else {
                    res.locals.loggedin = 1
                    res.locals.accountData = accountData
                    res.locals.account_type = accountData.account_type
                    return next()
                }
            })
    } else {
        req.flash("notice-bad", "Please log in.")
        return res.redirect("/account/login")
    }
}

/* ***********************
* Check account type
*************************/
Util.checkAccountType = (account_type) => {
    return (req, res, next) => {
        if (res.locals.loggedin && account_type.includes(res.locals.account_type)) {
            next();
        } else {
            req.flash("notice-bad", "You do not have permission to access this page.")
            res.redirect("/")
        }
    }
}

/* ***********************
* Password hasher
*************************/
Util.hashPassword = async (password, saltRounds = 10) => {
    const bcrypt = require("bcrypt")
    return await bcrypt.hash(password, saltRounds)
}

/* ***********************
 * Middleware for handling errors
 * wrap other functions in this for general
 * error handling.
 *************************/
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util