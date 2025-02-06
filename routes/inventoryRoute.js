// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const datavalidate = require('../utilities/inventory-validation');


// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByVehicleId))

// Route to cause 500 type error
router.get("/error", utilities.handleErrors(invController.causeError));

// Route to build vehicle management view
router.get("/", utilities.handleErrors(invController.buildVehicleManagement))

// Route to build add classification view
router.get("/addClassification", utilities.handleErrors(invController.buildAddClassification))

// Route to process add classification form data
router.post("/addClassification", datavalidate.classificationRules(), datavalidate.checkclassdata, utilities.handleErrors(invController.buildAddClassificationName))

// Display the add inventory form
router.get("/addInventory", utilities.handleErrors(invController.buildAddInventory))

// Handle the form submission for adding inventory
router.post("/addInventory", datavalidate.addInventoryRules(), datavalidate.checkAddInventoryData, utilities.handleErrors(invController.buildAddInventoryItem))


module.exports = router;