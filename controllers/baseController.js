const utilities = require("../utilities/")
const baseController = {}

/* ***********************
* Build the homepage!
*************************/
baseController.buildHome = async function(req, res) {
    const nav = await utilities.getNav()
    //          Classname, I have notice-bad and notice-good in the css.
    // req.flash("notice-bad", "This is a flash message")
    res.render("index", { title: "Home", nav })
}

module.exports = baseController