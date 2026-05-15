import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Menu, GraduationCap } from 'lucide-react';
import siteData from '../data/siteData.json';

export function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="app-layout">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Mobile Header */}
      <header className="mobile-header">
        <div className="flex-center" style={{ gap: '0.75rem' }}>
          <div className="logo-container" style={{ width: '36px', height: '36px', borderRadius: '8px' }}>
            <GraduationCap size={20} />
          </div>
          <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{siteData.siteConfig.shortName}</span>
        </div>
        <button className="mobile-menu-btn" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
      </header>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
