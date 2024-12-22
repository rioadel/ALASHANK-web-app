import { getResource, deleteResource, postData } from "../../../core/helpers/CRUD.js";

var bigUnitContainer = document.getElementById("big-unit-container");
var addUnitButton = document.getElementById("add-unit-id");
var addUnitForm = document.getElementById("add-unit-form-id");
var addUnitIcon = document.getElementById("add-unit-icon");
var deleteUnitForm = document.getElementById("delete-unit-form");

var deleteUnitIcon = document.getElementById("delete-unit-icon");
var deleteUnitButton = document.getElementById("delete-unit-button");
var cancelAddUnit = document.getElementById("cancel-add-unit-id");
var cancelDeleteUnit = document.getElementById("cancel-delete-unit-id");
const params = new URLSearchParams(window.location.search);
const transferedSectionID = params.get("id");

var units = [];
var unitsCounter = 1;




var regex = new RegExp(/(add Unit)|(delete unit)/i);
function createTabb(container, tabName, tabID) {
    if (container && tabName && tabID) {
        var tab = document.createElement("div");
        tab.classList.add("tabContainer");
        tab.id = tabID;
        var textDiv = document.createElement("div");
        textDiv.classList.add("tabText");
        textDiv.innerHTML = `<h2>${tabName}</h2>`;
        tab.appendChild(textDiv);
        container.insertBefore(tab, container.firstChild);
        return tab;
    }
    else {
        
    }

}

function createUnit(secName, secId) {
    var unit = createTabb(bigUnitContainer, secName, secId);
    units.push(unit);
    unitsCounter++;
    unit.addEventListener('click', function () {
        const tabId = this.id; 
        if (tabId) {
            window.location.href = `./lessons.html?id=${tabId}`;
        } else {
            console.warn("Tab does not have an ID. Skipping storage.");
        }
    });
    return unit;
}

addUnitButton.addEventListener("click", function () {
    addUnitForm.style.display = "none";
    var inputAddUnitName = document.getElementById("inputUnitName").value;
    if (regex.test(inputAddUnitName)) {
        
    } else {
        if (inputAddUnitName ) {
            addSection(inputAddUnitName, transferedSectionID);
        } else {
            
        }
    }
});

addUnitIcon.addEventListener("click", function () {
    deleteUnitForm.style.display = "none";
    addUnitForm.style.display = "block";
    addUnitForm.focus();
});

cancelAddUnit.addEventListener("click", function () {
    addUnitForm.style.display = "none";
})

deleteUnitButton.addEventListener("click", function (event) {
    event.preventDefault();
    deleteUnitForm.style.display = "none";
    deleteSection();
});

deleteUnitIcon.addEventListener("click", function () {
    addUnitForm.style.display = "none";
    deleteUnitForm.style.display = "block";
    deleteUnitForm.focus();
});


cancelDeleteUnit.addEventListener("click", function () {
    deleteUnitForm.style.display = "none";
})


// document.addEventListener("click", function (event) {
//     const addUnitForm = document.getElementById("add-unit-form-id");
//     if (addUnitForm.style.display === "block") {
//         if (!addUnitForm.contains(event.target) && event.target !== addUnitIcon) {
//             addUnitForm.style.display = "none";
//         }
//     }
// });

// document.addEventListener("click", function (event) {
//     var deleteUnitForm = document.getElementById("delete-unit-form");
//     if (deleteUnitForm.style.display === "block") {
//         if (!deleteUnitForm.contains(event.target) && event.target !== deleteUnitIcon) {
//             deleteUnitForm.style.display = "none";
//         }
//     }
// });

async function addSection(courseName, courseId) {
    try {
        
        const response = await postData('sections', { name: courseName, courseId: courseId });
        if (response?.status) {
            
            let secId = response.data.section.id ;
            
            
            createUnit(courseName,  secId);
            alert('Section is added successfully!');
        } else {
            alert(response?.message || 'Invalid course name or image upload.');
        }
    } catch (error) {
        console.error('Error adding course:', error);
        alert('An unexpected error occurred. Please try again.');
    }
}

// function editSection(id) {
//     const formData = new FormData();
//     const fileInput = document.getElementById('inputSectionfile');
//     
//     const data = {
//         "name": document.forms[2].elements[0].value,
//         "levelId": 1,
//     }
//     formData.append('logo', fileInput.files[0]);
//     formData.append('data', JSON.stringify(data));
//     for (const [key, value] of formData.entries()) {
//         
//     };
//     postFormData(`courses/${id}`, formData, 'PATCH').then((data) => {
//         if (data.status) {
//             const { course } = data.data;
//             const { id, name, imageUrl } = course;

//             LocalStorageHelper.setItem('course', { id, name, imageUrl });
//             
//             alert('Coures Added Successfully');
//         }
//         else {
//             alert(data.message || 'Invalid Name or Image');
//         }
//     });
// };

function deleteSection() {
    deleteResource(`courses/${transferedSectionID}`).then((data) => {
        if (data.status) {
            alert('Course deleted successfully');
            window.location.href = "./groups.html";
        }
        else {
            alert(data.message || "invalid course");
        }
    });
}


async function getUnitsAPI(courseID) {
    try {
        const res = getResource(`courses/${courseID}`).then((res) => {
            
            var course = res.course;
            var sections = course.sections;
            
            for (const item of sections) {
                
                createUnit(item.name, item.id);
            }
        });

        
    } catch (error) {
        console.error('Error in getSectionsAPI:', error.meessage);
        return [];
    }
}


window.onload = function () {
    if (window.location.href.includes(transferedSectionID) === false) {
        window.location.href += `#${transferedSectionID}`;
    }
    getUnitsAPI(transferedSectionID);
};