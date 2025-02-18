// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const datavalidate = require('../utilities/inventory-validation');
const maintenanceController = require("../controllers/maintenanceController");
const maintenanceValidate = require("../utilities/maintenance-validation");

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByVehicleId))

// Route to cause 500 type error
router.get("/error", utilities.handleErrors(invController.causeError));

// Route to build vehicle management view
router.get("/", utilities.checkLogin, utilities.handleErrors(invController.buildVehicleManagement))

// Route to build add classification view
router.get("/addClassification", utilities.handleErrors(invController.buildAddClassification))

// Route to process add classification form data
router.post("/addClassification", datavalidate.classificationRules(), datavalidate.checkclassdata, utilities.handleErrors(invController.buildAddClassificationName))

// Display the add inventory form
router.get("/addInventory", utilities.handleErrors(invController.buildAddInventory))

// Handle the form submission for adding inventory
router.post("/addInventory", datavalidate.addInventoryRules(), datavalidate.checkAddInventoryData, utilities.handleErrors(invController.buildAddInventoryItem))

// Display the edit inventory
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Display the edit inventory
router.get("/edit/:inv_id", utilities.handleErrors(invController.buildEditInventoryView))

// Handle the form submission for editing/updating inventory 
router.post("/update/:inv_id", datavalidate.addInventoryRules(), datavalidate.checkUpdateData, utilities.handleErrors(invController.updateInventory))

// Display the delete inventory and confirmation
router.get("/delete/:inv_id", utilities.handleErrors(invController.buildDeleteInventory))

// Handle the form submission for deleting inventory
router.post("/delete/:inv_id", utilities.handleErrors(invController.deleteInventory))   


// Route to view maintenance records
router.get("/maintenance/:inv_id", utilities.checkLogin, utilities.handleErrors(maintenanceController.viewMaintenanceRecords));

// Route to add maintenance record
router.post("/maintenance/add", utilities.checkLogin, maintenanceValidate.maintenanceRules(), 
maintenanceValidate.checkMaintenanceData, utilities.handleErrors(maintenanceController.addMaintenanceRecord));

module.exports = router;