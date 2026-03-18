async function paste() {
    try {
        const text = await navigator.clipboard.readText();
        document.getElementById("url").value = text;
    } catch {
        alert("Gagal paste");
    }
}

async function getVideo() {
    const url = document.getElementById("url").value;

    const loading = document.getElementById("loading");
    const preview = document.getElementById("preview");
    const result = document.getElementById("result");

    loading.classList.remove("hidden");
    preview.innerHTML = "";
    result.innerHTML = "";

    try {
        const res = await fetch("/api/download", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ url })
        });

        const data = await res.json();

        loading.classList.add("hidden");

        if (!data.status) {
            result.innerHTML = "❌ Error";
            return;
        }

        // 🎬 PREVIEW VIDEO
        preview.innerHTML = `
            <video controls>
                <source src="${data.video}" type="video/mp4">
            </video>
        `;

        // 🔥 AUTO DOWNLOAD
        const a = document.createElement("a");
        a.href = data.video;
        a.download = "tiktok.mp4";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // BUTTON DOWNLOAD
        result.innerHTML = `
            <a href="${data.video}" download>
                ⬇ Download Video
            </a>
            <br><br>
            <a href="${data.music}" download>
                🎵 Download MP3
            </a>
        `;

    } catch (err) {
        loading.classList.add("hidden");
        result.innerHTML = "❌ Server Error";
    }
}
