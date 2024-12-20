var bigUnitContainer = document.getElementById("big-unit-container");
var addUnitButton = document.getElementById("add-unit-id");
var addUnitForm = document.getElementById("add-unit-form-id");
var addUnitIcon = document.getElementById("add-unit-icon");
var deleteUnitForm = document.getElementById("delete-unit-form");

var deleteUnitIcon = document.getElementById("delete-unit-icon");
var deleteUnitButton = document.getElementById("delete-unit-button");
var inputDeleteUnitName = document.getElementById("input-delete-unit-name");
var cancelAddUnit = document.getElementById("cancel-add-unit-id");
var cancelDeleteUnit = document.getElementById("cancel-delete-unit-id");
var editUnitIcon = document.getElementById("edit-unit-icon");
var editUnitForm = document.getElementById("edit-unit-form");

// var unitsContainer = document.getElementById("units-container");

var currentUnit;
var units = [];
var unitsCounter = 1;

var regex = new RegExp(/(add Unit)|(delete unit)/i);
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

function createUnit(secName, secColor, secImageUrl) {
    
    var unit = createTab(bigUnitContainer, secName, "unit-" + unitsCounter, secColor, secImageUrl);
    localStorage.setItem("uName" + unitsCounter, secName);
    localStorage.setItem("uColor" + unitsCounter, secColor);
    localStorage.setItem("uImage" + unitsCounter, secImageUrl);
    units.push(unit);
    unitsCounter++;
    unit.addEventListener('click',function (event) {
        window.location.href = "./lessons.html";
        currentUnit = event.target;
    });
    return unit;
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

addUnitButton.addEventListener("click", function () {
    
    addUnitForm.style.display = "none";
    
    var inputAddUnitName = document.getElementById("inputUnitName").value;
    var inputAddUnitColor = document.getElementById("inputUnitColor").value;
    var fileInput = document.getElementById("inputUnitfile");
    var inputAddUnitImageUrl = fileInput.files.length ? URL.createObjectURL(fileInput.files[0]) : "../Resources/prepBoy3.png";
    
    if (regex.test(inputAddUnitName)) {
        console.log("you can't add this tab, please change tab name");
    } else {
        if (inputAddUnitName && inputAddUnitColor) {
            createUnit(inputAddUnitName, inputAddUnitColor, inputAddUnitImageUrl);
        } else {
            console.log("Please fill in all required fields.");
        }
    }
});

addUnitIcon.addEventListener("click", function () {
    addUnitForm.focus();
    deleteUnitForm.style.display = "none";
    addUnitForm.style.display = "block";
    editUnitForm.style.display="none";
});

cancelAddUnit.addEventListener("click", function () {
    addUnitForm.style.display = "none";
})

deleteUnitButton.addEventListener("click", function (event) { 
    event.preventDefault();
    deleteUnitForm.style.display = "none";
    var deletedUnitName = inputDeleteUnitName.value;
    deleteUnit(deletedUnitName);
});

deleteUnitIcon.addEventListener("click", function () { 
    deleteUnitForm.focus();
    addUnitForm.style.display = "none";
    deleteUnitForm.style.display = "block";
    editUnitForm.style.display = "none";
});

function deleteUnit(unitName) {    
        var unit = searchForTabName(units,unitName);
        
        if (unit) {
            unit.remove();
            var tabIndex = unit.id.split("-")[1] - 1;
            units.splice(tabIndex, 1);
            localStorage.removeItem("uName" + tabIndex);
            localStorage.removeItem("uColor" + tabIndex);
            localStorage.removeItem("uImage" + tabIndex);
            console.log(`Unit "${unitName}" has been deleted.`);
        }
        else {
            console.log(`Unit "${unitName}" not found.`);
        }
}

cancelDeleteUnit.addEventListener("click", function () {
    deleteUnitForm.style.display = "none";
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

function editUnit(unitName, newName = "", newColor = "", newImageUrl = "") {
    var tab = editTab(units, unitName, newName, newColor, newImageUrl);
    var id = tab.id.split('-')[1]; 
    localStorage.setItem("uName" + id, newName);
    localStorage.setItem("uColor"+ id, newColor);
    localStorage.setItem("uImage"+ id, newImageUrl);
}

document.addEventListener("click", function (event) {
    const addUnitForm = document.getElementById("add-unit-form-id");
    
    if (addUnitForm.style.display === "block") {
        if (!addUnitForm.contains(event.target) && event.target !== addUnitIcon) {
            addUnitForm.style.display = "none";
        }
    }
});

document.addEventListener("click", function (event) {
    
    var deleteUnitForm = document.getElementById("delete-unit-form");
    if (deleteUnitForm.style.display === "block") {
        if (!deleteUnitForm.contains(event.target) && event.target !== deleteUnitIcon) {
            deleteUnitForm.style.display = "none";
        }
    }
});

document.addEventListener("click", function (event) {
    
    var editUnitForm = document.getElementById("edit-unit-form");
    if (editUnitForm.style.display === "block") {
        if (!editUnitForm.contains(event.target) && event.target !== editUnitIcon) {
            editUnitForm.style.display = "none";
        }
    }
});

editUnitIcon.addEventListener("click", function () {
    editUnitForm.focus();
    editUnitForm.style.display = "block";
    addUnitForm.style.display = "none";
    deleteUnitForm.style.display = "none";
});

var editUnitForm = document.getElementById("edit-unit-form");
var inputEditUnitName = document.getElementById("input-edit-unit-name");
var inputEditedUnitName = document.getElementById("input-edited-unit-name-id");
var inputEditedUnitColor = document.getElementById("input-edited-unit-color-id");
var inputEditedUnitImage = document.getElementById("input-edited-unit-image-id");
var inputEditedUnitNameCheckbox = document.getElementById("input-edit-name-id");
var inputEditedUnitColorCheckbox = document.getElementById("input-edit-color-id");
var inputEditedUnitImageCheckbox = document.getElementById("input-edit-image-id");

inputEditUnitName.onfocus = function () {
    this.style.border = "1px solid gray";
};

inputEditUnitName.onblur = function () {
    var tab = searchForTabName(units, this.value.trim());

    if (tab) {
        this.style.borderColor = "green"; 
    } else {
        this.style.borderColor = "red"; 
    }
};

inputEditedUnitNameCheckbox.onchange = function (event) {
    if (event.target.checked && inputEditUnitName.style.borderColor === "green") {
        inputEditedUnitName.removeAttribute("disabled");
    } else {
        inputEditedUnitName.setAttribute("disabled", "disabled");
    }
};

inputEditedUnitColorCheckbox.onchange = function (event) {
    if (event.target.checked && inputEditUnitName.style.borderColor === "green") {
        inputEditedUnitColor.removeAttribute("disabled");
    } else {
        inputEditedUnitColor.setAttribute("disabled", "disabled");
    }
};

inputEditedUnitImageCheckbox.onchange = function (event) {
    if (event.target.checked && inputEditUnitName.style.borderColor === "green") {
        inputEditedUnitImage.removeAttribute("disabled");
    } else {
        inputEditedUnitImage.setAttribute("disabled", "disabled");
    }
};

var editUnitButton = document.getElementById("edit-unit-button-id");
editUnitButton.addEventListener('click', function (event) {
    event.preventDefault();
    editUnit(inputEditUnitName.value, inputEditedUnitName.value, inputEditedUnitColor.value, inputEditedUnitImage.value);
})

var cancelEditUnitButton = document.getElementById("cancel-edit-unit-id");
cancelEditUnitButton.addEventListener("click", function (event) {
    event.preventDefault();
    editUnitForm.style.display = "none";
})

window.onload = function () {
    var uName = [], uColor = [], uImage = [];
    if (localStorage.length > 0) {
        for(let x in localStorage){
            if (x.startsWith("uName")) {
                uName.push(localStorage[x])
            }
            else if (x.startsWith("uColor")) {
                uColor.push(localStorage[x]);
            }
            // Check for group image
            else if (x.startsWith("uImage")) {
                uImage.push(localStorage[x]) ;
            }
        }
    }
    for (let i = 0; i < uName.length; i++) {
        createUnit(uName[i], uColor[i], uImage[i]);        
    }
};



// class GroupInfo{
//     constructor() {
//         this.unit = currentUnit;
//         this.id = currentUnit.id;
//         this.name = currentUnit.querySelector('h2');
//         this.color = currentUnit.style.color;
//         this.image = currentUnit.querySelector('img').src;
//         this.units = [];
//         this.unitsCounter = 1;
//     }
//     createUnitTab(container ,unitName, unitColor, unintImageURl) {
//         var unit = createTab(container, unitName,  "unit-" +this.unitsCounter, unitColor, unintImageURl);
//         localStorage.setItem("uName" + unitsCounter, unitName);
//         localStorage.setItem("uColor" + unitsCounter, unitColor);
//         localStorage.setItem("uImage" + unitsCounter, unintImageURl);
//         this.units.push(unit);
//         this.unitsCounter++;
//         return unit;
//     }
//     editUnitTab(unitName,unitNewName, unitNewColor, unitNewImageUrl) {
//         editTab(this.units, unitName, unitNewName, unitNewColor, unitNewImageUrl);
//         localStorage.setItem("uName" + id, unitNewName);
//         localStorage.setItem("uColor"+ id, unitNewColor);
//         localStorage.setItem("uImage"+ id, unitNewImageUrl);
//     }
//     searchForUnitName(unitName) {
//         searchForTabName(this.units, unitName);
//     }
//     deleteUnit(unitName) {    
//         var unit = searchForTabName(this.units,unitName);
        
//         if (unit) {
//             unit.remove();
//             var tabIndex = unit.id.split("-")[1] - 1;
//             this.units.splice(tabIndex, 1);
//             localStorage.removeItem("uName" + tabIndex);
//             localStorage.removeItem("uColor" + tabIndex);
//             localStorage.removeItem("uImage" + tabIndex);
//             console.log(`unit "${this.name}" has been deleted.`);
//         }
//         else {
//             console.log(`Unit "${this.name}" not found.`);
//         }
// }
// }
