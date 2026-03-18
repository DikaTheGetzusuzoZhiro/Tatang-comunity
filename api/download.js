import axios from "axios";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const { url } = req.body;

        const api = `https://tikwm.com/api/?url=${url}`;
        const { data } = await axios.get(api);

        return res.status(200).json({
            status: true,
            video: data.data.play,
            music: data.data.music,
            cover: data.data.cover
        });

    } catch (err) {
        return res.status(500).json({
            status: false,
            message: "Gagal mengambil video"
        });
    }
}
