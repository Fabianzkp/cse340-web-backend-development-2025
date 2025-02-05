// Needed Resources 
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")

// Route to display the login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route to display the registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Route to handle registration form submission
router.post('/register', utilities.handleErrors(accountController.registerAccount))

module.exports = router;