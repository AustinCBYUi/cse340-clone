const utilities = require("../utilities/")
const invModel = require("../models/inventory-model")

/*
 * This function is for building the inventory page.
 *
*/
async function buildInv(req, res, type) {
    const nav = await utilities.getNav()
    let data = await invModel.getItems(type)
    const body = await utilities.getInv(req, res, data)
    res.render("index", { title: "Inventory", nav: nav, body: body })
}

/*
 * This function is for building the item page.
 *
*/
async function buildItem(req, res, id) {
    const nav = await utilities.getNav()
    const data = await invModel.getDetails(id);
    const body = await utilities.getItem(req, res, data)
    res.render("index", { title: "Item", nav: nav, body: body })
}

/*
 * This function is for building the manage page.
 *
*/
async function buildManage(req, res) {
    const nav = await utilities.getNav()
    res.render("inventory/management", { title: "Manage", nav: nav })
}

/*
* This function is for building the add classification page.
*/
async function buildAddClassification(req, res) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null,
    })
}

/*
* This function is for adding a classification.
*
*/
async function addClassification(req, res) {
    let nav = await utilities.getNav()
    const { classification_name } = req.body
    const result = await invModel.addClassification(classification_name)

    if (result) {
        req.flash("notice-good",
            `Classification ${classification_name} has been added successfully!`
        )
        res.status(204).render("inventory/management", {
            title: "Manage",
            nav,
        })
    } else {
        req.flash("notice-bad",
            "There was an error adding the classification. Please try again and check the format."
        )
        res.status(501).render("inventory/add-classification", {
            title: "Add Classification",
            nav,
        })
    }
}

module.exports = {
    buildInv,
    buildItem,
    buildManage,
    buildAddClassification,
    addClassification
};