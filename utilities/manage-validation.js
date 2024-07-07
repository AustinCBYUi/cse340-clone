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

validateManager.addItemRules = () => {
    return [
        body("classification_id"),
        body("inv_year")
            .trim()
            .notEmpty()
            .isInt()
            .withMessage("Year is required."),
        body("inv_make")
            .trim()
            .notEmpty()
            .withMessage("Make is required."),
        body("inv_model")
            .trim()
            .notEmpty()
            .withMessage("Model is required."),
        body("inv_image")
            .trim()
            .notEmpty()
            .withMessage("Image is required."),
        body("inv_thumbnail")
            .trim()
            .notEmpty()
            .withMessage("Thumbnail is required."),
        body("inv_miles")
            .trim()
            .notEmpty()
            .isInt()
            .withMessage("Miles is required."),
        body("inv_color")
            .trim()
            .notEmpty()
            .withMessage("Color is required."),
        body("inv_description")
            .trim()
            .notEmpty()
            .withMessage("Description is required."),
        body("inv_price")
            .trim()
            .notEmpty()
            .isNumeric()
            .withMessage("Price is required."),
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
            errors: errors,
            title: "Add Classification",
            nav,
            classification_name,
        })
        return
    }
    next()
}

/* ***********************
* Check data and return errors
*************************/
validateManager.checkItemData = async (req, res, next) => {
    const { classification_id, inv_year, inv_make, inv_model, inv_image, inv_thumbnail, inv_miles, inv_color, inv_description, inv_price} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classificationList = await utilities.buildClassificationList()
        res.render("inventory/add-inventory", {
            errors: errors.array(),
            title: "Add Item",
            nav,
            classificationList: classificationList,
            classification_id,
            inv_year,
            inv_make,
            inv_model,
            inv_image,
            inv_thumbnail,
            inv_miles,
            inv_color,
            inv_description,
            inv_price,
        })
        return
    }
    next()
}


module.exports = validateManager