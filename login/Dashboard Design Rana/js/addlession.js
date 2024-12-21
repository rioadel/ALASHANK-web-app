import { postFormData } from "../../../core/helpers/CRUD.js";
import { LocalStorageHelper } from "../../../core/helpers/local_storage_helper.js";
import { getAllSectionIdsByTeacher } from "./lessons.js"; // Assuming this function fetches section IDs

const teacherData = LocalStorageHelper.getItem("teacher");
const teacherId = teacherData ? teacherData.id : null;

document.addEventListener("DOMContentLoaded", async () => {
  if (!teacherId) {
    alert("Teacher ID not found. Please log in.");
    window.location.href = "/login";
    return;
  }

  try {
    // Fetch the available section IDs
    const sectionIds = await getAllSectionIdsByTeacher(teacherId);
    console.log("Available Section IDs:", sectionIds);

    // Populate the section dropdown
    const sectionSelect = document.querySelector("#section-id");
    if (sectionIds.length > 0) {
      sectionIds.forEach((id) => {
        const option = document.createElement("option");
        option.value = id;
        option.textContent = ` ${id}`; // Customize the text as needed
        sectionSelect.appendChild(option);
      });
    } else {
      sectionSelect.innerHTML =
        "<option disabled>No sections available</option>";
    }
  } catch (error) {
    console.error("Error fetching section IDs:", error);
    alert("Failed to load sections. Please try again later.");
  }
});

// Toggle visibility between URL and File input fields
const videoUrlField = document.querySelector(".video-url-field");
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
    const form = event.target;

    const title = form.querySelector("#session-title").value.trim();
    const sectionId = form.querySelector("#section-id").value.trim();
    const videoSource = form.querySelector(
      'input[name="video_source"]:checked'
    ).value;

    if (!title || !sectionId || isNaN(sectionId)) {
      alert("Please provide a valid section ID and title.");
      return;
    }

    // Ensure sectionId is treated as a number
    const sectionIdNum = parseInt(sectionId, 10);

    // Prepare base data structure
    let sessionData = {
      sectionId: sectionIdNum, // Send sectionId as a number
      title: title,
      exams: [],
      video: {
        name: title,
        url: "",
      },
    };

    if (videoSource === "url") {
      // Handle YouTube URL case
      const videoUrl = form.querySelector("#video-url").value.trim();
      if (!videoUrl) {
        alert("Please enter a valid YouTube URL.");
        return;
      }
      sessionData.video.url = videoUrl;

      try {
        console.log("Sending JSON data:", sessionData); // Log to see the full request
        const response = await postFormData("sessions", sessionData, "POST"); // Send as stringified JSON
        if (response.status) {
          alert("Session with YouTube URL added successfully!");
          window.location.href = "./index.html"; // Redirect to main page
        } else {
          alert(`Error: ${response.message}`);
        }
      } catch (error) {
        console.error("Error adding session:", error);
        alert("An error occurred while adding the session.");
      }
    } else if (videoSource === "file") {
      // Handle file upload case
      const videoFile = form.querySelector("#video-file").files[0];
      if (!videoFile) {
        alert("Please upload a video file.");
        return;
      }

      const formData = new FormData();
      formData.append("sectionId", sectionIdNum); // Check if 'section_id' is expected by the API
      formData.append("title", sessionData.title);
      formData.append("exams", JSON.stringify(sessionData.exams));
      formData.append("video", videoFile);

      try {
        console.log("Sending FormData:", Array.from(formData.entries())); // Log form data
        const response = await postFormData("sessions", formData, "POST"); // Send FormData
        if (response.status) {
          alert("Session with video file added successfully!");
          window.location.href = "./index.html"; // Redirect to main page
        } else {
          alert(`Error: ${response.message}`);
        }
      } catch (error) {
        console.error("Error adding session:", error);
        alert("An error occurred while adding the session.");
      }
    }
  });
