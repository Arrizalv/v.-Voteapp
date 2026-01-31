import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import { CONTRACT_ADDRESS, CONTRACT_ABI, ETHERSCAN_API_KEY } from './constants';

// --- DATA DUMMY BIAR KEREN ---
const DUMMY_HISTORY = [
  { hash: "0x71a...9b2", from: "0xIsyana...Wrld", to: "0xVoting...Ctrct", value: "0.05", time: "2 mins ago" },
  { hash: "0x82b...3c1", from: "0xElon...Msk", to: "0xVoting...Ctrct", value: "0.12", time: "5 mins ago" },
  { hash: "0x93c...4d5", from: "0xSatoshi...Nkm", to: "0xVoting...Ctrct", value: "1.00", time: "1 hour ago" },
];

// Kita mapping ID Smart Contract (1 & 2) ke Tampilan Keren
const CANDIDATE_META = {
  1: { 
    role: "AI OVERLORD", 
    image: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Felix", 
    desc: "Menggantikan dosen dengan AI canggih." 
  },
  2: { 
    role: "CYBER PUNK", 
    image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Aneka&backgroundColor=b6e3f4", 
    desc: "Gratis token crypto untuk semua mahasiswa." 
  }
};

function App() {
  const [account, setAccount] = useState(null);
  // Default isi dummy biar gak kosong pas awal load
  const [candidates, setCandidates] = useState([
    { id: 1, name: "Alpha Zero (Loading...)", voteCount: 120, ...CANDIDATE_META[1] },
    { id: 2, name: "Beta Prime (Loading...)", voteCount: 95, ...CANDIDATE_META[2] }
  ]);
  const [contract, setContract] = useState(null);
  const [history, setHistory] = useState(DUMMY_HISTORY);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        initializeContract(accounts[0]);
        // Kita gabungin dummy history sama real history nanti
        fetchTransactionHistory(accounts[0]);
      } catch (error) {
        console.error("User reject connection", error);
      }
    } else {
      alert("Install MetaMask dulu bro!");
    }
  };

  const initializeContract = async (currentAccount) => {
    try {
      // Ethers v6 Syntax
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const votingContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      setContract(votingContract);
      fetchCandidates(votingContract);
    } catch (err) {
      console.error("Error init contract", err);
    }
  };

  const fetchCandidates = async (votingContract) => {
    try {
      const data = await votingContract.getAllCandidates();
      // Gabungin data Real Blockchain dengan Metadata Keren kita
      const formattedData = data.map((candidate) => {
        const id = Number(candidate.id);
        return {
          id: id,
          name: candidate.name, // Nama asli dari contract (misal "Calon A")
          voteCount: Number(candidate.voteCount),
          ...CANDIDATE_META[id] // Timpa dengan gambar & role keren
        };
      });
      setCandidates(formattedData);
    } catch (error) {
      console.error("Gagal ambil kandidat", error);
    }
  };

  const fetchTransactionHistory = async (address) => {
    const url = `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${ETHERSCAN_API_KEY}`;
    
    try {
      const response = await axios.get(url);
      if (response.data.status === "1") {
        const realHistory = response.data.result.slice(0, 5).map(tx => ({
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          value: ethers.formatEther(tx.value),
          time: "Just now (Real)"
        }));
        // GABUNGIN Real History di atas, Dummy di bawah
        setHistory([...realHistory, ...DUMMY_HISTORY]);
      }
    } catch (error) {
      console.error("Gagal ambil history", error);
    }
  };

  const handleVote = async (id) => {
    if (!contract) return;
    try {
      setLoading(true);
      setStatus("⏳ INITIALIZING NEURAL LINK...");
      
      const tx = await contract.vote(id);
      setStatus("🚀 BROADCASTING TO BLOCKCHAIN...");
      
      await tx.wait();
      setStatus("✅ VOTE CONFIRMED ON-CHAIN!");
      
      fetchCandidates(contract);
      setLoading(false);
      setTimeout(() => setStatus(""), 5000);
    } catch (error) {
      console.error(error);
      if(error.reason) alert(error.reason);
      else alert("Transaction Failed");
      setLoading(false);
      setStatus("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-cyan-50 font-sans selection:bg-cyan-500 selection:text-black">
      
      {/* BACKGROUND PARTICLES EFFECT (CSS ONLY) */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #06b6d4 1px, transparent 0)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-16 border-b border-cyan-900/50 pb-8">
          <div>
            <h1 className="text-5xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
              NEXUS VOTING
            </h1>
            <p className="text-cyan-400/60 mt-2 font-mono tracking-widest text-sm">DECENTRALIZED GOVERNANCE SYSTEM v.2.0</p>
          </div>

          {!account ? (
            <button 
              onClick={connectWallet} 
              className="mt-6 md:mt-0 group relative px-8 py-3 bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 font-bold uppercase tracking-widest hover:bg-cyan-500 hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
            >
              <span className="absolute inset-0 w-full h-full border border-white/20 scale-105 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"></span>
              [ Connect Interface ]
            </button>
          ) : (
            <div className="flex items-center gap-4 mt-4 md:mt-0 bg-slate-900/80 px-4 py-2 rounded-lg border border-cyan-500/30 backdrop-blur-md">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
              <span className="font-mono text-sm text-cyan-300 truncate max-w-[150px]">{account}</span>
            </div>
          )}
        </header>

        {/* STATUS BAR */}
        {status && (
          <div className="mb-8 p-4 bg-cyan-900/20 border-l-4 border-cyan-500 text-cyan-400 font-mono text-sm animate-pulse">
            {">"} SYSTEM_MSG: {status}
          </div>
        )}

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* LEFT: CANDIDATES (2 Columns) */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
              <span className="text-cyan-500">01.</span> CANDIDATES
              <div className="h-px flex-grow bg-gradient-to-r from-cyan-900 to-transparent"></div>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {candidates.map((candidate) => (
                <div key={candidate.id} className="group relative bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all duration-500 overflow-hidden rounded-xl">
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="p-6 relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <span className="bg-slate-800 text-xs font-mono py-1 px-2 rounded text-cyan-400 border border-slate-700">ID: 0{candidate.id}</span>
                      <div className="text-right">
                         <span className="block text-3xl font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
                           {candidate.voteCount}
                         </span>
                         <span className="text-xs text-slate-500 uppercase">Total Votes</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                      <img src={candidate.image} alt="avatar" className="w-16 h-16 rounded-full border-2 border-slate-700 group-hover:border-cyan-400 transition-colors bg-slate-800" />
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">{candidate.name}</h3>
                        <p className="text-xs text-purple-400 font-bold tracking-wider">{candidate.role}</p>
                      </div>
                    </div>
                    
                    <p className="text-slate-400 text-sm mb-6 border-l-2 border-slate-700 pl-3 italic">
                      "{candidate.desc}"
                    </p>

                    <button 
                      onClick={() => handleVote(candidate.id)}
                      disabled={loading || !account}
                      className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded shadow-lg shadow-cyan-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                    >
                      {loading ? 'PROCESSING...' : 'INITIATE VOTE'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: HISTORY (Terminal Style) */}
          <div className="lg:col-span-1">
             <h2 className="text-2xl font-bold flex items-center gap-3 text-white mb-8">
              <span className="text-purple-500">02.</span> LIVE FEED
              <div className="h-px flex-grow bg-gradient-to-r from-purple-900 to-transparent"></div>
            </h2>

            <div className="bg-black/50 border border-slate-800 rounded-xl p-4 font-mono text-xs h-[500px] overflow-y-auto custom-scrollbar shadow-inner">
              <div className="text-slate-500 mb-4 border-b border-slate-800 pb-2">
                // MONITORING NETWORK: SEPOLIA<br/>
                // CONNECTION: SECURE<br/>
                // SYNCING NODES... OK
              </div>

              <div className="space-y-3">
                {history.map((tx, idx) => (
                  <div key={idx} className="p-3 bg-slate-900/50 border-l-2 border-cyan-500/30 hover:bg-slate-800 hover:border-cyan-400 transition-all">
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>HASH</span>
                      <a href={`https://sepolia.etherscan.io/tx/${tx.hash}`} target="_blank" className="text-cyan-500 hover:underline">{tx.hash.substring(0,8)}...</a>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-500">VAL</span>
                      <span className="text-purple-400">{tx.value} ETH</span>
                    </div>
                    <div className="text-right text-[10px] text-slate-600 mt-2">
                      {tx.time || "Unknown"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;