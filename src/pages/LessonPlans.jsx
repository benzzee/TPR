import { useState } from 'react';
import { Book, ExternalLink, ChevronLeft, ChevronRight, BookOpen, Download } from 'lucide-react';
import './LessonPlans.css';
import siteData from '../data/siteData.json';

export function LessonPlans() {
  const { lessonPlans } = siteData;
  const [activeTerm, setActiveTerm] = useState('term1');

  const currentPlan = lessonPlans[activeTerm];

  return (
    <div className="lesson-plans-container animate-fade-in">
      <div className="page-header">
        <div className="badge">หลักสูตรและการสอน</div>
        <h1 className="text-h1">{lessonPlans.title}</h1>
        <p className="text-body max-w-3xl">{lessonPlans.description}</p>
      </div>

      <div className="plans-controls">
        <div className="tabs-wrapper glass-panel">
          <button 
            className={`tab-btn ${activeTerm === 'term1' ? 'active' : ''}`}
            onClick={() => setActiveTerm('term1')}
          >
            แผนการสอน เทอม 1
          </button>
          <button 
            className={`tab-btn ${activeTerm === 'term2' ? 'active' : ''}`}
            onClick={() => setActiveTerm('term2')}
          >
            แผนการสอน เทอม 2
          </button>
        </div>

        <a 
          href={currentPlan.ebookUrl.replace('/preview', '/view')} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="drive-link-btn"
        >
          <Download size={18} />
          <span>ดาวน์โหลดเล่มแผน</span>
        </a>
      </div>

      <div className="ebook-viewer-section animate-fade-in" key={activeTerm}>
        <div className="ebook-frame-container">
          <div className="ebook-spine"></div>
          <div className="ebook-content glass-panel">
            <div className="ebook-header">
              <div className="ebook-title">
                <BookOpen size={20} className="text-primary" />
                <span>{currentPlan.semester}</span>
              </div>
              <div className="ebook-actions">
                <span className="ebook-status">E-Book Reader Mode</span>
              </div>
            </div>
            
            <div className="iframe-wrapper">
              <iframe 
                src={currentPlan.ebookUrl} 
                allow="autoplay" 
                title={`แผนการสอน ${currentPlan.semester}`}
                className="ebook-iframe"
              ></iframe>
            </div>
          </div>
        </div>
        
        <div className="ebook-footer-info">
          <p>
            <Book size={16} />
            <span>สามารถเปิดอ่านและเลื่อนดูหน้าต่างๆ ได้โดยตรง หรือคลิกปุ่ม "ดาวน์โหลด" เพื่อเก็บไฟล์ไว้ในเครื่อง</span>
          </p>
        </div>
      </div>
    </div>
  );
}
