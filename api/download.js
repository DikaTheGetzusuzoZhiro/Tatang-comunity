import axios from "axios";

export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        let { url, type } = req.body;

        // AUTO DETECT
        if (type === "auto") {
            if (url.includes("tiktok")) type = "tiktok";
            else if (url.includes("instagram")) type = "instagram";
            else if (url.includes("youtube")) type = "youtube";
            else if (url.includes("facebook")) type = "facebook";
            else if (url.includes("twitter")) type = "twitter";
            else if (url.includes("soundcloud")) type = "soundcloud";
        }

        let result;

        switch (type) {

            case "tiktok":
                result = await tiktok(url);
                break;

            case "instagram":
                result = await instagram(url);
                break;

            case "youtube":
                result = await youtube(url);
                break;

            default:
                return res.status(400).json({ status: false, message: "Unsupported platform" });
        }

        return res.status(200).json({
            status: true,
            download: result
        });

    } catch (err) {
        return res.status(500).json({
            status: false,
            message: err.message
        });
    }
}

// ===== SCRAPER =====

// TikTok No WM
async function tiktok(url) {
    const api = `https://tikwm.com/api/?url=${url}`;
    const { data } = await axios.get(api);
    return data.data.play;
}

// Instagram
async function instagram(url) {
    const api = `https://api.ryzendesu.vip/api/downloader/igdl?url=${url}`;
    const { data } = await axios.get(api);
    return data.data[0].url;
}

// YouTube MP4
async function youtube(url) {
    const api = `https://api.ryzendesu.vip/api/downloader/ytmp4?url=${url}`;
    const { data } = await axios.get(api);
    return data.data.downloadUrl;
}
