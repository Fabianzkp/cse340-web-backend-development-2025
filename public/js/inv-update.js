document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector("#updateForm");
    const updateBtn = document.querySelector("#submit");
    let originalFormData = {}; // Store original form data

    if (form && updateBtn) {
        // 1. Store Original Form Data:
        storeOriginalFormData(form, originalFormData);

        // 2. Event Listeners:
        form.addEventListener("input", function () {
            compareFormData(form, originalFormData, updateBtn);
        });

        form.addEventListener("change", function () {
           compareFormData(form, originalFormData, updateBtn);
        });

        updateBtn.setAttribute("disabled", "true"); // Initial disabled state

    } else {
        console.warn("Form or button not found. Check your HTML.");
    }



    function storeOriginalFormData(form, originalFormData) {
        const formData = new FormData(form);
        for (let [key, value] of formData.entries()) {
            originalFormData[key] = value;
        }
    }

    function compareFormData(form, originalFormData, updateBtn) {
        const currentFormData = new FormData(form);
        let hasChanged = false;

        for (let [key, value] of currentFormData.entries()) {
            if (originalFormData[key] !== value) {
                hasChanged = true;
                break; // Exit loop early if a change is found
            }
        }

        if (hasChanged) {
            updateBtn.removeAttribute("disabled");
        } else {
            updateBtn.setAttribute("disabled", "true");
        }
    }
});