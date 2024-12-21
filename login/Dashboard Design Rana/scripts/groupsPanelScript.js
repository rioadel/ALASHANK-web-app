import { LocalStorageHelper } from "../../../core/helpers/local_storage_helper.js";
import { postFormData, getResource,deleteResource } from "../../../core/helpers/CRUD.js";

var bigSectionContainer = document.getElementById("big-section-container");
var addSectionButton = document.getElementById("add-section-id");
var addSectionForm = document.getElementById("add-section-form-id");
var addSectionIcon = document.getElementById("add-section-icon");
var deleteSectionForm = document.getElementById("delete-section-form");

var deleteSectionIcon = document.getElementById("delete-section-icon");
var deleteSectionButton = document.getElementById("delete-section-button");
var inputDeleteSectionName = document.getElementById("input-delete-section-name");
var cancelAddSection = document.getElementById("cancel-add-section-id");
var cancelDeleteSection = document.getElementById("cancel-delete-section-id");
var editSectionIcon = document.getElementById("edit-section-icon");
var editSectionForm = document.getElementById("edit-section-form");

// var sectionsContainer = document.getElementById("sections-container");

var currentSection;
var sections = [];
var sectionsCounter = 1;
var imageCounter = 2;
var images = [];

var regex = new RegExp(/(add Section)|(delete section)|(add Group)|(delete Group)|(edit Section)|(edit Group) )/i);
function createTab(container, tabName, tabID, tabColor, tabImageUrl) {
    if (container && tabName && tabID && tabColor && tabImageUrl) {
        var tab = document.createElement("div");
        tab.classList.add("tabContainer");
        tab.id = tabID;
        tab.style.backgroundColor = tabColor;
        if (tabColor == "#000000") {
            tab.style.color = "#ffffff";
        }
        var textDiv = document.createElement("div");
        textDiv.classList.add("tabText");
        textDiv.innerHTML = `<h2>${tabName}</h2>`;
        tab.appendChild(textDiv);
    
        var imageDiv = document.createElement("div");
        imageDiv.classList.add("tabImage");
        imageDiv.innerHTML = `<img src="${tabImageUrl}" alt="${tabName}">`;
        tab.appendChild(imageDiv);
    
        container.insertBefore(tab, container.firstChild);        
        return tab;
    }
    else {
        console.log("Can't create tab");
    }
    
}

function createSection(secName, secColor, secImageUrl) {
    
    var section = createTab(bigSectionContainer, secName, "section-" + sectionsCounter, secColor, secImageUrl);
    // localStorage.setItem("gName" + sectionsCounter, secName);
    // localStorage.setItem("gColor" + sectionsCounter, secColor);
    // localStorage.setItem("gImage" + sectionsCounter, secImageUrl);
    localStorage.setItem(`section-${sectionsCounter}`, JSON.stringify({
        id: `section-${sectionsCounter}`,
        name: secName,
        color: secColor,
        image: secImageUrl
    }))
    images.push(document.images[1+sectionsCounter]);
    sections.push(section);
    sectionsCounter++;
    section.addEventListener('click',function (event) {
        window.location.href = "./units.html";
        currentSection = event.target;
    });
    return section;
}

function searchForTabName(tabs, tabName) {
    var tabfound;
    tabs.forEach(function (tab) {
        var tabText = tab.querySelector(".tabText h2").innerHTML;
        if (tabText.trim() === tabName.trim()) {
            tabfound = tab;
        }
    });
    return  tabfound;
}

addSectionButton.addEventListener("click", function () {
    
    addSectionForm.style.display = "none";
    
    var inputAddSectionName = document.getElementById("inputSectionName").value;
    var inputAddSectionColor = document.getElementById("inputSectionColor").value;
    var fileInput = document.getElementById("inputSectionfile");
    var inputAddSectionImageUrl = fileInput.files.length ? URL.createObjectURL(fileInput.files[0]) : "../Resources/prepBoy3.png";
    
    if (regex.test(inputAddSectionName)) {
        console.log("you can't add this tab, please change tab name");
    } else {
        if (inputAddSectionName && inputAddSectionColor) {
            addCourse();
            createSection(inputAddSectionName, inputAddSectionColor, inputAddSectionImageUrl);
        } else {
            console.log("Please fill in all required fields.");
        }
    }
});

addSectionIcon.addEventListener("click", function () {
    addSectionForm.focus();
    deleteSectionForm.style.display = "none";
    addSectionForm.style.display = "block";
    editSectionForm.style.display="none";
});

cancelAddSection.addEventListener("click", function () {
    addSectionForm.style.display = "none";
})

deleteSectionButton.addEventListener("click", function (event) { 
    event.preventDefault();
    deleteSectionForm.style.display = "none";
    var deletedSectionName = inputDeleteSectionName.value;
    deleteSection(deletedSectionName);
});

deleteSectionIcon.addEventListener("click", function () { 
    deleteSectionForm.focus();
    addSectionForm.style.display = "none";
    deleteSectionForm.style.display = "block";
    editSectionForm.style.display = "none";
});

function deleteSection(sectionName) {    
        var section = searchForTabName(sections,sectionName);
        
        if (section) {
            section.remove();
            localStorage.removeItem(sectionName);
            deleteCourse(section.id.split('-')[1]);
            // var tabIndex = section.id.split("-")[1] - 1;
            // sections.splice(tabIndex, 1);
            // localStorage.removeItem("gName" + tabIndex);
            // localStorage.removeItem("gColor" + tabIndex);
            // localStorage.removeItem("gImage" + tabIndex);
            console.log(`${sectionName} has been deleted.`);
        }
        else {
            console.log(`${sectionName} not found.`);
        }
}

cancelDeleteSection.addEventListener("click", function () {
    deleteSectionForm.style.display = "none";
})

function editTab(container, tabName, newName="", newColor="", newImageUrl="") {
    var tab = searchForTabName(container, tabName);
    if (tab) {
        if (newName != "") {
            tab.querySelector("h2").innerHTML = newName;
    
        }
        if (newColor !=  "#000000") {
            tab.style.backgroundColor = newColor;
            if (newColor != "black") {
                tab.style.color = "white";
            }
        }
        if (newImageUrl != "") {
            newImageUrl = URL.createObjectURL(fileInput.files[0])
            tab.querySelector("img").src = newImageUrl;  
        }
        return tab;
    }
}

function editSection(sectionName, newName = "", newColor = "", newImageUrl = "") {
    var tab = editTab(sections, sectionName, newName, newColor, newImageUrl);
    var id = tab.id.split('-')[1];
    localStorage.setItem(secName, JSON.stringify({
        id: tab.id,
        name: newName,
        color: newColor,
        image: newImageUrl
    }))
    editCourse(id);
    // localStorage.setItem("gName" + id, newName);
    // localStorage.setItem("gColor"+ id, newColor);
    // localStorage.setItem("gImage"+ id, newImageUrl);
}

document.addEventListener("click", function (event) {
    const addSectionForm = document.getElementById("add-section-form-id");
    
    if (addSectionForm.style.display === "block") {
        if (!addSectionForm.contains(event.target) && event.target !== addSectionIcon) {
            addSectionForm.style.display = "none";
        }
    }
});

document.addEventListener("click", function (event) {
    
    var deleteSectionForm = document.getElementById("delete-section-form");
    if (deleteSectionForm.style.display === "block") {
        if (!deleteSectionForm.contains(event.target) && event.target !== deleteSectionIcon) {
            deleteSectionForm.style.display = "none";
        }
    }
});

document.addEventListener("click", function (event) {
    
    var editSectionForm = document.getElementById("edit-section-form");
    if (editSectionForm.style.display === "block") {
        if (!editSectionForm.contains(event.target) && event.target !== editSectionIcon) {
            editSectionForm.style.display = "none";
        }
    }
});

editSectionIcon.addEventListener("click", function () {
    editSectionForm.focus();
    editSectionForm.style.display = "block";
    addSectionForm.style.display = "none";
    deleteSectionForm.style.display = "none";
});

var editSectionForm = document.getElementById("edit-section-form");
var inputEditSectionName = document.getElementById("input-edit-section-name");
var inputEditedSectionName = document.getElementById("input-edited-section-name-id");
var inputEditedSectionColor = document.getElementById("input-edited-section-color-id");
var inputEditedSectionImage = document.getElementById("input-edited-section-image-id");
var inputEditedSectionNameCheckbox = document.getElementById("input-edit-name-id");
var inputEditedSectionColorCheckbox = document.getElementById("input-edit-color-id");
var inputEditedSectionImageCheckbox = document.getElementById("input-edit-image-id");

inputEditSectionName.onfocus = function () {
    this.style.border = "1px solid gray";
};

inputEditSectionName.onblur = function () {
    var tab = searchForTabName(sections, this.value.trim());

    if (tab) {
        this.style.borderColor = "green"; 
    } else {
        this.style.borderColor = "red"; 
    }
};

inputEditedSectionNameCheckbox.onchange = function (event) {
    if (event.target.checked && inputEditSectionName.style.borderColor === "green") {
        inputEditedSectionName.removeAttribute("disabled");
    } else {
        inputEditedSectionName.setAttribute("disabled", "disabled");
    }
};

inputEditedSectionColorCheckbox.onchange = function (event) {
    if (event.target.checked && inputEditSectionName.style.borderColor === "green") {
        inputEditedSectionColor.removeAttribute("disabled");
    } else {
        inputEditedSectionColor.setAttribute("disabled", "disabled");
    }
};

inputEditedSectionImageCheckbox.onchange = function (event) {
    if (event.target.checked && inputEditSectionName.style.borderColor === "green") {
        inputEditedSectionImage.removeAttribute("disabled");
    } else {
        inputEditedSectionImage.setAttribute("disabled", "disabled");
    }
};

var editSectionButton = document.getElementById("edit-section-button-id");
editSectionButton.addEventListener('click', function (event) {
    event.preventDefault();
    editSection(inputEditSectionName.value, inputEditedSectionName.value, inputEditedSectionColor.value, inputEditedSectionImage.value);
})

var cancelEditSectionButton = document.getElementById("cancel-edit-section-id");
cancelEditSectionButton.addEventListener("click", function (event) {
    event.preventDefault();
    editSectionForm.style.display = "none";
})

function getRandomHexColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

async function getSectionsAPI() {
            try {
                const res = await getResource('courses/');
                var courses = res.courses;
                console.log('Fetched sections:', courses);
                for (const item of courses) {
                    createSection(item.name, getRandomHexColor, item.logoUrl);
                }
                return courses; // Return the list of sections
            } catch (error) {
                console.error('Error in getSectionsAPI:', error);
                return [];
            }
        }
async function addCourse() {
    try {
        

        // Create a FormData instance
        const formData = new FormData();

        // Get the file input element
        const fileInput = document.getElementById('inputSectionfile');
        if (!fileInput || !fileInput.files[0]) {
            alert('Please upload a file.');
            return;
        }

        // Prepare the `data` object
        const courseName = document.forms[0]?.elements[0]?.value;
        if (!courseName) {
            alert('Course name is required.');
            return;
        }

        const data = {
            "name": courseName,
            "levelId": 1
        };

        // Append the file and JSON data to FormData
        formData.append('logoUrl', fileInput.files[0]);
        formData.append('data', JSON.stringify(data));

        // Debugging: Log FormData contents
        for (const [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }

        // Post the FormData
        const response = await postFormData('courses/', formData, 'POST');
        if (response?.status) {
            // Extract course details
            const { course } = response.data;
            const { id, name, imageUrl } = course;

            // Save the course details to local storage
            LocalStorageHelper.setItem('course', { id, name, imageUrl });
            console.log('Local Storage Keys:', LocalStorageHelper.getAllKeys());

            // Notify user
            alert('Course added successfully!');
        } else {
            // Handle errors gracefully
            alert(response?.message || 'Invalid course name or image upload.');
        }

    } catch (error) {
        // Catch and log errors for debugging
        console.error('Error adding course:', error);
        alert('An unexpected error occurred. Please try again.');
    }
}


function editCourse(id) {
    const formData = new FormData();
    const fileInput = document.getElementById('inputSectionfile');
    console.log(fileInput.files[0]);
    const data = {
        "name": document.forms[2].elements[0].value,
        "levelId": 1,
    }
    formData.append('logoUrl', fileInput.files[0]);
    formData.append('data', JSON.stringify(data));
    for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
    };
    postFormData(`courses/${id}`, formData, 'PATCH').then((data) => {
        if (data.status) {
            const {  course } = data.data;
            const { id, name, imageUrl } = course;

            LocalStorageHelper.setItem('course', { id, name, imageUrl });
            console.log(LocalStorageHelper.getAllKeys());
            alert('Coures Added Successfully');
        }
        else {
            alert(data.message || 'Invalid Name or Image');
        }
    });
};

function deleteCourse(id) {
    deleteResource(`courses/${id}`).then((data) => {
        if (data.status) {
            alert('Course deleted successfully');
        }
        else {
            alert(data.message || "invalid course");
        }
    });
}


window.onload = function () {
    getSectionsAPI().then((courses) => {
        console.log('Courses:', courses);
    })
};
