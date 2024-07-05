const express = require("express")
const router = new express.Router()
const invController = require("../controllers/inventoryController")
const utilities = require("../utilities")

router.get("/type/:type", function(req, res) {
    utilities.handleErrors(invController.buildInv(req, res, req.params["type"]))
})
router.get("/:id", function(req, res) {
    utilities.handleErrors(invController.buildItem(req, res, req.params["id"]))
})

module.exports = router;