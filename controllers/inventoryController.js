const utilities = require("../utilities/")
const invModel = require("../models/inventory-model")



/* ***********************
* Builds the list of inventory page.
*************************/
async function buildInv(req, res, type) {
    const nav = await utilities.getNav()
    let data = await invModel.getItems(type)
    const body = await utilities.getInv(req, res, data)
    res.render("index", { title: "Inventory", nav: nav, body: body })
}


/* ***********************
* Builds the individual item page
*************************/
async function buildItem(req, res, id) {
    const nav = await utilities.getNav()
    const data = await invModel.getDetails(id);
    const body = await utilities.getItem(req, res, data)
    res.render("index", { title: "Item", nav: nav, body: body })
}


/* ***********************
* Builds the inventory manager page
*************************/
async function buildManage(req, res) {
    const nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()
    res.render("inventory/management",{
        title: "Manage",
        nav: nav,
        classificationSelect,
    })
}


/* ***********************
* Builds the Add Classification view
*************************/
async function buildAddClassification(req, res) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null,
    })
}


/* ***********************
* Builds the Add Item view
*************************/
async function buildAddItem(req, res) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList()
    res.render("inventory/add-inventory", {
        title: "Add Item",
        nav,
        classificationList,
        errors: null,
    })
}


/* ***********************
* Logic for adding new classifications.
*************************/
async function addClassification(req, res) {
    let nav = await utilities.getNav()
    const { classification_name } = req.body
    const classificationList = await utilities.buildClassificationList()
    const result = await invModel.addClassification(classification_name)

    if (result) {
        req.flash("notice-good",
            `Classification ${classification_name} has been added successfully!`
        )
        res.status(201).render("inventory/management", {
            title: "Manage",
            nav,
            classificationSelect: classificationList,
        })
    } else {
        req.flash("notice-bad",
            "There was an error adding the classification. Please try again and check the format."
        )
        res.status(501).render("inventory/add-classification", {
            title: "Add Classification",
            nav,
            errors: [{ msg: "There was an error adding the classification. Please try again and check the format"}],
        })
    }
}


/* ***********************
* Logic for adding new items to the inventory.
*************************/
async function addItem(req, res) {
    let nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList()
    const { classification_id, inv_year, inv_make, inv_model, inv_image, inv_thumbnail, inv_miles, inv_color, inv_description, inv_price } = req.body
    const result = await invModel.addItemToInventory(classification_id, inv_year, inv_make, inv_model, inv_image, inv_thumbnail, inv_miles, inv_color, inv_description, inv_price)

    if (result) {
        req.flash("notice-good",
            `Item ${inv_year} ${inv_model} has been added successfully!`
        )
        return res.status(201).render("inventory/management", {
            title: "Manage",
            nav,
            classificationSelect: classificationList,
        })
    } else {
        req.flash("notice-bad",
            "There was an error adding the item. Please try again and check the format."
        )
        return res.status(501).render("inventory/add-inventory", {
            title: "Add Item",
            nav,
            errors: [{ msg: "There was an error adding the item. Please try again and check the format"}],
            classificationList,
        })
    }
}


/* ***********************
* Return the inventory to the client as JSON,
* ONLY USED BY ADMIN / EMPLOYEE
*************************/
async function getInventoryJSON(req, res, next) {
    const classification_id = parseInt(req.params["classification_id"])
    const invData = await invModel.getItems(classification_id, true)
    if (invData[0].inv_id) {
        return res.json(invData)
    } else {
        next(new Error("No data was returned!"))
    }
}


/* ***********************
* Build item edit view for editing an item's data
*************************/
async function buildItemEditView(req, res) {
    const inventory_id = parseInt(req.params["id"])
    let nav = await utilities.getNav()
    const getItem = await invModel.getDetails(inventory_id, true)
    const data = getItem[0]
    const classificationSelect = await utilities.buildClassificationList(data.classification_id)
    const itemName = `${data.inv_make} ${data.inv_model}`

    res.render("./inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        data,
        classificationList: classificationSelect,
        errors: null,
        inv_id: data.inv_id,
        inv_make: data.inv_make,
        inv_model: data.inv_model,
        inv_year: data.inv_year,
        inv_description: data.inv_description,
        inv_image: data.inv_image,
        inv_thumbnail: data.inv_thumbnail,
        inv_price: data.inv_price,
        inv_miles: data.inv_miles,
        inv_color: data.inv_color,
        classification_id: data.classification_id,
    })
}


/* ***********************
* Logic for updating the item's data in the database.
*************************/
async function updateItem(req, res) {
    let nav = await utilities.getNav()
    const { inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id, } = req.body
    const updateResult = await invModel.updateItemInInventory(inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id)

    if (updateResult) {
        //Might have to take out the index.
        const itemName = updateResult.inv_make + " " + updateResult.inv_model
        req.flash("notice-good",
            `The ${itemName} has been updated successfully!`
        )
        res.redirect("/inventory/manage")
    } else {
        const classificationSelect = await utilities.buildClassificationList(classification_id)
        const itemName = `${inv_make} ${inv_model}`
        req.flash("notice-bad",
            "There was an error updating the item. Please try again and check the format."
        )
        return res.status(501).render("inventory/edit-inventory", {
            title: "Edit" + itemName,
            nav,
            errors: null,
            classificationList: classificationSelect,
            inv_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id,
        })
    }
}


/* ***********************
* Build item delete view
*************************/
async function buildItemDeleteView(req, res) {
    const inventory_id = parseInt(req.params["id"])
    let nav = await utilities.getNav()
    const getItem = await invModel.getDetails(inventory_id, true)
    const data = getItem[0]
    const itemName = `${data.inv_make} ${data.inv_model}`

    res.render("./inventory/delete-inventory", {
        title: "Delete " + itemName,
        nav,
        data,
        errors: null,
        inv_id: data.inv_id,
        inv_make: data.inv_make,
        inv_model: data.inv_model,
        inv_year: data.inv_year,
        inv_price: data.inv_price,
    })
}


/* ***********************
* Delete an Item from the inventory / database.
*************************/
async function deleteItem(req, res) {
    let nav = await utilities.getNav()
    const { inv_id, inv_make, inv_model, inv_price, inv_year } = req.body
    const vehicleResponsePreDelete = await invModel.getDetails(inv_id, true)
    const vehicleResult = vehicleResponsePreDelete[0]
    const deleteResult = await invModel.deleteItemInInventory(inv_id)

    if (deleteResult) {
        //Might have to take out the index.
        const itemName = vehicleResult.inv_make + " " + vehicleResult.inv_model
        req.flash("notice-good",
            `The ${itemName} has been deleted successfully!`
        )
        res.redirect("/inventory/manage")
    } else {
        const itemName = `${inv_make} ${inv_model}`
        req.flash("notice-bad",
            "There was an error deleting the item. Please try again and check the format."
        )
        return res.status(501).render("inventory/delete-inventory", {
            title: "Delete" + itemName,
            nav,
            errors: null,
            inv_id,
            inv_make,
            inv_model,
            inv_year,
            inv_price,
        })
    }
}



module.exports = {
    buildInv,
    buildItem,
    buildManage,
    buildAddClassification,
    buildAddItem,
    addClassification,
    addItem,
    getInventoryJSON,
    buildItemEditView,
    updateItem,
    buildItemDeleteView,
    deleteItem,
};