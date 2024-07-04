const invModel = require("../models/inventory-model")
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
        list += '<a href="/inv/type/' +
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

/*
 * Populates the view with data from a specific category of vehicles.
*/
Util.getInv = async function (req, res, data) {
    let list = '<ul class="inv-grid">'
    data.rows.forEach((row) => {
        list += '<li class="grid-item-inv">'
        list += '<a id="hoverlink" href="/inv/' + row.inv_id + '">'
        list += '<h2>' + row.inv_year + ' ' + row.inv_make + ' ' + row.inv_model + '</h2>'
        list += "</a>"
        list += '<a id="hoverlink" href="/inv/' + row.inv_id + '">'
        list += '<img src="' + row.inv_image + '" alt="Image of ' + row.inv_make + ' ' + row.inv_model + '"/>'
        list += "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}

/*
 * Populates the view with data from an individual item by id.
*/
Util.getItem = async function (req, res, data) {
    let list = '<ul class="inv-detail-view">'
    data.rows.forEach((row) => {
        list += '<li class="item-display-grid">'
        list += '<img class="inv-right" src="' + row.inv_image + '" alt="Image of ' + row.inv_make + ' ' + row.inv_model + '"/>'
        list += '<h2 class="inv-right">' + row.inv_year + ' ' + row.inv_make + ' ' + row.inv_model + '</h2>'
        list += '<p class="inv-right"><b>Description:</b> ' + row.inv_description + '</p>'
        list += '<p class="inv-right"><b>Color:</b> ' + row.inv_color + '</p>'
        list += '<p class="inv-right"><b>Mileage:</b> ' + row.inv_miles + '</p>'
        list += '<p class="inv-right"><b>Price:</b> $' + row.inv_price + '</p>'
        list += '<a class="inv-right" href="/contactus">'
        list += '<p class="inv-right" id="buy-car">Buy Now</p>'
        list += "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}

/* ***********************
 * Middleware for handling errors
 * wrap other functions in this for general
 * error handling.
 *************************/
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util