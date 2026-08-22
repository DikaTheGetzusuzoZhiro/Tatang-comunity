import { NextResponse } from "next/server";

export const runtime = "nodejs";

function isTikTokUrl(value: string): boolean {
  try {
    const url = new URL(value);

    const hostname =
      url.hostname.toLowerCase();

    return (
      hostname === "tiktok.com" ||
      hostname.endsWith(".tiktok.com")
    );
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const url = String(
      body?.url || ""
    ).trim();

    if (!url) {
      return NextResponse.json(
        {
          error: "URL TikTok wajib diisi."
        },
        {
          status: 400
        }
      );
    }

    if (!isTikTokUrl(url)) {
      return NextResponse.json(
        {
          error:
            "Masukkan URL TikTok yang valid."
        },
        {
          status: 400
        }
      );
    }

    /*
     * Provider API.
     *
     * Endpoint ini dipanggil dari server Vercel,
     * bukan langsung dari browser.
     *
     * Kamu bisa mengganti provider ini
     * dengan API downloader milikmu sendiri.
     */
    const providerUrl =
      `https://www.tikwm.com/api/?url=${encodeURIComponent(
        url
      )}`;

    const response = await fetch(
      providerUrl,
      {
        method: "GET",
        headers: {
          "User-Agent":
            "Mozilla/5.0"
        },
        cache: "no-store"
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            "Provider downloader sedang tidak tersedia."
        },
        {
          status: 502
        }
      );
    }

    const json = await response.json();

    if (
      json?.code !== 0 ||
      !json?.data
    ) {
      return NextResponse.json(
        {
          error:
            json?.msg ||
            "Video tidak ditemukan."
        },
        {
          status: 404
        }
      );
    }

    const data = json.data;

    return NextResponse.json({
      title: data.title || "TikTok Video",

      cover:
        data.cover || null,

      play:
        data.play || null,

      wmplay:
        data.wmplay || null,

      music:
        data.music || null,

      author: data.author
        ? {
            nickname:
              data.author.nickname,

            unique_id:
              data.author.unique_id
          }
        : null
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Gagal memproses link TikTok."
      },
      {
        status: 500
      }
    );
  }
}
