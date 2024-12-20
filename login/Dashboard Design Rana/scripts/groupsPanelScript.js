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

var regex = new RegExp(/(add Section)|(delete section)/i);
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
    localStorage.setItem("gName" + sectionsCounter, secName);
    localStorage.setItem("gColor" + sectionsCounter, secColor);
    localStorage.setItem("gImage" + sectionsCounter, secImageUrl);
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
            var tabIndex = section.id.split("-")[1] - 1;
            sections.splice(tabIndex, 1);
            localStorage.removeItem("gName" + tabIndex);
            localStorage.removeItem("gColor" + tabIndex);
            localStorage.removeItem("gImage" + tabIndex);
            console.log(`Section "${sectionName}" has been deleted.`);
        }
        else {
            console.log(`Section "${sectionName}" not found.`);
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
    localStorage.setItem("gName" + id, newName);
    localStorage.setItem("gColor"+ id, newColor);
    localStorage.setItem("gImage"+ id, newImageUrl);
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

window.onload = function () {
    var gName = [], gColor = [], gImage = [];
    if (localStorage.length > 0) {
        for(let x in localStorage){
            if (x.startsWith("gName")) {
                gName.push(localStorage[x])
            }
            else if (x.startsWith("gColor")) {
                gColor.push(localStorage[x]);
            }
            // Check for group image
            else if (x.startsWith("gImage")) {
                gImage.push(localStorage[x]) ;
            }
        }
    }
    for (let i = 0; i < gName.length; i++) {
        createSection(gName[i], gColor[i], gImage[i]);        
    }
};



// class GroupInfo{
//     constructor() {
//         this.section = currentSection;
//         this.id = currentSection.id;
//         this.name = currentSection.querySelector('h2');
//         this.color = currentSection.style.color;
//         this.image = currentSection.querySelector('img').src;
//         this.sections = [];
//         this.sectionsCounter = 1;
//     }
//     createSectionTab(container ,sectionName, sectionColor, unintImageURl) {
//         var section = createTab(container, sectionName,  "section-" +this.sectionsCounter, sectionColor, unintImageURl);
//         localStorage.setItem("uName" + sectionsCounter, sectionName);
//         localStorage.setItem("uColor" + sectionsCounter, sectionColor);
//         localStorage.setItem("uImage" + sectionsCounter, unintImageURl);
//         this.sections.push(section);
//         this.sectionsCounter++;
//         return section;
//     }
//     editSectionTab(sectionName,sectionNewName, sectionNewColor, sectionNewImageUrl) {
//         editTab(this.sections, sectionName, sectionNewName, sectionNewColor, sectionNewImageUrl);
//         localStorage.setItem("uName" + id, sectionNewName);
//         localStorage.setItem("uColor"+ id, sectionNewColor);
//         localStorage.setItem("uImage"+ id, sectionNewImageUrl);
//     }
//     searchForSectionName(sectionName) {
//         searchForTabName(this.sections, sectionName);
//     }
//     deleteSection(sectionName) {    
//         var section = searchForTabName(this.sections,sectionName);
        
//         if (section) {
//             section.remove();
//             var tabIndex = section.id.split("-")[1] - 1;
//             this.sections.splice(tabIndex, 1);
//             localStorage.removeItem("uName" + tabIndex);
//             localStorage.removeItem("uColor" + tabIndex);
//             localStorage.removeItem("uImage" + tabIndex);
//             console.log(`section "${this.name}" has been deleted.`);
//         }
//         else {
//             console.log(`Section "${this.name}" not found.`);
//         }
// }
// }
