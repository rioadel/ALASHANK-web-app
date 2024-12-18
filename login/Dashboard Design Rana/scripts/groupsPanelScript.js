var bigSectionContainer = document.getElementById("big-section-container");
var addSectionButton = document.getElementById("add-section-id");
var addSectionForm = document.getElementById("add-section-form-id");
var addSectionTab = document.getElementById("add-section");
var addSectionIcon = document.getElementById("add-section-icon");
var deleteSectionForm = document.getElementById("delete-section-form");
var deleteSectionTab = document.getElementById("delete-section");
var deleteSectionIcon = document.getElementById("delete-section-icon");
var deleteSectionButton = document.getElementById("delete-section-button");
var inputDeleteSectionName = document.getElementById("input-delete-section-name");
var cancelAddSection = document.getElementById("cancel-add-section-id");
var cancelDeleteSection = document.getElementById("cancel-delete-section-id");
var editSectionIcon = document.getElementById("edit-section-icon");

var unitsContainer = document.getElementById("units-container");

var sections = [];
var units = [];
var sectionsCounter = 1;
var unitsCounter = 1;

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

function createSection(name, color, imageUrl) {
    
    var section = createTab(bigSectionContainer, name, "section-" + sectionsCounter, color, imageUrl);
    sections.push(section);
    sectionsCounter++;
    var flag = true;
    section.addEventListener("click", function () { 
        if (flag) {
            createTab(unitsContainer,"Add Unit","add-unit-id","green", "../Resources/prepBoy4.png");
            createTab(unitsContainer, "Delete Unit", "delete-unit-id", "red", "../Resources/delete.png");
            flag = false;
        }
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
    var inputAddSectionImageUrl = fileInput.files.length ? URL.createObjectURL(fileInput.files[0]) : "../Resources/prepBoy.png";
    
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
});

function deleteSection(sectionName) {    
    if (regex.test(sectionName)) {
        console.log("you can't delete this tab");
    }
    else {
        var section = searchForTabName(sections,sectionName);
        if (section) {
            section.remove();
            var tabIndex = section.id.split("-")[1] - 1;
            sections.splice(tabIndex, 1);
            console.log(`Section "${sectionName}" has been deleted.`);
        }
        else {
            console.log(`Section "${sectionName}" not found.`);
        }
    }
}

cancelDeleteSection.addEventListener("click", function () {
    deleteSectionForm.style.display = "none";
})

function editTab(container, tabName, newName="", newColor="", newImageUrl="") {
    var tab = searchForTabName(container, tabName);
    if (tab) {
        if (newName) {
            tab.querySelector("h2").innerHTML = newName;
        }
        if (newColor) {
            tab.style.backgroundColor = newColor;
            if (newColor == "black") {
                tab.style.color = "white";
            }
        }
        if (newImageUrl) {
            tab.querySelector("img").src = newImageUrl;
        }
    }
}

function editSection(sectionName, newName="", newColor="", newImageUrl="") {
    editTab(sections, sectionName, newName, newColor, newImageUrl);
}

editSectionIcon.addEventListener("click", function () { 

});

function createUnit(name, color, imageUrl) {
    var unit = createTab(unitsContainer, name, "unit-"+unitsCounter, color, imageUrl);
    units.push(unit);
    unitsCounter++;
}

// Event listener to hide the Add Section form when clicking outside
document.addEventListener("click", function (event) {
    const addSectionForm = document.getElementById("add-section-form-id");
    const deleteSectionForm = document.getElementById("delete-section-form");

    if (addSectionForm.style.display === "block") {
        // Check if the click is outside the form and not on the icon
        if (!addSectionForm.contains(event.target) && event.target !== addSectionIcon) {
            addSectionForm.style.display = "none";
        }
    }
});

// Event listener to hide the Delete Section form when clicking outside
document.addEventListener("click", function (event) {

    if (deleteSectionForm.style.display === "block") {
        // Check if the click is outside the form and not on the icon
        if (!deleteSectionForm.contains(event.target) && event.target !== deleteSectionIcon) {
            deleteSectionForm.style.display = "none";
        }
    }
});
