import {
  deleteResource,
  getResource,
  postFormData,
} from "../../../core/helpers/CRUD.js";

const params = new URLSearchParams(window.location.search);
const SECTIONID = params.get("id");

console.log(SECTIONID); // Output: 123

window.onload = function () {
  getSessions();
};

async function getSessions() {
  const res = getResource(`sections/${SECTIONID}`).then((data) => {
    console.log("fetched sessions", data);
    displaySessions(data.section);
  });
}


function displaySessions(sessions) {
  const sessionsList = document.getElementById("sessions-list");
  sessionsList.innerHTML = ""; // Clear the table before displaying new data

  // if (!sessions || sessions.length === 0) {
  //   console.log("No sessions to display.");
  //   return;
  // }
  console.log("sessions", sessions);

  (sessions.sessions || []).forEach((session) => {
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
         <i class="edit-session fas fa-edit custom-icon" title="Edit"></i>
         <i class="delete-session fas fa-trash custom-icon" title="Delete"></i>

          </td>
        `;
    // console.log(sessionElement);
    console.log('yessssssssssssssssssssssssssssssssssssssssssssss');
    console.log(session);
    // Append the new row to the table body
    sessionsList.appendChild(sessionElement);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const sessionsList = document.getElementById("sessions-list");

  // Event listener for Edit and Delete icons
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

    if (e.target.classList.contains("delete-session")) {
      const sessionRow = e.target.closest("tr");
      const sessionId = sessionRow.getAttribute("data-id");
      openDeleteConfirmation(sessionId, sessionRow);
    }
  });
});
document.getElementById('add-session-btn').addEventListener('click', (event) => {
  window.location.href = `../Addlesson.html?id=${SECTIONID}`;
});
function openDeleteConfirmation(sessionId, sessionRow) {
  const modalHtml = `
    <div class="modal-overlay">
      <div class="modal">
        <h3>Are you sure you want to delete this session?</h3>
        <div class="modal-actions">
          <button type="button" id="confirm-delete">Ok</button>
          <button type="button" id="cancel-delete">Cancel</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHtml);

  // Add event listeners for Ok and Cancel buttons
  document
    .getElementById("confirm-delete")
    .addEventListener("click", () => deleteSession(sessionId, sessionRow));
  document
    .getElementById("cancel-delete")
    .addEventListener("click", closeModal);
}

// Function to delete the session
async function deleteSession(sessionId, sessionRow) {
  console.log("Deleting session with ID:", sessionId);
  try {
    const response = await deleteResource(`sessions/${sessionId}`);

    if (response.status) {
      sessionRow.remove(); // Remove the session row from the DOM
      alert("Session deleted successfully!");
    } else {
      alert("Failed to delete the session: " + response.message);
    }

    closeModal(); // Close the modal
  } catch (error) {
    console.error("Error deleting session:", error);
    alert("An error occurred while deleting the session.");
  }
}

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
      console.log("session updated 200");
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
