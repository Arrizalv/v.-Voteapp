import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import { CONTRACT_ADDRESS, CONTRACT_ABI, ETHERSCAN_API_KEY } from './constants';

function App() {
  const [account, setAccount] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [contract, setContract] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  // --- LOGIC BAGIAN ATAS SAMA PERSIS KAYA SEBELUMNYA ---
  
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        initializeContract(accounts[0]);
        fetchTransactionHistory(accounts[0]);
      } catch (error) {
        console.error("User reject connection", error);
      }
    } else {
      alert("Install MetaMask dulu bro!");
    }
  };

  const initializeContract = async (currentAccount) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const votingContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    setContract(votingContract);
    fetchCandidates(votingContract);
  };

  const fetchCandidates = async (votingContract) => {
    try {
      const data = await votingContract.getAllCandidates();
      const formattedData = data.map((candidate) => ({
        id: Number(candidate.id),
        name: candidate.name,
        voteCount: Number(candidate.voteCount),
      }));
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
        setHistory(response.data.result.slice(0, 5));
      }
    } catch (error) {
      console.error("Gagal ambil history", error);
    }
  };

  const handleVote = async (id) => {
    if (!contract) return;
    try {
      setLoading(true);
      setStatus("⏳ Lagi ngirim transaksi ke blockchain...");
      
      const tx = await contract.vote(id);
      setStatus("🚀 Transaksi dikirim! Nunggu konfirmasi...");
      
      await tx.wait();
      setStatus("✅ Vote Berhasil!");
      
      fetchCandidates(contract);
      setLoading(false);
    } catch (error) {
      console.error(error);
      if(error.reason) alert(error.reason);
      else alert("Vote gagal / Ditolak user");
      setLoading(false);
      setStatus("");
    }
  };

  useEffect(() => {
    if(window.ethereum && window.ethereum.selectedAddress) {
       connectWallet();
    }
  }, []);

  // --- BAGIAN UI DENGAN TAILWIND ---

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-blue-800 mb-2">🗳️ E-Voting Blockchain</h1>
          <p className="text-gray-600">Secure Voting System using Sepolia Testnet</p>
        </header>

        {!account ? (
          <div className="flex justify-center mt-20">
            <button 
              onClick={connectWallet} 
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition transform hover:scale-105"
            >
              🦊 Connect MetaMask Wallet
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* WALLET INFO */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center">
              <span className="text-gray-500 text-sm">Connected Wallet:</span>
              <span className="font-mono bg-gray-100 px-3 py-1 rounded text-blue-600 font-bold text-sm md:text-base truncate max-w-xs md:max-w-full">
                {account}
              </span>
            </div>

            {/* STATUS NOTIFICATION */}
            {status && (
              <div className={`p-4 rounded-lg text-center font-semibold ${status.includes("Berhasil") ? "bg-green-100 text-green-700" : "bg-blue-50 text-blue-700"}`}>
                {status}
              </div>
            )}

            {/* VOTING SECTION */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-blue-500 pl-3">Daftar Kandidat</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {candidates.map((candidate) => (
                  <div key={candidate.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition duration-300 flex flex-col items-center text-center border border-gray-100">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-3xl mb-4">
                      👤
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{candidate.name}</h3>
                    <div className="text-gray-500 mb-6">
                      Total Suara: <span className="text-2xl font-bold text-blue-600">{candidate.voteCount}</span>
                    </div>
                    <button 
                      onClick={() => handleVote(candidate.id)} 
                      disabled={loading}
                      className={`w-full py-2 px-4 rounded-lg font-semibold text-white transition ${
                        loading 
                          ? "bg-gray-400 cursor-not-allowed" 
                          : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                      }`}
                    >
                      {loading ? 'Processing...' : 'VOTE SEKARANG'}
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* HISTORY SECTION */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-purple-500 pl-3">Riwayat Transaksi</h2>
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tx Hash</th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Value (ETH)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {history.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="px-6 py-4 text-center text-gray-400">Belum ada riwayat transaksi.</td>
                        </tr>
                      ) : (
                        history.map((tx) => (
                          <tr key={tx.hash} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <a 
                                href={`https://sepolia.etherscan.io/tx/${tx.hash}`} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-blue-500 hover:text-blue-700 hover:underline"
                              >
                                {tx.hash.substring(0, 10)}...
                              </a>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{tx.from.substring(0, 6)}...</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{tx.to.substring(0, 6)}...</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-mono">{ethers.formatEther(tx.value)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;