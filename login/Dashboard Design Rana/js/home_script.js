import { LocalStorageHelper } from "../../../core/helpers/local_storage_helper.js";

console.log("hello");
initHomePage();
function initHomePage(){
    console.log(LocalStorageHelper.getAllKeys());
    let teacherName= document.getElementById('teacherName');
    let teacherImage = document.getElementById('teacherImage');
    teacherName.innerHTML = LocalStorageHelper.getItem('teacher').name;
    teacherImage.src = LocalStorageHelper.getItem('teacher').imageUrl;
}