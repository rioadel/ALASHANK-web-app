
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
