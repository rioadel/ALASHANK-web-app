import {
  deleteResource,
  getResource,
  postFormData,
} from "../../../core/helpers/CRUD.js";

const params = new URLSearchParams(window.location.search);
const SECTIONID = params.get("id");

window.onload = function () {
  getSessions();
};

async function getSessions() {
  const res = getResource(`sections/${SECTIONID}`).then((data) => {
    displaySessions(data.section);
  });
}

function displaySessions(sessions) {
  const sessionsList = document.getElementById("sessions-list");
  sessionsList.innerHTML = "";

  (sessions.sessions || []).forEach((session) => {
    let videoContent = "Not Available";
    if (session.type === "youtube" && session.video) {
      videoContent = `<a href="${session.video.url}" target="_blank">${
        session.video?.url || "View Video"
      }</a>`;
    }

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

    sessionsList.appendChild(sessionElement);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const sessionsList = document.getElementById("sessions-list");

  sessionsList.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit-session")) {
      const sessionRow = e.target.closest("tr");
      const sessionId = sessionRow.getAttribute("data-id");
      const sessionData = {
        title: sessionRow.querySelector(".session-title").textContent,
        type: sessionRow.querySelector(".session-type").textContent,
        sectionId: sessionRow.querySelector(".session-sectionId").textContent,
        videoUrl: sessionRow.querySelector(".session-video a")
          ? sessionRow.querySelector(".session-video a").textContent
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

document
  .getElementById("add-session-btn")
  .addEventListener("click", (event) => {
    window.location.href = `../Addlesson.html?id=${SECTIONID}`;
  });

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
                        <label for="session-video-url">YouTube URL</label>

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

  document
    .getElementById("save-session")
    .addEventListener("click", () => saveSession(sessionId));
  document
    .getElementById("cancel-session")
    .addEventListener("click", closeModal);
}
async function saveSession(sessionId) {
  const title = document.getElementById("session-title").value;
  const type = document.getElementById("session-type").value;
  const sectionId = document.getElementById("session-sectionId").value;
  const videoUrl = document.getElementById("session-video-url").value;

  const formData = new FormData();
  let sessionData = {
    title: title,
    exams: [],
    video: {
      name: title,
      url: videoUrl,
    },
  };

  formData.append("data", JSON.stringify(sessionData));
  try {
    const response = await postFormData(
      `sessions/${sessionId}`,
      formData,
      "PATCH"
    );

    if (response.status) {
      const sessionRow = document.querySelector(`tr[data-id='${sessionId}']`);
      sessionRow.querySelector(".session-title").textContent = title;
      sessionRow.querySelector(".session-type").textContent = type;
      sessionRow.querySelector(".session-sectionId").textContent = sectionId;

      if (videoUrl) {
        const videoElement = sessionRow.querySelector(".session-video");
        const videoData = response.data.session.video;

        if (videoData) {
          videoElement.innerHTML = `<a href="${videoData.name}" target="_blank">${videoData.url}</a>`;
        } else {
          videoElement.innerHTML = "No video available";
        }
      }

      closeModal();
    } else {
      alert(`Failed to update session: ${response.message}`);
    }
  } catch (error) {
    console.error("Error updating session:", error);
    alert("An error occurred while updating the session.");
  }
}

function closeModal() {
  const modal = document.querySelector(".modal-overlay");
  if (modal) {
    modal.remove();
  }
}

function openDeleteConfirmation(sessionId, sessionRow) {
  const modalHtml = `
    <div class="modal-overlay">
      <div class="modal">
        <h3 style="text-align : center">Are you sure ?</h3>
        <div class="modal-actions">
          <button type="button" id="confirm-delete">Ok</button>
          <button type="button" id="cancel-delete">Cancel</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHtml);

  document
    .getElementById("confirm-delete")
    .addEventListener("click", () => deleteSession(sessionId, sessionRow));
  document
    .getElementById("cancel-delete")
    .addEventListener("click", closeModal);
}

async function deleteSession(sessionId, sessionRow) {
  try {
    const response = await deleteResource(`sessions/${sessionId}`);

    if (response.status) {
      sessionRow.remove();
    } else {
      alert("Failed to delete the session: " + response.message);
    }

    closeModal();
  } catch (error) {
    console.error("Error deleting session:", error);
    alert("An error occurred while deleting the session.");
  }
}
