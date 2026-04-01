import { db, auth, login } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

window.login = login;

let allData = [];

async function loadFiles() {
  const querySnapshot = await getDocs(collection(db, "files"));
  const container = document.getElementById("fileList");

  allData = [];

  querySnapshot.forEach((doc) => {
    allData.push(doc.data());
  });

  render(allData);
}

function render(data) {
  const container = document.getElementById("fileList");
  container.innerHTML = "";

  data.forEach(item => {
    container.innerHTML += `
      <div class="card">
        <span class="badge">${item.category || "MOD"}</span>
        <h3>${item.title}</h3>
        <p>${item.desc}</p>
        <a href="${item.url}" target="_blank">
          <button>Download</button>
        </a>
      </div>
    `;
  });
}

document.getElementById("search").addEventListener("input", (e) => {
  const keyword = e.target.value.toLowerCase();
  const filtered = allData.filter(x => x.title.toLowerCase().includes(keyword));
  render(filtered);
});

loadFiles();
