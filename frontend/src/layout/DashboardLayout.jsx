import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar'; // Assuming you have a Navbar

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar sits at the top */}
      <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} /> 
      
      <div className="flex pt-16"> {/* pt-16 accounts for Navbar height */}
        <Sidebar isOpen={isSidebarOpen} />
        
        <main className={`flex-1 transition-all duration-300 p-6 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <Outlet /> {/* This is where Dashboard, Tasks, or Teams pages will render */}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;