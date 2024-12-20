import { LocalStorageHelper } from "../../../core/helpers/local_storage_helper.js";
import { postFormData } from "../../../core/helpers/CRUD.js";
console.log(LocalStorageHelper.getAllKeys());
initProfilePage();
function initProfilePage() {
    // fetching page values 
    let teacherName = document.forms[0].elements[0];
    let teacherUserName = document.forms[0].elements[1];
    let teacherMobile = document.forms[0].elements[2];
    let teacherImage = document.images[0];
    // changing values
    //name
    teacherName.value = LocalStorageHelper.getItem('teacher').name;
    //img
    var testImg = LocalStorageHelper.getItem('teacher').imageUrl.replace('http://51.68.175.80/', 'http://51.68.175.80/test/');
    console.log(testImg);
    teacherImage.src = testImg;
    //username
    teacherUserName.value = LocalStorageHelper.getItem('teacher').username;
    //mobile
    console.log(LocalStorageHelper.getItem('teacher').contacts);
    let { value } = LocalStorageHelper.getItem('teacher').contacts[0];
    teacherMobile.value = value;
}




function updateProfile() {
    const formData = new FormData();
    const fileInput = document.getElementById('homepageImage');
    console.log(fileInput.files[0]);
    const data = {
        "name": document.forms[0].elements[0].value,
        "username": document.forms[0].elements[1].value,
        "password": (document.forms[0].elements[3].value.length == 0) ? '328221' : document.forms[0].elements[3].value,
        "contacts": [
            {
                "name": "main phone",
                "value": document.forms[0].elements[2].value
            }
        ]
    }
    formData.append('image', fileInput.files[0]);
    formData.append('data', JSON.stringify(data));
    for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
    };
    postFormData('teachers/me', formData, 'PATCH').then((data) => {
        if (data.status) {
            const { token, teacher } = data.data;
            console.log(token);
            const { id, name, username, contacts, imageUrl } = teacher;
            LocalStorageHelper.setItem('token', token);
            LocalStorageHelper.setItem('teacher', { id, name, username, contacts, imageUrl });
            console.log(LocalStorageHelper.getAllKeys());
            alert('Profile Updated Successfully');
        }
        else {
            alert(data.message || 'Invalid Email or Password');
        }
    });
}


document.getElementById('homepageImage').addEventListener('change', (event) => {
    const file = event.target.files[0]; // Get the selected file
    const previewImage = document.getElementById('previewImage');

    // Validate that a file is selected
    if (file) {
        // Validate the file type (optional)
        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validImageTypes.includes(file.type)) {
            alert('Please upload a valid image (JPEG, PNG, or GIF).');
            previewImage.style.display = 'none';
            return;
        }

        // Use FileReader to read the file and update the image preview
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImage.src = e.target.result; // Set the image preview
            previewImage.style.display = 'block'; // Make the image visible
        };
        reader.readAsDataURL(file);
    } else {
        previewImage.style.display = 'none'; // Hide the image if no file is selected
    }
});




document.forms[0].addEventListener('submit', (event) => {
    event.preventDefault();
    updateProfile();
});