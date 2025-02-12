import React, { useState, useRef, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Toaster } from 'react-hot-toast';

const Layout: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const workspaceRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      workspaceRef.current &&
      !workspaceRef.current.contains(event.target as Node) &&
      event.target instanceof HTMLElement &&
      !event.target.closest('.drawer')
    ) {
      closeSidebar();
    }
  };

  useEffect(() => {
    if (isSidebarOpen) {
        document.addEventListener('click', handleOutsideClick);
    } else {
        document.removeEventListener('click', handleOutsideClick);
    }
    return () => {
        document.removeEventListener('click', handleOutsideClick);
    };
  }, [isSidebarOpen]);

  return <>
    <Toaster/>
    <div className="min-h-screen flex flex-col lg:flex-row">
        <Navbar toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} />
        <Sidebar isOpen={isSidebarOpen} />
        <main id='working-area'
            ref={workspaceRef}
            className={`flex-grow p-4 pr-6 mt-20 lg:ml-60  text-gray-500 ${
            isSidebarOpen && 'pointer-events-none'
            }`}
        >
            {isSidebarOpen && ( 
                <div className="fixed inset-0 bg-black bg-opacity-50 z-20" onClick={closeSidebar}></div>
                )
            }
            <div className="relative z-10">
                <Outlet/>
            </div>
        </main>
    </div>
    </>;
};

export default Layout;

