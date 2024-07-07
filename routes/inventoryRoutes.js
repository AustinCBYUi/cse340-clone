const express = require("express")
const router = new express.Router()
const invController = require("../controllers/inventoryController")
const utilities = require("../utilities")
const invValidation = require("../utilities/manage-validation")

router.get("/manage", function(req, res) {
    utilities.handleErrors(invController.buildManage(req, res))
})

router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))
router.get("/add-inventory", utilities.handleErrors(invController.buildAddItem))

router.get("/type/:type", function(req, res) {
    utilities.handleErrors(invController.buildInv(req, res, req.params["type"]))
})
router.get("/:id", function(req, res) {
    utilities.handleErrors(invController.buildItem(req, res, req.params["id"]))
})

router.post(
    "/add-classification",
    invValidation.addClassificationRules(),
    invValidation.checkClassificationData,
    //I legit put a placeholder function here and have been
    //wondering why my insert won't work for like 2 hours now..
    utilities.handleErrors(invController.addClassification))

router.post(
    "/add-inventory",
    invValidation.addItemRules(),
    invValidation.checkItemData,
    utilities.handleErrors(invController.addItem))

module.exports = router;