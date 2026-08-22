const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

// ====== API KEY OBFUSCATE ======
const API_KEY = 'bc86afa6-e7a2-8a2d-7359-d8c13148bf4d669';

// ====== ENDPOINT OBFUSCATE ======
app.post('/api/obfuscate', async (req, res) => {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'Kode Lua tidak boleh kosong' });

    try {
        // Step 1: Kirim script ke LuaObfuscator
        const step1 = await fetch('https://luaobfuscator.com/api/obfuscator/newscript', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': API_KEY
            },
            body: code
        });
        if (!step1.ok) {
            const err = await step1.text();
            return res.status(step1.status).json({ error: `Step 1 gagal: ${err}` });
        }
        const { sessionId } = await step1.json();
        if (!sessionId) return res.status(500).json({ error: 'Tidak mendapat sessionId' });

        // Step 2: Obfuscate
        const config = {
            MinifiyAll: false,
            ChopChain: false,
            Virtualize: false,
            Virtualize2: false,
            CustomPlugins: {
                EncryptStrings: [100],
                ControlFlowFlattenV1AllBlocks: [75, 75, 33],
                MutateAllLiterals: [20]
            }
        };

        const step2 = await fetch('https://luaobfuscator.com/api/obfuscator/obfuscate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': API_KEY,
                'sessionId': sessionId
            },
            body: JSON.stringify(config)
        });
        if (!step2.ok) {
            const err = await step2.text();
            return res.status(step2.status).json({ error: `Step 2 gagal: ${err}` });
        }
        const { code: obfuscated } = await step2.json();
        if (!obfuscated) return res.status(500).json({ error: 'Tidak mendapat kode hasil obfuskasi' });

        res.json({ success: true, code: obfuscated });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// ====== ENDPOINT DOWNLOAD TIKTOK / DOUYIN ======
app.post('/api/download', async (req, res) => {
    const { url, platform } = req.body; // platform: 'tiktok' atau 'douyin'
    if (!url) return res.status(400).json({ error: 'URL tidak boleh kosong' });

    try {
        let apiUrl;
        if (platform === 'douyin') {
            apiUrl = `https://www.tikwm.com/api/douyin/?url=${encodeURIComponent(url)}`;
        } else {
            apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;
        }

        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();

        if (data.code === 0 && data.data) {
            const video = data.data.play || data.data.nowm || null;
            const audio = data.data.music || data.data.audio || null;
            return res.json({
                success: true,
                video: video,
                audio: audio,
                title: data.data.title || 'video'
            });
        }

        // Fallback ke socialkit
        const fallback = await fetch(`https://api.socialkit.xyz/api/tiktok?url=${encodeURIComponent(url)}`);
        const fallbackData = await fallback.json();
        if (fallbackData.success) {
            return res.json({
                success: true,
                video: fallbackData.result?.video || fallbackData.result?.nowm || null,
                audio: fallbackData.result?.audio || fallbackData.result?.music || null,
                title: fallbackData.result?.title || 'video'
            });
        }

        res.json({ success: false, error: 'Tidak dapat mengambil link download' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// ====== HEALTH CHECK ======
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// ====== START SERVER ======
app.listen(port, () => {
    console.log(`🚀 Server berjalan di http://localhost:${port}`);
});
