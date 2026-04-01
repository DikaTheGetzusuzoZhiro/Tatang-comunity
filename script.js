import { db, auth, login } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

window.login = login;

async function loadFiles() {
  const querySnapshot = await getDocs(collection(db, "files"));
  const container = document.getElementById("fileList");

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    container.innerHTML += `
      <div class="card">
        <h3>${data.title}</h3>
        <p>${data.desc}</p>
        <a href="${data.url}" target="_blank">
          <button>Download</button>
        </a>
      </div>
    `;
  });
}

loadFiles();
