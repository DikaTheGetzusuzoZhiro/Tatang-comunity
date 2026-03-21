"use client";
import { useState } from "react";

export default function Admin() {
  const [data, setData] = useState({
    title: "",
    description: "",
    category: "cleo",
    fileUrl: "",
    thumbnail: ""
  });

  const submit = async () => {
    await fetch("/api/upload", {
      method: "POST",
      body: JSON.stringify(data)
    });
    alert("Upload sukses");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>ADMIN EXRY HUB</h1>

      <input placeholder="Judul" onChange={e => setData({...data, title: e.target.value})} />
      <input placeholder="Deskripsi" onChange={e => setData({...data, description: e.target.value})} />
      
      <select onChange={e => setData({...data, category: e.target.value})}>
        <option value="cleo">CLEO</option>
        <option value="moonloader">Moonloader</option>
        <option value="modpack">Modpack</option>
      </select>

      <input placeholder="Link File" onChange={e => setData({...data, fileUrl: e.target.value})} />
      <input placeholder="Thumbnail URL" onChange={e => setData({...data, thumbnail: e.target.value})} />

      <button onClick={submit}>UPLOAD</button>
    </div>
  );
}
