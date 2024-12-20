import { postData } from "../core/helpers/CRUD.js";
import { LocalStorageHelper } from "../core/helpers/local_storage_helper.js";

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
const nameRegex = /^([A-Za-z\s]||_)+$/; // Letters and spaces only

// Form elements
const signUpForm = document.getElementById("sign-up-form");
const signInForm = document.getElementById("sign-in-form");

const signUpName = document.getElementById("user");
const signUpEmail = document.getElementById("Email");
const signUpPassword = document.getElementById("password");

const signInUserName = document.getElementById("sign-in-username");
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
  if (!nameRegex.test(signInUserName.value)) {
    alert("Invalid Username! Please enter a valid Username address.");
    isValid = false;
  }

  // Validate Password
  if (!passwordRegex.test(signInPassword.value)) {
    alert("Invalid Password! Password must contain only letters and numbers.");
    isValid = false;
  }

  // Redirect if all data is valid
  if (isValid) {
    postData('teachers/login', { username: signInUserName.value, password: signInPassword.value }).then((data) => {
      if (data.status) {
         // Extract only the necessary data
         const { token, teacher } = data.data;
         console.log(token);
         const { id, name,username,contacts, imageUrl } = teacher;
         LocalStorageHelper.setItem('token', token);
         LocalStorageHelper.setItem('teacher', { id, name,username,contacts, imageUrl });
         console.log(LocalStorageHelper.getAllKeys());
         window.location.href = "Dashboard Design Rana/index.html";
      }
      else {
        alert(data.message || 'Invalid Email or Password');
      }
    });
  }
});
