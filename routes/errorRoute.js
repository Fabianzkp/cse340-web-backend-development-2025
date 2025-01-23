// // /* *****This is another way to achieve the error handling***** */
// // /* *****If I want to do it by creating a new file.***** */
// // /* *****I did not use this way because I already created the error***** */
// // /* *****Route in the inventoryRoute file***** */

// // Needed resources
// const express = require("express");
// const router = new express.Router();
// const intentionalErrorController = require("../controllers/errorController");
// const utilities = require("../utilities");
 
// // Middleware causes an error
// router.use("/", utilities.handleErrors(async (req, res, next) => {
//     // throw new Error("Middleware intentionally throwing an exception") // This line is to allow controller to cause the error
//     next();
// }));
 
// // Route to cause 500 type error
// router.get("/", utilities.handleErrors(intentionalErrorController.causeError));
 
// module.exports = router;