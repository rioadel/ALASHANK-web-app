
export function createTab(container, tabName, tabID, tabColor, tabImageUrl) {
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


export function searchForTabName(tabs, tabName) {
    var tabfound;
    tabs.forEach(function (tab) {
        var tabText = tab.querySelector(".tabText h2").innerHTML;
        if (tabText.trim() === tabName.trim()) {
            tabfound = tab;
        }
    });
    return  tabfound;
}


export function editTab(container, tabName, newName="", newColor="", newImageUrl="") {
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
