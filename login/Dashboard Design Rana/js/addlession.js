import { postFormData } from "../../../core/helpers/CRUD.js";
import { LocalStorageHelper } from "../../../core/helpers/local_storage_helper.js";

const teacherData = LocalStorageHelper.getItem("teacher");
const teacherId = teacherData ? teacherData.id : null;
const params = new URLSearchParams(window.location.search);
const SECTIONID = params.get("id");

// Toggle visibility between URL and File input fields
const videoUrlField = document.getElementById("video-url");
const videoFileField = document.querySelector(".video-file-field");
const token = LocalStorageHelper.getItem("token");

if (!token) {
  alert("You do not have permission to access this page. Please log in.");
  window.location.href = "/login"; // Redirect to login page
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
    console.log("add-session-form");
    const form = event.target;

    const title = form.querySelector("#session-title").value.trim();

    const videoSource = form.querySelector(
      'input[name="video_source"]:checked'
    ).value;


    // Prepare base data structure
    let sessionData = {
      sectionId: SECTIONID, // Send sectionId as a number
      title: title,
      exams: [],
      video: {
        name: title,
        url: videoUrlField.value,
      },
    };
    console.log("SECTIONID");
    console.log(SECTIONID);
    const formData = new FormData();
    formData.append("data", JSON.stringify(sessionData));
    // formData.append("sectionId", SECTIONID); // Check if 'section_id' is expected by the API
    // formData.append("title", sessionData.title);
    // formData.append("exams", JSON.stringify(sessionData.exams));
    // formData.append("video", videoFile);
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    try {
      console.log("Sending FormData:", Array.from(formData.entries())); // Log form data
      const response = await postFormData("sessions", formData, "POST"); // Send FormData
      if (response.status) {
        alert("Session with video file added successfully!");
        window.location.href = `Dashboard Design Rana/lessons.html?id=${SECTIONID}`; // Redirect to main page
      } else {
        alert(`Error: ${response.message}`);
      }
    } catch (error) {
      console.error("Error adding session:", error);
      alert("An error occurred while adding the session.");
    }
    // if (videoSource === "url") {
    //   // Handle YouTube URL case
    //   const videoUrl = form.querySelector("#video-url").value.trim();
    //   if (!videoUrl) {
    //     alert("Please enter a valid YouTube URL.");
    //     return;
    //   }
    //   sessionData.video.url = videoUrl;

    //   try {
    //     console.log("Sending JSON data:", sessionData); // Log to see the full request
    //     const response = await postFormData("sessions", sessionData, "POST"); // Send as stringified JSON
    //     if (response.status) {
    //       alert("Session with YouTube URL added successfully!");
    //       window.location.href = "./index.html"; // Redirect to main page
    //     } else {
    //       alert(`Error: ${response.message}`);
    //     }
    //   } catch (error) {
    //     console.error("Error adding session:", error);
    //     alert("An error occurred while adding the session.");
    //   }
    // } else if (videoSource === "file") {
    //   // Handle file upload case
    //   const videoFile = form.querySelector("#video-file").files[0];
    //   if (!videoFile) {
    //     alert("Please upload a video file.");
    //     return;
    //   }
    //   console.log("SECTIONID");
    //   console.log(SECTIONID);
    //   const formData = new FormData();
    //   formData.append("sectionId", SECTIONID); // Check if 'section_id' is expected by the API
    //   formData.append("title", sessionData.title);
    //   formData.append("exams", JSON.stringify(sessionData.exams));
    //   formData.append("video", videoFile);
    //   for (const [key, value] of formData.entries()) {
    //     console.log(`${key}: ${value}`);
    //   };
    //   try {
    //     console.log("Sending FormData:", Array.from(formData.entries())); // Log form data
    //     const response = await postFormData("sessions", formData, "POST"); // Send FormData
    //     if (response.status) {
    //       alert("Session with video file added successfully!");
    //       window.location.href = "./index.html"; // Redirect to main page
    //     } else {
    //       alert(`Error: ${response.message}`);
    //     }
    //   } catch (error) {
    //     console.error("Error adding session:", error);
    //     alert("An error occurred while adding the session.");
    //   }
    // }
  });
