import { db, auth } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const ADMIN_EMAIL = "dikasalto5@gmail.com";

auth.onAuthStateChanged((user) => {
  if (!user || user.email !== ADMIN_EMAIL) {
    alert("Bukan admin!");
    window.location.href = "/";
  }
});

window.uploadFile = async function () {
  const title = document.getElementById("title").value;
  const desc = document.getElementById("desc").value;

  await addDoc(collection(db, "files"), {
    title,
    desc,
    url: "LINK_FILE_KAMU"
  });

  alert("Uploaded!");
};
