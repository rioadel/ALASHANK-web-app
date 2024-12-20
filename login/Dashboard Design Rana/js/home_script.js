import { LocalStorageHelper } from "../../../core/helpers/local_storage_helper.js";

initHomePage();
function initHomePage(){
    console.log(LocalStorageHelper.getAllKeys());
    let teacherName= document.getElementById('teacherName');
    let teacherImage = document.getElementById('teacherImage');
    let teacherImage2 = document.images[1]  ;
    teacherName.innerHTML = LocalStorageHelper.getItem('teacher').name;
    var testImg= LocalStorageHelper.getItem('teacher').imageUrl.replace('http://51.68.175.80/','http://51.68.175.80/test/');
    teacherImage.src = testImg;
    teacherImage2.src = testImg;
}
