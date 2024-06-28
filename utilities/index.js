const invModel = require("../models/inventory-model")
const Util = {}

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

/* ***********************
 * Middleware for handling errors
 * wrap other functions in this for general
 * error handling.
 *************************/
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util