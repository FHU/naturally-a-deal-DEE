
const form = document.getElementById("signup-form");

const steps = document.querySelectorAll(".form-step");

const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const submitBtn = document.getElementById("submit-btn");

let currentStep = 0;

// Display the current form section
function showStep(step) {
    steps.forEach((section, index) => {
        section.classList.toggle("hidden", index !== step);
    });

    // Disable Previous on the first section
    prevBtn.disabled = step === 0;

    // Hide Next on the last section
    nextBtn.disabled = step === steps.length - 1

    // Show Sign Up on the last section
    submitBtn.classList.toggle("hidden", step !== steps.length - 1);
}

// Check required fields in the current section
function validateStep() {
    const currentSection = steps[currentStep];
    const inputs = currentSection.querySelectorAll(
        "input, select"
    );

    for (const input of inputs) {
        if (!input.checkValidity()) {
            input.reportValidity();
            return false;
        }
    }

    return true;
}

// Next button
nextBtn.addEventListener("click", () => {
    if (!validateStep()) return;

    if (currentStep < steps.length - 1) {
        currentStep++;
        showStep(currentStep);
    }
});

// Previous button
prevBtn.addEventListener("click", () => {
    if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
    }
});

// Initialize the form
showStep(currentStep);
