import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Info, 
  Calendar, 
  BookOpen, 
  Activity, 
  CheckSquare, 
  PenTool, 
  FileText, 
  Users,
  GraduationCap,
  Clock,
  Award
} from 'lucide-react';
import siteData from '../data/siteData.json';
import './Sidebar.css';

const menuItems = [
  { path: '/', name: 'หน้าแรก', icon: Home },
  { path: '/about', name: 'เกี่ยวกับสถานฝึกสอน', icon: Info },
  { path: '/schedule', name: 'ตารางสอน', icon: Calendar },
  { path: '/lesson-plans', name: 'แผนการสอน', icon: BookOpen },
  { path: '/activities', name: 'กิจกรรม', icon: Activity },
  { path: '/portfolio', name: 'ผลงาน', icon: Award },
  { path: '/evaluation', name: 'แบบการประเมินฝึกสอน', icon: CheckSquare },
  { path: '/attendance', name: 'บันทึกการเข้าออกงาน', icon: Clock },
  { path: '/record', name: 'บันทึกการฝึกสอน', icon: PenTool },
  { path: '/research', name: 'วิจัยในชั้นเรียน', icon: FileText },
  { path: '/creators', name: 'จัดทำโดย', icon: Users },
];

export function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <>
      <div className={`mobile-overlay ${isOpen ? 'open' : ''}`} onClick={toggleSidebar}></div>
      
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <GraduationCap size={28} />
          </div>
          <div>
            <h1 className="sidebar-title">{siteData.siteConfig.shortName}</h1>
            <p className="sidebar-subtitle">{siteData.siteConfig.title}</p>
          </div>
        </div>

        <nav className="nav-menu">
          <h2 className="nav-section-title">เมนูหลัก</h2>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => {
                if (window.innerWidth <= 1024) toggleSidebar();
              }}
            >
              <item.icon className="nav-icon" size={20} />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-avatar">
            <Users size={20} />
          </div>
          <div className="user-info">
            <span className="user-name">{siteData.siteConfig.studentName}</span>
            <span className="user-role">{siteData.siteConfig.major || 'คณะครุศาสตร์อุตสาหกรรม'}</span>
          </div>
        </div>
      </div>
    </>
  );
}
