import { useState } from 'react';
import { 
  FileCheck, 
  ExternalLink, 
  Download, 
  BookOpen, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Maximize2,
  Calendar,
  Sparkles,
  School,
  UserCheck
} from 'lucide-react';
import './Evaluation.css';
import siteData from '../data/siteData.json';

export function Evaluation() {
  const { evaluation, siteConfig } = siteData;
  const [activeTerm, setActiveTerm] = useState('term1');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentEval = evaluation ? evaluation[activeTerm] : null;
  const hasDoc = Boolean(currentEval && currentEval.previewUrl);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`evaluation-container animate-fade-in ${isFullscreen ? 'viewer-fullscreen-mode' : ''}`}>
      {/* Page Header */}
      <div className="page-header">
        <div className="badge">
          <FileCheck size={14} className="inline-icon" />
          <span>การประเมินผลการฝึกประสบการณ์วิชาชีพ</span>
        </div>
        <h1 className="text-h1">{evaluation?.title || 'แบบการประเมินฝึกสอน'}</h1>
        <p className="text-body max-w-3xl">
          {evaluation?.description || 'แบบประเมินผลการปฏิบัติการสอนและฝึกประสบการณ์วิชาชีพครูในสถานศึกษา ตลอดภาคเรียน'}
        </p>

        {/* Quick Info Badges */}
        <div className="eval-info-chips">
          <div className="eval-chip">
            <School size={16} className="text-primary" />
            <span>{siteConfig.schoolName}</span>
          </div>
          <div className="eval-chip">
            <UserCheck size={16} className="text-primary" />
            <span>{siteConfig.studentName}</span>
          </div>
          <div className="eval-chip highlight">
            <Sparkles size={16} />
            <span>ปีการศึกษา {siteConfig.academicYear}</span>
          </div>
        </div>
      </div>

      {/* Controls & Term Switcher */}
      <div className="evaluation-controls">
        <div className="tabs-wrapper glass-panel">
          <button 
            type="button"
            className={`tab-btn ${activeTerm === 'term1' ? 'active' : ''}`}
            onClick={() => setActiveTerm('term1')}
          >
            <div className="tab-title-group">
              <span>แบบประเมิน เทอม 1</span>
              <span className="term-indicator available" title="มีเอกสารพร้อมแสดง">
                <CheckCircle2 size={13} />
                <span>พร้อมแสดง</span>
              </span>
            </div>
          </button>
          
          <button 
            type="button"
            className={`tab-btn ${activeTerm === 'term2' ? 'active' : ''}`}
            onClick={() => setActiveTerm('term2')}
          >
            <div className="tab-title-group">
              <span>แบบประเมิน เทอม 2</span>
              <span className="term-indicator pending" title="รอข้อมูล">
                <Clock size={13} />
                <span>รออัปเดต</span>
              </span>
            </div>
          </button>
        </div>

        {/* Action Buttons */}
        {hasDoc && currentEval && (
          <div className="eval-actions-group">
            <a 
              href={currentEval.driveUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="eval-action-btn primary"
              title="เปิดดูไฟล์ต้นฉบับใน Google Drive ในแท็บใหม่"
            >
              <ExternalLink size={18} />
              <span>เปิดใน Google Drive</span>
            </a>

            <a 
              href={currentEval.driveUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="eval-action-btn secondary"
              title="ดาวน์โหลดไฟล์แบบประเมิน"
            >
              <Download size={18} />
              <span>ดาวน์โหลดเอกสาร (PDF)</span>
            </a>
          </div>
        )}
      </div>

      {/* Viewer or Empty State */}
      {hasDoc && currentEval ? (
        <div className="eval-viewer-section animate-fade-in" key={activeTerm}>
          <div className="eval-viewer-card glass-panel">
            {/* Top Toolbar */}
            <div className="eval-viewer-header">
              <div className="eval-viewer-title">
                <div className="doc-icon-wrapper">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="doc-name">{currentEval.fileName || currentEval.docTitle}</h3>
                  <div className="doc-meta">
                    <span className="doc-semester">{currentEval.semester}</span>
                    <span className="meta-dot">•</span>
                    <span className="doc-type">Google Drive PDF Viewer</span>
                  </div>
                </div>
              </div>

              <div className="eval-viewer-tools">
                <button 
                  type="button"
                  className="tool-btn" 
                  onClick={toggleFullscreen}
                  title={isFullscreen ? 'ย่อหน้าต่างกลับ' : 'ขยายเต็มหน้าต่าง'}
                >
                  <Maximize2 size={17} />
                  <span className="hide-mobile">{isFullscreen ? 'ย่อขนาด' : 'ขยายขนาด'}</span>
                </button>
                <a 
                  href={currentEval.driveUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="tool-btn open-tab"
                  title="เปิดในแท็บใหม่"
                >
                  <ExternalLink size={17} />
                  <span className="hide-mobile">แท็บใหม่</span>
                </a>
              </div>
            </div>

            {/* Google Drive Iframe Wrapper */}
            <div className="eval-iframe-container">
              <iframe 
                src={currentEval.previewUrl} 
                allow="autoplay" 
                title={`${currentEval.docTitle} - ${currentEval.semester}`}
                className="eval-iframe"
              />
            </div>

            {/* Document Reader Footer Hint */}
            <div className="eval-viewer-footer">
              <p>
                <BookOpen size={16} className="text-primary" />
                <span>
                  สามารถเปิดอ่าน เลื่อนหน้า และซูมขยายเอกสารผ่านโปรแกรมอ่านด้านบนได้ทันที หรือกดปุ่ม <strong>"เปิดใน Google Drive"</strong> เพื่อดูเอกสารฉบับเต็มและดาวน์โหลด
                </span>
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State for Term 2 (or terms without link yet) */
        <div className="eval-empty-section animate-fade-in" key={activeTerm}>
          <div className="eval-empty-card glass-panel">
            <div className="empty-icon-glow">
              <Clock size={36} />
            </div>
            <h2 className="empty-title">ยังไม่มีเอกสารแบบประเมินสำหรับ {currentEval?.semester || 'ภาคเรียนที่ 2'}</h2>
            <p className="empty-desc">
              เอกสารแบบประเมินผลการฝึกประสบการณ์วิชาชีพครูของภาคเรียนที่ 2 จะได้รับการบันทึกและนำขึ้นระบบเมื่อสิ้นสุดการประเมินการฝึกสอน
            </p>
            <div className="empty-actions">
              <button 
                type="button"
                className="empty-back-btn" 
                onClick={() => setActiveTerm('term1')}
              >
                <FileCheck size={18} />
                <span>กลับไปดูแบบประเมิน เทอม 1</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
