import { Mail, Globe, Link, GraduationCap, MapPin, Building, School } from 'lucide-react';
import './Creators.css';
import siteData from '../data/siteData.json';

export function Creators() {
  const { creators } = siteData;
  const { student } = creators;

  return (
    <div className="creators-container animate-fade-in">
      <div className="page-header">
        <div className="badge">ผู้รับผิดชอบโครงการ</div>
        <h1 className="text-h1">{creators.title}</h1>
      </div>

      <div className="creator-profile-card glass-panel">
        <div className="profile-header-bg"></div>
        <div className="profile-content">
          <div className="profile-image-section">
            <div className="profile-image-wrapper">
              <img src={student.imageUrl} alt={student.name} className="profile-img" />
            </div>
            <div className="profile-main-info">
              <h2 className="student-name">{student.name}</h2>
              <span className="student-id">รหัสนักศึกษา: {student.studentId}</span>
            </div>
          </div>

          <div className="profile-details-grid">
            <div className="detail-item">
              <div className="detail-icon"><School size={20} /></div>
              <div className="detail-info">
                <label>คณะ</label>
                <span>{student.faculty}</span>
              </div>
            </div>
            <div className="detail-item">
              <div className="detail-icon"><Building size={20} /></div>
              <div className="detail-info">
                <label>ภาควิชา</label>
                <span>{student.department}</span>
              </div>
            </div>
            <div className="detail-item">
              <div className="detail-icon"><GraduationCap size={20} /></div>
              <div className="detail-info">
                <label>สาขาวิชา</label>
                <span>{student.major}</span>
              </div>
            </div>
            <div className="detail-item">
              <div className="detail-icon"><MapPin size={20} /></div>
              <div className="detail-info">
                <label>วิทยาเขต</label>
                <span>{student.campus}</span>
              </div>
            </div>
          </div>

          <div className="university-footer">
            <div className="uni-logo-placeholder">
              <GraduationCap size={32} className="text-primary" />
            </div>
            <div className="uni-info">
              <p className="uni-name">{student.university}</p>
            </div>
          </div>

          <div className="profile-actions">
            <a href={`mailto:${student.email}`} className="action-btn email">
              <Mail size={18} />
              <span>อีเมล</span>
            </a>
            <a href={student.facebook} target="_blank" rel="noopener noreferrer" className="action-btn facebook">
              <Globe size={18} />
            </a>
            <a href={student.github} target="_blank" rel="noopener noreferrer" className="action-btn github">
              <Link size={18} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
