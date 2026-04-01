"use client";

import { useState } from "react";
import { Search, Menu, Zap, Shield, User, Download, Upload, X } from "lucide-react";

// --- MOCK DATA (Nanti diganti dengan data dari Supabase) ---
const mockMods = [
  {
    id: 1,
    title: "AUTO FISHING SSRP",
    author: "littlestargarden",
    downloads: 26,
    tags: ["UNIVERSAL", "MOONLOADER"],
    status: "VERIFIED",
    image: "https://via.placeholder.com/400x200/1a1a1a/1db954?text=Auto+Fishing",
  },
  {
    id: 2,
    title: "AUTO FISH IT MANDALIKA",
    author: "kotka",
    downloads: 54,
    tags: ["UNIVERSAL", "MOONLOADER"],
    status: "OFFICIAL",
    image: "https://via.placeholder.com/400x200/0a192f/1db954?text=Auto+Fish+Mandalika",
  },
];

export default function SAForgeWeb() {
  const [activeTab, setActiveTab] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- KOMPONEN NAVBAR ---
  const Navbar = () => (
    <nav className="flex items-center justify-between p-4 bg-[#0d0d0d] border-b border-gray-800 sticky top-0 z-50">
      <div className="text-xl font-black tracking-wider cursor-pointer" onClick={() => setActiveTab("home")}>
        <span className="text-white">SA</span>
        <span className="text-[#1db954]">FORGE</span>
      </div>
      <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-300 hover:text-white">
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-[#111] border-b border-gray-800 flex flex-col p-4 space-y-4">
          <button onClick={() => { setActiveTab("home"); setIsMobileMenuOpen(false); }} className="text-left font-medium text-gray-300">Beranda</button>
          <button onClick={() => { setActiveTab("gudang"); setIsMobileMenuOpen(false); }} className="text-left font-medium text-[#1db954] bg-gray-900/50 p-2 rounded-lg border border-[#1db954]/20">Gudang Mod</button>
          <button onClick={() => { setActiveTab("admin"); setIsMobileMenuOpen(false); }} className="text-left font-medium text-gray-300">Admin Panel</button>
          <button className="w-full py-3 mt-2 font-bold text-white bg-[#1db954] rounded-lg">LOGIN MEMBER</button>
        </div>
      )}
    </nav>
  );

  // --- HALAMAN BERANDA ---
  const Home = () => (
    <div className="flex flex-col gap-8 pb-12">
      {/* Hero Section */}
      <div className="relative px-4 py-16 text-center border-b border-gray-800 bg-gradient-to-b from-gray-900 to-[#0d0d0d]">
        <div className="inline-block px-4 py-1 mb-6 text-xs font-bold text-[#1db954] border border-[#1db954]/30 rounded-full bg-[#1db954]/10">
          ● GTA SA MODDING COMMUNITY
        </div>
        <h1 className="mb-4 text-5xl font-black tracking-tighter text-white">
          SA <span className="text-[#1db954]">FORGE</span>
        </h1>
        <p className="mb-8 text-sm text-gray-400">
          Koleksi modifikasi visual, script Lua, dan tools eksklusif untuk <span className="text-white font-semibold">Personal Player</span> GTA San Andreas Multiplayer.
        </p>
        <div className="flex flex-col gap-3">
          <button onClick={() => setActiveTab("gudang")} className="flex items-center justify-center w-full py-4 text-sm font-bold text-white transition-colors rounded-lg bg-[#1db954] hover:bg-[#179643]">
            CARI MOD →
          </button>
          <button className="flex items-center justify-center w-full py-4 text-sm font-bold text-white transition-colors bg-transparent border rounded-lg border-gray-600 hover:bg-gray-800">
            REQUEST SCRIPT
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="flex flex-col gap-4 px-4">
        {[
          { icon: <Zap className="text-[#1db954]" />, title: "LIGHTWEIGHT & FAST", desc: "Script efisien, ringan di PC & Android kentang, tanpa FPS drop." },
          { icon: <Shield className="text-[#1db954]" />, title: "SAFE FOR DAILY USE", desc: "Mod aman (legit) untuk aktivitas sehari-hari di berbagai server SAMP." },
          { icon: <User className="text-[#1db954]" />, title: "PERSONAL CUSTOM", desc: "Request script khusus sesuai gaya bermainmu." }
        ].map((feat, idx) => (
          <div key={idx} className="flex gap-4 p-4 border border-gray-800 rounded-xl bg-[#111]">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-900/50">
              {feat.icon}
            </div>
            <div>
              <h3 className="font-bold text-white uppercase">{feat.title}</h3>
              <p className="mt-1 text-xs text-gray-400">{feat.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // --- HALAMAN GUDANG MOD (USER VIEW) ---
  const GudangMod = () => (
    <div className="px-4 py-8">
      <div className="mb-6 text-xs font-bold text-[#1db954] uppercase tracking-wider">Koleksi Eksklusif</div>
      <h2 className="mb-2 text-4xl font-black text-white">GUDANG <span className="text-[#1db954]">MOD</span></h2>
      <p className="mb-6 text-sm text-gray-400">Script Lua, modifikasi visual, dan tools untuk GTA San Andreas.</p>
      
      <div className="flex gap-4 mb-6 text-xs text-gray-400">
        <span>● 50 Mod</span>
        <span>33 Gratis</span>
        <span className="text-yellow-500">17 VIP</span>
      </div>

      {/* Search & Filters */}
      <div className="p-4 mb-8 border border-gray-800 rounded-xl bg-[#111]">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Cari script, modpack, skin..." 
            className="w-full py-2 pl-10 pr-4 text-sm text-white bg-transparent border border-gray-700 rounded-lg focus:outline-none focus:border-[#1db954]"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg">Official</button>
          <button className="px-3 py-1.5 text-xs font-medium text-gray-300 border border-gray-700 rounded-lg">Verified</button>
          <button className="px-3 py-1.5 text-xs font-medium text-gray-300 border border-gray-700 rounded-lg">Unofficial</button>
          <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#1db954] border border-[#1db954]/30 bg-[#1db954]/10 rounded-lg">🌐 All</button>
        </div>
      </div>

      {/* Mod Cards List */}
      <div className="flex flex-col gap-6">
        {mockMods.map((mod) => (
          <div key={mod.id} className="overflow-hidden border border-gray-800 rounded-xl bg-[#111]">
            <div className="relative">
              <img src={mod.image} alt={mod.title} className="w-full h-40 object-cover" />
              <div className="absolute top-2 left-2 px-2 py-1 text-[10px] font-bold text-white bg-blue-600 rounded">👑 {mod.status}</div>
            </div>
            <div className="p-4">
              <div className="flex gap-2 mb-3">
                {mod.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 text-[10px] border border-gray-700 rounded text-gray-400">{tag}</span>
                ))}
              </div>
              <h3 className="mb-1 font-bold text-white">{mod.title}</h3>
              <div className="flex items-center justify-between mb-4 text-xs text-gray-400">
                <span>Oleh: <span className="text-white">{mod.author}</span></span>
                <span className="flex items-center gap-1"><Download size={12}/> {mod.downloads}</span>
              </div>
              <button className="w-full py-3 text-sm font-bold text-white rounded-lg bg-[#1db954] hover:bg-[#179643]">
                LIHAT DETAIL
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // --- HALAMAN ADMIN PANEL ---
  const AdminPanel = () => (
    <div className="px-4 py-8">
      <h2 className="mb-6 text-2xl font-black text-white">ADMIN <span className="text-[#1db954]">UPLOAD</span></h2>
      <div className="flex flex-col gap-4 p-4 border border-gray-800 rounded-xl bg-[#111]">
        
        <div>
          <label className="block mb-1 text-xs font-bold text-gray-400">Judul Mod/Script</label>
          <input type="text" className="w-full p-3 text-sm text-white bg-gray-900 border border-gray-700 rounded-lg focus:border-[#1db954] outline-none" placeholder="Contoh: Auto Farmer V2" />
        </div>

        <div>
          <label className="block mb-1 text-xs font-bold text-gray-400">Kategori</label>
          <select className="w-full p-3 text-sm text-white bg-gray-900 border border-gray-700 rounded-lg focus:border-[#1db954] outline-none">
            <option>Moonloader (Lua)</option>
            <option>CLEO</option>
            <option>Modpack</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 text-xs font-bold text-gray-400">File Thumbnail (Gambar)</label>
          <div className="flex items-center justify-center w-full h-24 border-2 border-gray-700 border-dashed rounded-lg bg-gray-900/50 hover:border-[#1db954] cursor-pointer">
             <span className="flex items-center gap-2 text-sm text-gray-400"><Upload size={16}/> Upload Gambar</span>
          </div>
        </div>

        <div>
          <label className="block mb-1 text-xs font-bold text-gray-400">File Script/Mod (.zip/.lua/.cs)</label>
          <div className="flex items-center justify-center w-full h-24 border-2 border-gray-700 border-dashed rounded-lg bg-gray-900/50 hover:border-[#1db954] cursor-pointer">
             <span className="flex items-center gap-2 text-sm text-gray-400"><Upload size={16}/> Upload File Mod</span>
          </div>
        </div>

        <div>
          <label className="block mb-1 text-xs font-bold text-gray-400">Deskripsi Lengkap</label>
          <textarea rows={4} className="w-full p-3 text-sm text-white bg-gray-900 border border-gray-700 rounded-lg focus:border-[#1db954] outline-none" placeholder="Tulis deskripsi, cara install, dan command di sini..."></textarea>
        </div>

        <button className="w-full py-3 mt-4 font-bold text-white rounded-lg bg-[#1db954] hover:bg-[#179643]">
          PUBLISH SCRIPT
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0d0d0d] font-sans selection:bg-[#1db954] selection:text-white pb-20">
      <Navbar />
      <main className="max-w-md mx-auto bg-[#0d0d0d] shadow-2xl shadow-black/50 min-h-screen border-x border-gray-900">
        {activeTab === "home" && <Home />}
        {activeTab === "gudang" && <GudangMod />}
        {activeTab === "admin" && <AdminPanel />}
      </main>
    </div>
  );
}
