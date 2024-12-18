// import { postData } from "./../core/CRUD.js";

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
        console.log('hello');
        window.location.href = "Dashboard Design Rana/index.html";
        
      }
      else {
        alert(data.message || 'Invalid Email or Password');
      }
    });

  }
});

const apiBaseUrl = 'http://51.68.175.80/test/api';
const apiKey = 'ac67edbe1ce9c1da5a5b3eb0fd682ea2';
const headers = {
    'Content-Type': 'application/json',
    'api-key': apiKey,
}
// Creat
async function postData(endpointUrl, resource) {
    try {
        const response = await fetch(`${apiBaseUrl}/${endpointUrl}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(resource),
        });
        const data = await response.json();
        if (!response.ok) {
            return { status:false, message: data.message};    
        }
        else {
            return { status:true,data:response.data };
        }
    } catch (error) {
        console.error('Error creating resource:', error);
        throw error;
    }
}