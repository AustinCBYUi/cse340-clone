const utilities = require("../utilities/")
const invController = {}

/*
 * This function is for building the inventory page.
 *
*/
invController.buildInv = async function(req, res, type) {
    const nav = await utilities.getNav()
    const body = await utilities.getInv(req, res, type)
    res.render("index", { title: "Inventory", nav: nav, body: body })
}

/*
 * This function is for building the item page.
 *
*/
invController.buildItem = async function(req, res, id) {
    const nav = await utilities.getNav()
    const body = await utilities.getItem(req, res, id)
    res.render("index", { title: "Item", nav: nav, body: body })
}

module.exports = invController;