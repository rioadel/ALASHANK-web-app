import { postData } from "../core/helpers/CRUD.js";
import { LocalStorageHelper } from "../core/helpers/local_storage_helper.js";


const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");

// Regular expressions for validation
const passwordRegex = /^[A-Za-z0-9]+$/; // Letters and numbers only
const nameRegex = /^([A-Za-z\s]||_)+$/; // Letters and spaces only

// Form elements
// const signUpForm = document.getElementById("sign-up-form");
const signInForm = document.getElementById("sign-in-form");

const signInUserName = document.getElementById("sign-in-username");
const signInPassword = document.getElementById("sign-in-password");


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

        const { id, name, username, contacts, imageUrl } = teacher;
        LocalStorageHelper.setItem('token', token);
        LocalStorageHelper.setItem('teacher', { id, name, username, contacts, imageUrl });

        window.location.href = "Dashboard Design Rana/index.html";
      }
      else {
        alert(data.message || 'Invalid Email or Password');
      }
    });
  }
});
