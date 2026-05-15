import { BookOpen, Users, Flag, Clock, Monitor, PenTool, TrendingUp, Presentation, AlertTriangle } from 'lucide-react';
import './Home.css';
import siteData from '../data/siteData.json';

// Create a mapping from icon names string to lucide components
const IconMap = {
  Users,
  Flag,
  Clock,
  TrendingUp,
  Monitor,
  BookOpen,
  PenTool,
  Presentation,
  AlertTriangle
};

export function Home() {
  const { home, siteConfig } = siteData;

  return (
    <div className="home-container animate-fade-in">
      <div className="hero-section">
        <div className="hero-content">
          <div className="badge">{siteConfig.academicYear}</div>
          <h1 className="text-h1 hero-title">
            <span className="text-gradient">{siteConfig.title}</span><br />
            {siteConfig.subtitle.split(' ')[0]}
          </h1>
          <p className="hero-subtitle">
            {home.welcomeText}
          </p>
          <div className="hero-stats">
            <div className="stat-card">
              <Presentation className="stat-icon" />
              <div className="stat-info">
                <h3>สื่อการสอน</h3>
                <p>รวบรวมสื่อและแผนการสอน</p>
              </div>
            </div>
            <div className="stat-card">
              <BookOpen className="stat-icon" />
              <div className="stat-info">
                <h3>วิจัยในชั้นเรียน</h3>
                <p>การศึกษาและพัฒนาผู้เรียน</p>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-image-wrapper">
          <div className="abstract-shape">
            <div className="glass-card main-glass">
              <GraduationCapIcon size={80} />
            </div>
            <div className="circle circle-1"></div>
            <div className="circle circle-2"></div>
          </div>
        </div>
      </div>

      <div className="responsibilities-section">
        <div className="section-header">
          <h2 className="text-h2">งานที่รับผิดชอบ</h2>
          <p className="text-body">บทบาทและหน้าที่ระหว่างการฝึกปฏิบัติการสอน</p>
        </div>
        
        <div className="grid-cards">
          {home.responsibilities.map((item) => {
            const IconComponent = IconMap[item.iconName] || AlertTriangle;
            return (
              <div key={item.id} className="resp-card" style={{ '--accent-color': item.color }}>
                <div className="resp-icon-wrapper" style={{ color: item.color, backgroundColor: `${item.color}15` }}>
                  <IconComponent size={24} />
                </div>
                <h3 className="resp-title">{item.title}</h3>
                <p className="resp-desc">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function GraduationCapIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="url(#pink-gradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <linearGradient id="pink-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff6b95" />
          <stop offset="100%" stopColor="#e84c7b" />
        </linearGradient>
      </defs>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}
