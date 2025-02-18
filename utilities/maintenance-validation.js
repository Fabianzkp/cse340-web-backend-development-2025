const { body, validationResult } = require('express-validator');
const maintenanceModel = require("../models/maintenanceModel");
const utilities = require("../utilities");

const validate = {};

/* *******************************
 *  Maintenance Record Validation Rules
 * ******************************* */
validate.maintenanceRules = () => {
  return [
    body('maintenance_date')
      .isDate()
      .withMessage('Please enter a valid date.'),

    body('description')
      .notEmpty()
      .withMessage('Description is required.'),

    body('cost')
      .isFloat({ min: 0 })
      .withMessage('Cost must be a positive number.')
  ];
};

/* ************************************
 * Check data and return errors or proceed to add maintenance record
 * *********************************** */
validate.checkMaintenanceData = async (req, res, next) => {
    const { maintenance_date, description, cost, inv_id } = req.body; 
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const nav = await utilities.getNav();
        const records = await maintenanceModel.getMaintenanceRecordsByVehicle(inv_id);

        return res.render("inventory/maintenanceRecords", {
            errors: errors,
            title: "Maintenance Records",
            nav,
            maintenance_date: req.body.maintenance_date,
            description: req.body.description,
            cost: req.body.cost,
            records, 
            inv_id: req.body.inv_id
        });
    }
    next();
};

module.exports = validate;