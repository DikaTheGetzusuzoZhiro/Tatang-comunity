"use client";

import { useState } from "react";

type DownloadResult = {
  title?: string;
  cover?: string;
  play?: string;
  wmplay?: string;
  music?: string;
  author?: {
    nickname?: string;
    unique_id?: string;
  };
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<DownloadResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDownload() {
    setError("");
    setResult(null);

    if (!url.trim()) {
      setError("Masukkan link TikTok terlebih dahulu.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          url: url.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Gagal mengambil data TikTok."
        );
      }

      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <header className="navbar">
        <div className="logo">
          <span className="logo-mark" />
          TikSave
        </div>

        <div className="status">
          VERCEL READY
        </div>
      </header>

      <section className="hero">
        <div className="eyebrow">
          FAST • SIMPLE • FREE
        </div>

        <h1>
          TikTok Video
          <br />
          <span>& MP3 Downloader</span>
        </h1>

        <p className="description">
          Tempel link TikTok publik dan download
          video atau audio dengan cepat.
        </p>

        <div className="download-box">
          <input
            type="text"
            placeholder="https://www.tiktok.com/@username/video/..."
            value={url}
            onChange={(event) =>
              setUrl(event.target.value)
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleDownload();
              }
            }}
          />

          <button
            onClick={handleDownload}
            disabled={loading}
          >
            {loading ? "Memproses..." : "Download"}
          </button>
        </div>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {result && (
          <div className="result-card">
            {result.cover && (
              <img
                src={result.cover}
                alt="TikTok cover"
                className="thumbnail"
              />
            )}

            <div className="result-content">
              <small>HASIL DOWNLOAD</small>

              <h2>
                {result.title || "TikTok Video"}
              </h2>

              {result.author && (
                <p className="author">
                  @{result.author.unique_id ||
                    result.author.nickname}
                </p>
              )}

              <div className="buttons">
                {result.play && (
                  <a
                    href={result.play}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="download-button main"
                  >
                    ↓ Video
                  </a>
                )}

                {result.wmplay && (
                  <a
                    href={result.wmplay}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="download-button"
                  >
                    ↓ Watermark
                  </a>
                )}

                {result.music && (
                  <a
                    href={result.music}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="download-button"
                  >
                    ♪ MP3
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="steps">
        <div className="step">
          <span>01</span>
          <h3>Paste Link</h3>
          <p>
            Salin URL TikTok dan masukkan
            ke kolom downloader.
          </p>
        </div>

        <div className="step">
          <span>02</span>
          <h3>Process</h3>
          <p>
            Sistem memproses URL TikTok
            melalui server API.
          </p>
        </div>

        <div className="step">
          <span>03</span>
          <h3>Download</h3>
          <p>
            Pilih video atau MP3 yang
            ingin kamu simpan.
          </p>
        </div>
      </section>

      <footer>
        Gunakan layanan ini hanya untuk
        konten yang kamu berhak mengunduh.
      </footer>
    </main>
  );
}
