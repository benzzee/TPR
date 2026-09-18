import { useState } from 'react';
import { FileText, BookOpen, Presentation, ExternalLink, Download, FileSearch, Sparkles } from 'lucide-react';
import './Research.css';
import siteData from '../data/siteData.json';

export function Research() {
  const { research } = siteData;
  const [activeTab, setActiveTab] = useState('proposal');

  const tabList = [
    { id: 'proposal', label: 'เค้าโครงร่างงานวิจัย', icon: FileText },
    { id: 'fullPaper', label: 'เล่มวิจัย', icon: BookOpen },
    { id: 'slides', label: 'สไลด์เค้าโครงร่างงานวิจัย', icon: Presentation },
  ];

  const currentCategory = research?.categories?.[activeTab] || {
    title: tabList.find(t => t.id === activeTab)?.label,
    description: '',
    driveUrl: '',
    previewUrl: ''
  };

  return (
    <div className="research-container animate-fade-in">
      <div className="page-header">
        <div className="badge">วิจัยและพัฒนา</div>
        <h1 className="text-h1">{research?.title || "วิจัยในชั้นเรียน"}</h1>
        <p className="text-body max-w-3xl">
          {research?.description || "เอกสารการวิจัยในชั้นเรียนเพื่อพัฒนาการจัดการเรียนรู้"}
        </p>
      </div>

      <div className="research-controls">
        <div className="tabs-wrapper glass-panel">
          {tabList.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={18} className="tab-icon" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {currentCategory.driveUrl && (
          <a
            href={currentCategory.driveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="drive-link-btn"
          >
            <Download size={18} />
            <span>เปิด / ดาวน์โหลดเอกสาร</span>
            <ExternalLink size={14} className="external-icon" />
          </a>
        )}
      </div>

      <div className="research-content-section animate-fade-in" key={activeTab}>
        {currentCategory.previewUrl ? (
          <div className="doc-frame-container">
            <div className="doc-spine"></div>
            <div className="doc-content glass-panel">
              <div className="doc-header">
                <div className="doc-title">
                  <FileText size={20} className="text-primary" />
                  <span>{currentCategory.title}</span>
                </div>
                <div className="doc-actions">
                  <span className="doc-status">Document Reader Mode</span>
                </div>
              </div>

              <div className="iframe-wrapper">
                <iframe
                  src={currentCategory.previewUrl}
                  allow="autoplay"
                  title={currentCategory.title}
                  className="doc-iframe"
                ></iframe>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-state-container glass-panel">
            <div className="empty-state-icon-wrapper">
              <FileSearch size={48} className="empty-icon" />
              <Sparkles size={24} className="sparkle-icon" />
            </div>
            <h3 className="empty-title">{currentCategory.title}</h3>
            <p className="empty-description">
              {currentCategory.description || "ยังไม่ได้อัปโหลดเอกสารสำหรับหัวข้อนี้ หรืออยู่ในระหว่างดำเนินการจัดทำ"}
            </p>
            <div className="empty-hint-badge">
              <span>สามารถเพิ่มลิงก์ Google Drive ได้ในไฟล์ siteData.json</span>
            </div>
          </div>
        )}

        {currentCategory.previewUrl && (
          <div className="doc-footer-info">
            <p>
              <BookOpen size={16} />
              <span>
                สามารถเปิดอ่านและเลื่อนดูเนื้อหาได้โดยตรง หรือคลิกปุ่ม "เปิด / ดาวน์โหลดเอกสาร" ด้านบนเพื่อดูใน Google Drive
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
