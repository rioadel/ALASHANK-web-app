import {
  deleteResource,
  postFormData,
  postData,
} from "../../../core/helpers/CRUD.js";
import { LocalStorageHelper } from "../../../core/helpers/local_storage_helper.js";

// Basic variables
const apiBaseUrl = "http://51.68.175.80/test";

// Getting the token from localStorage
const token = LocalStorageHelper.getItem("token");

if (!token) {
  alert("You do not have permission to access this page. Please log in.");
  window.location.href = "/login"; // Redirect to login page
}

// Getting teacherId from localStorage
const teacherData = LocalStorageHelper.getItem("teacher");
const teacherId = teacherData ? teacherData.id : null;

if (!teacherId) {
  alert("TeacherId not found in localStorage.");
  window.location.href = "/"; // Redirect to homepage if teacherId is not found
} else {
  console.log("TeacherId found: ", teacherId);
  getTeacherSessions(teacherId); // Fetch the sessions using teacherId
}
// In the file where you defined the function (e.g., `teacherUtils.js`)
export async function getAllSectionIdsByTeacher(teacherId) {
  try {
    const courses = await getCoursesByTeacher(teacherId);
    if (!Array.isArray(courses) || courses.length === 0) {
      console.log("No courses available for this teacher.");
      return [];
    }

    let allSectionIds = [];

    // Handling all courses
    for (const course of courses) {
      const sections = await getSectionsByCourse(course.id);
      if (Array.isArray(sections) && sections.length > 0) {
        // Add the section IDs to the list
        allSectionIds = [
          ...allSectionIds,
          ...sections.map((section) => section.id),
        ];
      }
    }

    return allSectionIds; // Return all section IDs found
  } catch (error) {
    console.error("Error fetching section IDs:", error);
    return [];
  }
}

// Define the allSessions array to store sessions
let allSessions = [];

// Function to fetch courses by teacher
async function getCoursesByTeacher(teacherId) {
  try {
    const response = await fetch(
      `${apiBaseUrl}/api/courses?teacherId=${teacherId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "api-key": "ac67edbe1ce9c1da5a5b3eb0fd682ea2",
        },
      }
    );

    const data = await response.json();
    console.log("Courses response:", data);

    if (response.ok) {
      return data.courses || [];
    } else {
      console.error(
        "Error fetching courses:",
        data.message || "Failed to fetch data"
      );
      return [];
    }
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

async function getSectionsByCourse(courseId) {
  try {
    const response = await fetch(`${apiBaseUrl}/api/courses/${courseId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "api-key": "ac67edbe1ce9c1da5a5b3eb0fd682ea2",
      },
    });

    const data = await response.json();
    console.log("Course response:", data);

    if (response.ok) {
      return data.course.sections || [];
    } else {
      console.error(
        "Error fetching sections:",
        data.message || "Failed to fetch data"
      );
      return [];
    }
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

// Function to fetch sessions by section ID
async function getSessionsBySection(sectionId) {
  try {
    const response = await fetch(`${apiBaseUrl}/api/sections/${sectionId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "api-key": "ac67edbe1ce9c1da5a5b3eb0fd682ea2",
      },
    });

    const data = await response.json();
    console.log("Sessions response:", data);

    if (response.ok) {
      return data.section.sessions || [];
    } else {
      console.error(
        "Error fetching sessions:",
        data.message || "Failed to fetch data"
      );
      return [];
    }
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

// Function to fetch all sessions at once and display them
async function getTeacherSessions(teacherId) {
  try {
    const courses = await getCoursesByTeacher(teacherId);
    if (!Array.isArray(courses) || courses.length === 0) {
      alert("No courses available for this teacher.");
      return;
    }

    allSessions = []; // Reset allSessions array before loading

    // Handling all courses
    for (const course of courses) {
      const sections = await getSectionsByCourse(course.id);
      if (!Array.isArray(sections) || sections.length === 0) {
        console.log(`No sections for the course ${course.name}`);
        continue;
      }

      // Handling each section within the course
      for (const section of sections) {
        const sessions = await getSessionsBySection(section.id);
        if (sessions.length === 0) {
          console.log(`No sessions in section ${section.name}`);
          continue;
        } else {
          console.log(`Found sessions in section ${section.name}`);
          allSessions = [...allSessions, ...sessions];
        }
      }
    }

    // Display all sessions if found
    if (allSessions.length > 0) {
      displaySessions(allSessions);
    } else {
      console.log("No sessions found for the teacher.");
    }
  } catch (error) {
    console.error("Error in sequence:", error);
  }
}
function displaySessions(sessions) {
  const sessionsList = document.getElementById("sessions-list");
  sessionsList.innerHTML = ""; // Clear the table before displaying new data

  if (!sessions || sessions.length === 0) {
    console.log("No sessions to display.");
    return;
  }

  sessions.forEach((session) => {
    console.log("Adding session:", session);

    // Determine the content based on type (video or YouTube)
    let videoContent = "Not Available";
    if (session.type === "video" && session.video) {
      videoContent = `<a href="${session.video.url}" target="_blank">${session.video.name || "View Video"
        }</a>`;
    } else if (session.type === "youtube" && session.fileUrl) {
      videoContent = `<a href="${session.fileUrl}" target="_blank">YouTube Link</a>`;
    }

    // Create the table row for the session
    const sessionElement = document.createElement("tr");
    sessionElement.setAttribute("data-id", session.id);

    sessionElement.innerHTML = `
          <td class="session-title">${session.title || "Untitled"}</td>
          <td class="session-type">${session.type || "Unknown"}</td>
          <td class="session-id">${session.id}</td>
          <td class="session-sectionId">${session.sectionId || "Unknown"}</td>
          <td class="session-video">${videoContent}</td>
          <td>
            <i class="edit-session fas fa-edit" title="Edit"></i>
            <i class="delete-session fas fa-trash" title="Delete"></i>
          </td>
        `;

    // Append the new row to the table body
    sessionsList.appendChild(sessionElement);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const sessionsList = document.getElementById("sessions-list");

  // Event listener for Edit icons
  sessionsList.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit-session")) {
      const sessionRow = e.target.closest("tr");
      const sessionId = sessionRow.getAttribute("data-id");
      const sessionData = {
        title: sessionRow.querySelector(".session-title").textContent,
        type: sessionRow.querySelector(".session-type").textContent,
        sectionId: sessionRow.querySelector(".session-sectionId").textContent,
        videoUrl: sessionRow.querySelector(".session-video a")
          ? sessionRow.querySelector(".session-video a").href
          : "",
      };
      openEditModal(sessionId, sessionData);
    }
  });
});

// Function to open the modal with session data
function openEditModal(sessionId, sessionData) {
  const modalHtml = `
      <div class="modal-overlay">
        <div class="modal">
          <h3>Edit Session</h3>
          <form id="edit-session-form">
            <label for="session-title">Title</label>
            <input type="text" id="session-title" value="${sessionData.title}" />
            <br>
  
            <label for="session-type">Type</label>
            <input type="text" id="session-type" value="${sessionData.type}" />
              <br>

            <label for="session-sectionId">Section ID</label>
            <input type="text" id="session-sectionId" value="${sessionData.sectionId}" />
              <br>

            <div>
              <input type="file" id="session-video-file" />
              <input
                type="text"
                id="session-video-url"
                placeholder="YouTube URL"
                value="${sessionData.videoUrl}"
              />
            </div>
                        

  
            <div class="modal-actions">
              <button type="button" id="save-session">Save</button>
              <button type="button" id="cancel-session">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    `;

  document.body.insertAdjacentHTML("beforeend", modalHtml);

  // Add event listeners for Save and Cancel buttons
  document
    .getElementById("save-session")
    .addEventListener("click", () => saveSession(sessionId));
  document
    .getElementById("cancel-session")
    .addEventListener("click", closeModal);
}

// Function to close the modal
function closeModal() {
  const modal = document.querySelector(".modal-overlay");
  if (modal) {
    modal.remove();
  }
}

// Function to save the session changes
async function saveSession(sessionId) {
  const title = document.getElementById("session-title").value;
  const type = document.getElementById("session-type").value;
  const sectionId = document.getElementById("session-sectionId").value;
  const videoFile = document.getElementById("session-video-file").files[0];
  const videoUrl = document.getElementById("session-video-url").value;

  const formData = new FormData();
  // Prepare base data structure
  let sessionData = {
    title: title,
    exams: [],
    video: {
      name: title,
      url: videoUrl,
    },
  };
  console.log("sesseionNum");
  console.log(sessionId);
  formData.append("data", JSON.stringify(sessionData));
  try {
    // Sending the updated session data
    const response = await postFormData(
      `sessions/${sessionId}`,
      formData,
      "PATCH"
    );

    console.log("API Response: ", response);

    if (response.status) {
      // Find the session row and update it with the new data
      const sessionRow = document.querySelector(`tr[data-id='${sessionId}']`);
      sessionRow.querySelector(".session-title").textContent = title;
      sessionRow.querySelector(".session-type").textContent = type;
      sessionRow.querySelector(".session-sectionId").textContent = sectionId;
      console.log("session updated 200")
      // Update the video display
      if (videoFile || videoUrl) {
        const videoElement = sessionRow.querySelector(".session-video");
        const videoData = response.data.session.video;

        if (videoData) {
          // Display video name and link if available
          videoElement.innerHTML = `<a href="${videoData.url}" target="_blank">${videoData.name}</a>`;
        } else {
          videoElement.innerHTML = "No video available";
        }
      }

      closeModal();
      alert("Session updated successfully!");
    } else {
      alert(`Failed to update session: ${response.message}`);
    }
  } catch (error) {
    console.error("Error updating session:", error);
    alert("An error occurred while updating the session.");
  }
}
