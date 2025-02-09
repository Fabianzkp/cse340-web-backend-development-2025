// Needed Resources 
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/");
const accountController = require("../controllers/accountController");
const regValidate = require('../utilities/account-validation');

// Route to display the login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to display the registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// Route to display the account management view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement));

// Route to handle logout
router.get("/logout", accountController.logout);

// Route to display the update account information view
router.get("/update/:accountId", utilities.checkLogin, utilities.handleErrors(accountController.buildUpdateAccountView));


// Route to handle account update
router.post(
  "/update",
  utilities.checkLogin,
  regValidate.updateAccountRules(),
  regValidate.checkUpdateAccountData,
  utilities.handleErrors(accountController.updateAccount)
);

// Route to handle password change
router.post(
  "/change-password",
  regValidate.changePasswordRules(),
  regValidate.checkChangePasswordData,
  utilities.handleErrors(accountController.changePassword)
);



module.exports = router;