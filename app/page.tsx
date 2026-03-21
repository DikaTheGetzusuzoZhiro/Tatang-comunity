"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [mods, setMods] = useState([]);

  useEffect(() => {
    fetch("/api/mods")
      .then(res => res.json())
      .then(setMods);
  }, []);

  return (
    <div style={{ background: "#0b0b0b", color: "white", minHeight: "100vh" }}>
      <h1 style={{ color: "#00ff88" }}>EXRY HUB</h1>

      {mods.map((mod: any, i) => (
        <div key={i} style={{ border: "1px solid #222", padding: 10, margin: 10 }}>
          <img src={mod.thumbnail} width="100%" />
          <h2>{mod.title}</h2>
          <p>{mod.description}</p>
          <a href={mod.fileUrl} target="_blank">Download</a>
        </div>
      ))}
    </div>
  );
}
