import { postFormData } from "../../../core/helpers/CRUD.js";
import { LocalStorageHelper } from "../../../core/helpers/local_storage_helper.js";

const params = new URLSearchParams(window.location.search);
const SECTIONID = params.get("id");

const videoUrlField = document.getElementById("video-url");
const videoFileField = document.querySelector(".video-file-field");
const token = LocalStorageHelper.getItem("token");

if (!token) {
  alert("You do not have permission to access this page. Please log in.");
  window.location.href = "/login";
}

document.querySelectorAll('input[name="video_source"]').forEach((radio) => {
  radio.addEventListener("change", (event) => {
    if (event.target.value === "url") {
      videoUrlField.classList.remove("d-none");
      videoFileField.classList.add("d-none");
    } else {
      videoUrlField.classList.add("d-none");
      videoFileField.classList.remove("d-none");
    }
  });
});

document
  .getElementById("add-session-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.target;

    const title = form.querySelector("#session-title").value.trim();

    let sessionData = {
      sectionId: SECTIONID,
      title: title,
      exams: [],
      video: {
        name: title,
        url: videoUrlField.value || " InValid",
      },
    };
    
    
    const formData = new FormData();
    formData.append("data", JSON.stringify(sessionData));

    for (const [key, value] of formData.entries()) {
      
    }
    try {
      const response = await postFormData("sessions", formData, "POST");
      if (response.status) {
        window.location.href = `Dashboard Design Rana/lessons.html?id=${SECTIONID}`;
      } else {
        alert(`Error: ${response.message}`);
      }
    } catch (error) {
      console.error("Error adding session:", error);
      alert("An error occurred while adding the session.");
    }
  });
