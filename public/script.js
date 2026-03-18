async function download() {
    const url = document.getElementById("url").value;
    const type = document.getElementById("type").value;

    document.getElementById("result").innerHTML = "⏳ Loading...";

    try {
        const res = await fetch("/api/download", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ url, type })
        });

        const data = await res.json();

        if (data.status) {
            document.getElementById("result").innerHTML = `
                <a href="${data.download}" target="_blank">⬇️ Download</a>
            `;
        } else {
            document.getElementById("result").innerHTML = "❌ " + data.message;
        }

    } catch (err) {
        document.getElementById("result").innerHTML = "❌ Error";
    }
}
