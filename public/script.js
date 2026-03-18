async function download() {
    const url = document.getElementById("url").value;
    const type = document.getElementById("type").value;

    const loading = document.getElementById("loading");
    const result = document.getElementById("result");
    const preview = document.getElementById("preview");

    result.innerHTML = "";
    preview.innerHTML = "";

    loading.classList.remove("hidden");

    try {
        const res = await fetch("/api/download", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ url, type })
        });

        const data = await res.json();

        loading.classList.add("hidden");

        if (!data.status) {
            result.innerHTML = "❌ " + data.message;
            return;
        }

        const link = data.download;

        // 🎬 PREVIEW VIDEO
        preview.innerHTML = `
            <video controls>
                <source src="${link}" type="video/mp4">
            </video>
        `;

        // 🔥 AUTO DOWNLOAD
        const a = document.createElement("a");
        a.href = link;
        a.download = "video.mp4";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // BUTTON MANUAL
        result.innerHTML = `
            <a class="download-btn" href="${link}" download>
                ⬇️ Download Manual
            </a>
        `;

    } catch (err) {
        loading.classList.add("hidden");
        result.innerHTML = "❌ Error";
    }
}
