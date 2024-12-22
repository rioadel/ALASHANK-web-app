import { postFormData, getResource} from "../../../core/helpers/CRUD.js";

var bigSectionContainer = document.getElementById("big-section-container");
var addSectionButton = document.getElementById("add-section-id");
var addSectionForm = document.getElementById("add-section-form-id");
var addSectionIcon = document.getElementById("add-section-icon");
var cancelAddSection = document.getElementById("cancel-add-section-id");

var sections = [];
var sectionsCounter = 1;

var regex = new RegExp(/(add Section)|(delete section)/i);


function createTab(container, tabName, tabID, tabImageUrl) {
    tabImageUrl = tabImageUrl ?? "./imgs/activity-02.png";
    if (tabImageUrl.includes('http://51.68.175.80/')) {
        tabImageUrl= tabImageUrl.replace('http://51.68.175.80/', 'http://51.68.175.80/test/');
    }
    if (container && tabName && tabID){
        var tab = document.createElement("div");
        tab.classList.add("tabContainer");
        tab.id = tabID;

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


function createSection(secName, secImageUrl, secId) {

    var section = createTab(bigSectionContainer, secName, secId, secImageUrl);
    sections.push(section);
    sectionsCounter++;
    section.addEventListener('click', function () {
        const tabId = this.id; 
        if (tabId) {
            window.location.href = "./units.html";
        } else {
            console.warn("Tab does not have an ID. Skipping storage.");
        }
    });
    return section;
}

addSectionButton.addEventListener("click", function () {

    addSectionForm.style.display = "none";

    var inputAddSectionName = document.getElementById("inputSectionName").value;
    var fileInput = document.getElementById("inputSectionfile");
    var inputAddSectionImageUrl = fileInput.files.length ? URL.createObjectURL(fileInput.files[0]) : "../Resources/prepBoy3.png";

    if (regex.test(inputAddSectionName)) {
        console.log("you can't add this tab, please change tab name");
    } else {
        if (inputAddSectionName) {
            addCourse();
        } else {
            console.log("Please fill in all required fields.");
        }
    }
});


addSectionIcon.addEventListener("click", function () {
    addSectionForm.focus();
    addSectionForm.style.display = "block";
});

cancelAddSection.addEventListener("click", function () {
    addSectionForm.style.display = "none";
})



document.addEventListener("click", function (event) {
    const addSectionForm = document.getElementById("add-section-form-id");

    if (addSectionForm.style.display === "block") {
        if (!addSectionForm.contains(event.target) && event.target !== addSectionIcon) {
            addSectionForm.style.display = "none";
        }
    }
});

async function getCoursesAPI() {
    try {
    const res = await getResource('courses?teacherId=4742');
    var courses = res.courses;
    for (const item of courses) {

        createSection(item.name, item.logoUrl, item.id);
    }
    return courses;
    } catch (error) {
        console.error('Error in getSectionsAPI:', error.meessage);
        return [];
    }
}

async function addCourse() {
    try {
        const formData = new FormData();
        const fileInput = document.getElementById('inputSectionfile');
        if (!fileInput || !fileInput.files[0]) {
            alert('Please upload a file.');
            return;
        }
        const courseName = document.forms[0]?.elements[0]?.value;
        if (!courseName) {
            alert('Course name is required.');
            return;
        }
        const data = {
            "name": courseName,
            "levelId": 1
        };
        formData.append('logo', fileInput.files[0]);
        formData.append('data', JSON.stringify(data));
        
        const response = await postFormData('courses/', formData, 'POST');
        if (response?.status) {
            const { course } = response.data;
            const { id, name, imageUrl: logoUrl } = course;
            createSection(name, logoUrl,id);
            alert('Course added successfully!');
        } else {
            alert(response?.message || 'Invalid course name or image upload.');
        }
    } catch (error) {
        console.error('Error adding course:', error);
        alert('An unexpected error occurred. Please try again.');
    }
}


window.onload = function () {
    getCoursesAPI();
};
