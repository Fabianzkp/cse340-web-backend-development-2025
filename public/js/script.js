document.addEventListener("DOMContentLoaded", () => {

    // Registration password toggle
    const passwordButton = document.querySelector(".passwordButton");
    if (passwordButton) {
        passwordButton.addEventListener("click", function () {
            const passwordInput = document.getElementById("account_password");
            const currentType = passwordInput.getAttribute("type");
            if (currentType === "password") {
                passwordInput.setAttribute("type", "text");
                passwordButton.innerHTML = "Hide Password";
            } else {
                passwordInput.setAttribute("type", "password");
                passwordButton.innerHTML = "Show Password";
            }
        });
    }

    // Login password toggle
    const loginPasswordButton = document.querySelector(".passwordButton-login");
    if (loginPasswordButton) {
        loginPasswordButton.addEventListener("click", function () {
            const passwordInput = document.getElementById("password");
            const currentType = passwordInput.getAttribute("type");
            if (currentType === "password") {
                passwordInput.setAttribute("type", "text");
                loginPasswordButton.innerHTML = "Hide Password";
            } else {
                passwordInput.setAttribute("type", "password");
                loginPasswordButton.innerHTML = "Show Password";
            }
        });
    }

});
