const utilities = require("../utilities/")
const accountModel = require("../models/accountModel");
const bcrypt = require("bcryptjs")

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin (req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    errors: null,
    title: "Login",
    nav,
  })
}


/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        errors: null,
        title: "Register",
        nav,
    })
  }


  /* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body
  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )
  
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you're registered ${account_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        errors: null,
        title: "Login",
        nav,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        errors: null,
        title: "Registration",
        nav,
        
      })
    }
  }

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
    let nav = await utilities.getNav();
    const { account_email, account_password } = req.body;

    // Fetch user by email
    const accountData = await accountModel.getAccountByEmail(account_email);
    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.");
        return res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email: account_email,  // Pass the entered email back
        });
    }

    // Compare hashed password
    try {
        const isPasswordValid = await bcrypt.compare(account_password, accountData.account_password);
        if (isPasswordValid) {
            delete accountData.account_password;

            // Create JWT token
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 });
            if (process.env.NODE_ENV === 'development') {
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
            } else {
                res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 });
            }

            return res.redirect("./");
        } else {
            req.flash("notice", "Incorrect email or password.");
            return res.status(400).render("account/login", {
                title: "Login",
                nav,
                errors: null,
                account_email: account_email,  // Pass the entered email back
            });
        }
    } catch (error) {
        console.log('Error during login:', error);
        req.flash("notice", "An error occurred. Please try again.");
        return res.status(500).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email: account_email,  // Pass the entered email back
        });
    }
}

  


module.exports = {buildLogin, buildRegister, registerAccount, accountLogin}