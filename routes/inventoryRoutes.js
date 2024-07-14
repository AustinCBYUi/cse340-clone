const express = require("express")
const router = new express.Router()
const invController = require("../controllers/inventoryController")
const utilities = require("../utilities")
const invValidation = require("../utilities/manage-validation")

/* ***********************
* GET routes
*************************/

//Manage page (inventory/manage)
router.get("/manage",
    //Checks if user is logged in
    utilities.checkLogin,
    //Checks if user has the account type required.
    utilities.checkAccountType(["Admin", "Employee"]),
    //Runs the function in the controller.
    function(req, res) {
    utilities.handleErrors(invController.buildManage(req, res))
})

//Add classification page at /inventory/add-classification
router.get("/add-classification",
    utilities.checkLogin,
    utilities.checkAccountType(["Admin", "Employee"]),
    utilities.handleErrors(invController.buildAddClassification))
router.get("/add-inventory", utilities.checkLogin, utilities.handleErrors(invController.buildAddItem))

//Build inventory page at /inventory/type/classification_id here
router.get("/type/:classification_id", function(req, res) {
    utilities.checkLogin,
    utilities.checkAccountType(["Admin"]),
    utilities.handleErrors(invController.buildInv(req, res, req.params["classification_id"]))
})

//Build item page at /inventory/item_id
router.get("/:id", function(req, res) {
    utilities.handleErrors(invController.buildItem(req, res, req.params["id"]))
})

//Edit item_id route
router.get("/edit/:id", utilities.checkLogin,
    utilities.checkAccountType(["Admin", "Employee"]),
    utilities.handleErrors(invController.buildItemEditView))

//Detele item_id route
router.get("/delete/:id", utilities.checkLogin,
    utilities.checkAccountType(["Admin", "Employee"]),
    utilities.handleErrors(invController.buildItemDeleteView))
//This is the JSON API for the inventory display for the
//manage page.
router.get("/getInventory/:classification_id", 
    utilities.checkLogin,
    utilities.checkAccountType(["Admin", "Employee"]),
    utilities.handleErrors(invController.getInventoryJSON))


/* ******************
* POST routes below
* ******************/

router.post(
    "/add-classification",
    utilities.checkLogin,
    utilities.checkAccountType(["Admin"]),
    invValidation.addClassificationRules(),
    invValidation.checkClassificationData,
    //I legit put a placeholder function here and have been
    //wondering why my insert won't work for like 2 hours now..
    utilities.handleErrors(invController.addClassification))

router.post(
    "/add-inventory",
    utilities.checkLogin,
    utilities.checkAccountType(["Admin", "Employee"]),
    invValidation.addItemRules(),
    invValidation.checkItemData,
    utilities.handleErrors(invController.addItem))

router.post("/edit/",
    utilities.checkLogin,
    utilities.checkAccountType(["Admin", "Employee"]),
    invValidation.addItemRules(),
    invValidation.checkItemData,
    utilities.handleErrors(invController.updateItem))

router.post("/delete/",
    utilities.checkLogin,
    utilities.checkAccountType(["Admin", "Employee"]),
    utilities.handleErrors(invController.deleteItem))
    
module.exports = router;