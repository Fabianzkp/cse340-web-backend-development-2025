const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}


/* ***************************
 *  Build inventory by detail view
 * ************************** */

invCont.buildByVehicleId = async function (req, res, next) {
  const inv_id = req.params.invId
  const vehicleData = await invModel.getVehicleByInvId(inv_id)
  // To ensure vehicleData is not empty
  if (!vehicleData || vehicleData.length === 0) {
    throw new Error("Vehicle not found.")
  }
  const drill = await utilities.buildVehicleView(vehicleData)
  let nav = await utilities.getNav()
  const vehicleName = `${vehicleData[0].inv_make} ${vehicleData[0].inv_model}`
  res.render("./inventory/vehicle", {
    title: vehicleName + " vehicles",
    nav,
    drill,
    errors: null,
  })
}

/* ***************************
 *  intentionally cause an error
 * ************************** */

invCont.causeError = async function (req, res, next) {
  console.log("Causing an error...");
  try {
      let aNumber = 1 / 0; // Simulated error
      throw new Error("This is an intentional error.");
  } catch (error) {
      next(error); // Pass the error to the next middleware
  }
};

/* ***************************
 *  build vehicle management view
 * ************************** */

invCont.buildVehicleManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/vehicleManagement", {
    title: "Vehicles Management",
    nav,
    errors: null,
  })
}

module.exports = invCont