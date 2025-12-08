import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { useAuth } from '../../context/AuthContext';

// Initialize socket
const socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:4000');

const AlumniPage = () => {
  const { user } = useAuth();
  
  // Data States
  const [users, setUsers] = useState([]); // Displays either alumni or search results
  
  // UI States
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [connectingId, setConnectingId] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

  useEffect(() => {
    fetchAlumni();
  }, []);

  // --- LIVE SEARCH DEBOUNCE ---
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch();
      } else {
        fetchAlumni(); // Reset to default list if search cleared
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchAlumni = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/auth/alumni`, { withCredentials: true });
      if (data.success) setUsers(data.alumni);
    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/auth/search?query=${searchQuery}`, { withCredentials: true });
      if (data.success) setUsers(data.users);
    } catch (error) { console.error("Search failed"); } 
    finally { setLoading(false); }
  };

  // --- CONNECT ACTION ---
  const handleConnect = async (targetUser) => {
    setConnectingId(targetUser._id);
    
    try {
      const { data } = await axios.post(`${API_URL}/chat/request`, 
        { 
          receiverId: targetUser._id, 
          topic: `Connection Request from ${user.name}` 
        },
        { withCredentials: true }
      );

      if (data.success) {
        // Notify via Socket
        socket.emit("send_request", {
            receiverId: targetUser._id,
            senderName: user.name
        });
        
        alert(`Request sent to ${targetUser.name}!`);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Connection failed. Request might already be pending.");
    } finally {
      setConnectingId(null);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-8 animate-fade-in font-sans">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-red-900/30 pb-6">
        <div>
          <h2 className="text-4xl font-bold text-white glow-text font-creepster tracking-wider mb-2">
            Global Network
          </h2>
          <p className="text-gray-400">Find agents, mentors, and alumni. Build your alliance.</p>
        </div>
        
        <div className="relative w-full md:w-1/3">
           <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/50 border border-red-900/50 rounded-lg px-4 py-3 pl-10 text-white focus:border-red-500 outline-none transition-all shadow-[0_0_10px_rgba(220,38,38,0.1)] focus:shadow-[0_0_15px_rgba(220,38,38,0.3)]"
           />
           <span className="absolute left-3 top-3.5 text-gray-500">🔍</span>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20 text-red-600 animate-pulse font-creepster text-2xl">Searching Database...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
           {users.length > 0 ? (
             users.map((u) => (
               <div key={u._id} className="relative p-6 bg-gray-900/40 border border-red-900/20 rounded-xl hover:border-red-500/50 transition-all duration-300 group hover:bg-black/60 backdrop-blur-sm overflow-hidden flex flex-col">
                  
                  <div className="flex items-center gap-4 mb-4">
                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-full bg-black border-2 border-red-900/50 p-1 flex-shrink-0 group-hover:border-red-500 transition-colors shadow-lg shadow-red-900/20 overflow-hidden">
                       <img 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`} 
                        alt="User" 
                        className="w-full h-full object-cover rounded-full" 
                      />
                    </div>
                    <div>
                       <h4 className="text-xl font-bold text-white truncate group-hover:text-red-400 transition-colors">{u.name}</h4>
                       <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${u.roles.includes('Mentor') ? 'border-purple-500 text-purple-400 bg-purple-900/20' : 'border-blue-500 text-blue-400 bg-blue-900/20'}`}>
                          {u.roles[0] || 'Member'}
                       </span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-2 mb-6">
                     <p className="text-sm text-gray-400 flex items-center gap-2">
                        🏢 {u.company || 'Unknown Org'}
                     </p>
                     <p className="text-sm text-gray-400 flex items-center gap-2">
                        💼 {u.roleTitle || 'Operative'}
                     </p>
                  </div>

                  {/* Connect Button */}
                  <button 
                    onClick={() => handleConnect(u)}
                    disabled={connectingId === u._id}
                    className="w-full bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-600/50 py-2 rounded-lg text-sm font-bold uppercase tracking-widest transition-all shadow-[0_0_10px_rgba(220,38,38,0.1)] hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {connectingId === u._id ? 'Sending...' : 'Connect'}
                  </button>
               </div>
             ))
           ) : (
              <div className="col-span-full text-center py-12">
                 <p className="text-gray-500 text-lg">No matching agents found.</p>
              </div>
           )}
        </div>
      )}
    </div>
  );
};

export default AlumniPage;