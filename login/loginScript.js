const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");

signUpButton.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

signInButton.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});

// Regular expressions for validation
const emailRegex = /.+@.+\..+/; // Simple email pattern
const passwordRegex = /^[A-Za-z0-9]+$/; // Letters and numbers only
const nameRegex = /^[A-Za-z\s]+$/; // Letters and spaces only

// Form elements
const signUpForm = document.getElementById("sign-up-form");
const signInForm = document.getElementById("sign-in-form");

const signUpName = document.getElementById("user");
const signUpEmail = document.getElementById("Email");
const signUpPassword = document.getElementById("password");

const signInEmail = document.getElementById("sign-in-email");
const signInPassword = document.getElementById("sign-in-password");

// Handle Sign Up Form submission
signUpForm.addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent form submission
  let isValid = true;

  // Validate Name
  if (!nameRegex.test(signUpName.value)) {
    alert("Invalid Name! Only letters and spaces are allowed.");
    isValid = false;
  }

  // Validate Email
  if (!emailRegex.test(signUpEmail.value)) {
    alert("Invalid Email! Please enter a valid email address.");
    isValid = false;
  }

  // Validate Password
  if (!passwordRegex.test(signUpPassword.value)) {
    alert("Invalid Password! Password must contain only letters and numbers.");
    isValid = false;
  }

  // Redirect if all data is valid
  if (isValid) {
    window.location.href = "Dashboard Design Rana/index.html"; // Redirect to inde.html if valid
  }
});

// Handle Sign In Form submission
signInForm.addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent form submission
  let isValid = true;

  // Validate Email
  if (!emailRegex.test(signInEmail.value)) {
    alert("Invalid Email! Please enter a valid email address.");
    isValid = false;
  }

  // Validate Password
  if (!passwordRegex.test(signInPassword.value)) {
    alert("Invalid Password! Password must contain only letters and numbers.");
    isValid = false;
  }

  // Redirect if all data is valid
  if (isValid) {
    window.location.href = "Dashboard Design Rana/index.html"; // Redirect to inde.html if valid
  }
});
