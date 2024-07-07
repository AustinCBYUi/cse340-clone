const utilities = require("../utilities")
const inventoryModel = require("../models/inventory-model")
const { body, validationResult } = require("express-validator")
const validateManager = {}

validateManager.addClassificationRules = () => {
    return [
        body("classification_name")
            .trim()
            .notEmpty()
            .withMessage("Classification is required.")
            .custom(async (classification_name) => {
                const classificationExists = await inventoryModel.checkExistingClassification(classification_name)
                if (classificationExists) {
                    throw new Error("Classification already exists.")
                }
            }),
    ]
}

/* ***********************
* Check data and return errors
*************************/
validateManager.checkClassificationData = async (req, res, next) => {
    const classification_name = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add Classification",
            nav,
            classification_name,
        })
        return
    }
    next()
}

module.exports = validateManager