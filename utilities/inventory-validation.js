const utilities = require("../utilities/");
const invModel = require("../models/inventory-model");
const { body, validationResult } = require("express-validator");
const validate = {};

/* **********************************
 * Add classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
    return [
      body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .isAlpha()
        .withMessage("A valid name is required. Please use only alphabetical characters without space.")
        .custom(async (classification_name) => {
          const exists = await invModel.checkExistingClassification(classification_name);
          if (exists) {
            throw new Error("Classification name already exists. Please use a different name.");
          }
        }),
    ];
  };

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkclassdata = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/addClassification", {
      errors,
      title: "Add classification",
      nav,
      classification_name,
    });
    return;
  }
  next();
};


/* ***************************
* Add Inventory Data Validation Rules
* *************************** */
validate.addInventoryRules = () => {
    return [
      body("classification_id")
        .isInt({ min: 1 })
        .withMessage("Please select a valid classification."),
  
      body("inv_make")
        .trim()
        .isLength({ min: 3 })
        .withMessage("Make must be at least 3 characters long."),
  
      body("inv_model")
        .trim()
        .isLength({ min: 3 })
        .withMessage("Model must be at least 3 characters long."),
  
      body("inv_year")
        .isInt({ min: 1900, max: 2100 })
        .withMessage("Enter a valid year. Must be between 1900 and 2100."),
  
      body("inv_description")
        .trim()
        .escape()
        .isLength({ min: 10 })
        .withMessage("Enter a vehicle description"),
  
      body("inv_price")
        .isFloat({ min: 0 })
        .withMessage("Enter a valid price."),
  
      // Custom check for image field, allowing default image value
      body("inv_image")
        .custom((value, { req }) => {
          // Skip validation if the default image is being used
          if (req.file || value !== '/images/vehicles/no-image.png') {
            return true; // If file is present or the value is different from the default, it's valid
          }
          if (!req.file && !value) {
            throw new Error("Image is required.");
          }
          return true;
        }),
  
      // Custom check for thumbnail field, allowing default thumbnail value
      body("inv_thumbnail")
        .custom((value, { req }) => {
          // Skip validation if the default thumbnail is being used
          if (req.file || value !== '/images/vehicles/no-image-tn.png') {
            return true; // If file is present or the value is different from the default, it's valid
          }
          if (!req.file && !value) {
            throw new Error("Thumbnail is required.");
          }
          return true;
        }),
  
      body("inv_miles")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Miles must be a non-negative integer."),
  
      body("inv_color")
        .trim()
        .isLength({ min: 3 })
        .withMessage("Color must be at least 3 characters long."),
    ];
  };
  
  /* ***************************
  * Check Add Inventory Validation and Return Errors or Continue
  * *************************** */
  validate.checkAddInventoryData = async (req, res, next) => {
    const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_price, inv_image, inv_thumbnail, inv_miles, inv_color } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav();
      const classifications = await invModel.getClassifications(); // Get classifications
      const classificationList = await utilities.buildClassificationList(classification_id); // Pass classification_id
      res.render("inventory/addInventory", {
        errors,
        title: "Add Inventory",
        nav,
        classifications: classifications.rows,
        classificationList, 
        classification_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_price,
        inv_image,
        inv_thumbnail,
        inv_miles,
        inv_color,
      });
      return;
    }
    next();
  };



/* ***************************
  * Check edit/update Inventory Validation and Return Errors to the edit view or Continue
  * *************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { inv_id, classification_id, inv_make, inv_model, inv_year, inv_description, inv_price, inv_image, inv_thumbnail, inv_miles, inv_color } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const classifications = await invModel.getClassifications(); // Get classifications
    const classificationList = await utilities.buildClassificationList(classification_id); // Pass classification_id
    res.render("inventory/editInventory", {
      errors,
      title: "Edit Inventory",
      nav,
      classifications: classifications.rows,
      classificationList, 
      inv_id,
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_price,
      inv_image,
      inv_thumbnail,
      inv_miles,
      inv_color,
    });
    return;
  }
  next();
};

module.exports = validate;