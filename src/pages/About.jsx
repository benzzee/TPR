import { Building2, Target, Lightbulb, Fingerprint, Award, Users } from 'lucide-react';
import './About.css';
import siteData from '../data/siteData.json';

export function About() {
  const { about } = siteData;
  const { vision, philosophy, identity, uniqueness, videoUrl, orgChartUrl, history, personnel } = about;

  return (
    <div className="about-container animate-fade-in">
      <div className="page-header">
        <div className="badge">ข้อมูลสถานศึกษา</div>
        <h1 className="text-h1">{about.title || "เกี่ยวกับสถานฝึกสอน"}</h1>
        <p className="text-body max-w-2xl">{about.description || "ข้อมูลวิสัยทัศน์ ปรัชญา และบุคลากรของวิทยาลัย"}</p>
      </div>

      {/* Philosophy, Vision, Identity section */}
      <div className="core-values-grid">
        <div className="value-card">
          <div className="value-icon-wrapper vision-icon">
            <Target size={24} />
          </div>
          <h3>วิสัยทัศน์ (Vision)</h3>
          <p>{vision}</p>
        </div>
        
        <div className="value-card">
          <div className="value-icon-wrapper philosophy-icon">
            <Lightbulb size={24} />
          </div>
          <h3>ปรัชญา (Philosophy)</h3>
          <p>{philosophy}</p>
        </div>

        <div className="value-card">
          <div className="value-icon-wrapper identity-icon">
            <Fingerprint size={24} />
          </div>
          <h3>อัตลักษณ์ (Identity)</h3>
          <p>{identity}</p>
        </div>

        <div className="value-card">
          <div className="value-icon-wrapper uniqueness-icon">
            <Award size={24} />
          </div>
          <h3>เอกลักษณ์ (Uniqueness)</h3>
          <p>{uniqueness}</p>
        </div>
      </div>

      {/* Video Section */}
      {videoUrl && (
        <div className="video-section animate-fade-in">
          <div className="section-header">
            <h2 className="text-h2">วิดีทัศน์แนะนำวิทยาลัย</h2>
          </div>
          <div className="video-wrapper glass-panel">
            <iframe 
              src={videoUrl} 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {/* Organization Chart Section */}
      {orgChartUrl && (
        <div className="org-chart-section animate-fade-in">
          <div className="section-header">
            <h2 className="text-h2">แผนผังองค์กร</h2>
          </div>
          <div className="org-chart-wrapper glass-panel">
            <img src={orgChartUrl} alt="แผนผังองค์กร" className="org-chart-image" />
          </div>
        </div>
      )}

      {/* History section */}
      <div className="history-section glass-panel">
        <div className="history-header">
          <Building2 size={28} className="history-icon" />
          <h2 className="text-h2">ประวัติความเป็นมา</h2>
        </div>
        <div className="timeline">
          {history.map((item, index) => (
            <div key={index} className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <span className="timeline-year">{item.year}</span>
                <h4 className="timeline-title">{item.title}</h4>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Personnel section */}
      <div className="personnel-section">
        <div className="section-header center">
          <Users size={32} className="section-icon" />
          <h2 className="text-h2">บุคลากรที่เกี่ยวข้อง</h2>
          <p className="text-body">ครูพี่เลี้ยงและบุคลากรทางการศึกษา</p>
        </div>

        <div className="personnel-grid">
          {personnel.map((person, index) => (
            <div key={index} className="person-card">
              <div className="person-image-container">
                <img src={person.imageUrl} alt={person.name} className="person-image" />
                <div className="person-image-overlay"></div>
              </div>
              <div className="person-info">
                <h3 className="person-name">{person.name}</h3>
                <p className="person-role">{person.position}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
