# 🗳️ NEXUS VOTING - Decentralized Governance System

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/Frontend-React_Vite-cyan)
![Solidity](https://img.shields.io/badge/Blockchain-Solidity-black)
![Network](https://img.shields.io/badge/Network-Sepolia_Testnet-purple)

> **"The Future of Voting is On-Chain."**

Nexus Voting adalah aplikasi **dApp (Decentralized Application)** berbasis blockchain yang memungkinkan pemilihan (voting) yang transparan, aman, dan tidak dapat dimanipulasi (immutable). Dibangun dengan antarmuka futuristik bertema **Cyberpunk/Neon**, aplikasi ini menghubungkan pengguna melalui MetaMask ke jaringan Ethereum (Sepolia Testnet).

---

## 📸 Screenshots

![UI Preview](./Preview.png)
*(Tampilan Dashboard Nexus Voting dengan integrasi MetaMask)*

---

## ⚡ Fitur Utama

* **🦊 Wallet Connection:** Login aman menggunakan MetaMask.
* **🔗 Smart Contract Integration:** Logika voting berjalan 100% di blockchain Ethereum (Sepolia).
* **🎨 Cyberpunk UI:** Desain futuristik menggunakan **Tailwind CSS** & Glassmorphism.
* **📜 Real-time History:** Menampilkan riwayat transaksi voting langsung dari blockchain via Etherscan API.
* **🤖 Anti-Double Vote:** Sistem keamanan Smart Contract mencegah satu wallet memilih dua kali.

---

## 🛠️ Tech Stack

* **Frontend:** React.js (Vite), Tailwind CSS v3, Ethers.js v6.
* **Backend:** Node.js, Express (API Proxy).
* **Blockchain:** Solidity (Smart Contract), Remix IDE.
* **Network:** Sepolia Testnet.
* **Tools:** MetaMask, Etherscan API.

---

## 🚀 Instalasi & Setup

Ikuti langkah-langkah ini untuk menjalankan proyek di komputer lokal.

### Prasyarat
1.  **Node.js** terinstall.
2.  Ekstensi **MetaMask** di browser.
3.  Saldo **Sepolia ETH** (Ambil gratis di Sepolia Faucet).

### 1. Smart Contract (Blockchain)
1.  Buka [Remix IDE](https://remix.ethereum.org/).
2.  Buat file `Voting.sol` dan copy source code kontrak.
3.  Compile & Deploy ke **Injected Provider - MetaMask (Sepolia)**.
4.  **PENTING:** Simpan **Contract Address** dan **ABI** setelah deploy.

### 2. Backend (Server)
```bash
# Masuk ke folder root
cd uas-dapp

# Install dependencies
npm install

# Jalankan server
node server.js

```

*Server berjalan di `http://localhost:3001*`

### 3. Frontend (Client)

```bash
# Buka terminal baru, masuk ke folder client
cd client

# Install dependencies (Pastikan versi Ethers & Tailwind sesuai)
npm install
npm install ethers@6.13.5
npm install -D tailwindcss@3.4.17 postcss autoprefixer

# Konfigurasi Environment
# Buka file src/constants.js dan isi:
# - CONTRACT_ADDRESS (Dari Remix)
# - ETHERSCAN_API_KEY (Dari Etherscan)
# - CONTRACT_ABI (Dari Remix)

# Jalankan Frontend
npm run dev

```

*Aplikasi berjalan di `http://localhost:5173*`

---

## ⚙️ Konfigurasi Penting

Pastikan file `src/constants.js` memiliki format yang benar agar tidak error:

```javascript
export const CONTRACT_ADDRESS = "0xYourContractAddress...";
export const ETHERSCAN_API_KEY = "YourEtherscanKey...";
export const CONTRACT_ABI = [ ... ]; // Array ABI dari Remix

```

---

## 🐛 Troubleshooting

* **Error `ethers.BrowserProvider is not a constructor**`:
Pastikan Anda menggunakan ethers versi 6 (`npm install ethers@6.13.5`).
* **Error `Invalid Fragment` atau `contract.vote is not a function**`:
Cek kembali `CONTRACT_ABI` di `constants.js`. Pastikan format JSON valid dan mengandung fungsi `vote`.
* **Tailwind tidak muncul**:
Pastikan file `src/index.css` sudah berisi `@tailwind base; ...` dan terimport di `main.jsx`.

Made with 💙 and ☕ code.
