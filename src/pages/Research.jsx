import { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  BookOpen, 
  Presentation, 
  ExternalLink, 
  Download, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  Keyboard,
  FileSearch
} from 'lucide-react';
import './Research.css';
import siteData from '../data/siteData.json';

const slidesData = [
  {
    id: 1,
    slideNumber: "ปก",
    title: "หน้าปก",
    image: "/slides/slide_1.png",
    description: "การพัฒนาเว็บแอปพลิเคชันเพื่อการเรียนรู้แบบเกมมิฟิเคชัน (Gamification) เรื่อง ระบบเลขฐาน"
  },
  {
    id: 2,
    slideNumber: "3.5.1",
    title: "ที่มาและความสำคัญ",
    image: "/slides/slide_2.png",
    description: "สภาพปัญหาและความสำคัญของวิชาคณิตศาสตร์คอมพิวเตอร์"
  },
  {
    id: 3,
    slideNumber: "3.5.3",
    title: "วัตถุประสงค์",
    image: "/slides/slide_3.png",
    description: "วัตถุประสงค์การวิจัย 3 ประการ"
  },
  {
    id: 4,
    slideNumber: "3.5.4",
    title: "สมมติฐาน",
    image: "/slides/slide_4.png",
    description: "สมมติฐานงานวิจัย 2 ข้อ"
  },
  {
    id: 5,
    slideNumber: "3.5.5",
    title: "ขอบเขตงานวิจัย",
    image: "/slides/slide_5.png",
    description: "ขอบเขตการทำวิจัยในชั้นเรียน"
  },
  {
    id: 6,
    slideNumber: "3.5.5-ก",
    title: "กลุ่มเป้าหมาย",
    image: "/slides/slide_6.png",
    description: "นักเรียนระดับ ปวช.1 จำนวน 26 คน"
  },
  {
    id: 7,
    slideNumber: "3.5.5-ข",
    title: "เครื่องมือวิจัย",
    image: "/slides/slide_7.png",
    description: "ขอบเขตเนื้อหาและเครื่องมือที่ใช้ในการวิจัย"
  },
  {
    id: 8,
    slideNumber: "3.5.5-ค",
    title: "รูปแบบงานวิจัย",
    image: "/slides/slide_8.png",
    description: "แบบแผนการทดลอง One Group Pretest-Posttest Design"
  },
  {
    id: 9,
    slideNumber: "สรุป",
    title: "ตารางเวลาทำวิจัย",
    image: "/slides/slide_9.png",
    description: "ตารางเวลาการทำวิจัย ภาคเรียนที่ 2/2569 (16 สัปดาห์)"
  }
];

export function Research() {
  const { research } = siteData;
  const [activeTab, setActiveTab] = useState('proposal');
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const presentationRef = useRef(null);

  const tabList = [
    { id: 'proposal', label: 'เค้าโครงร่างงานวิจัย', icon: FileText },
    { id: 'slides', label: 'สไลด์เค้าโครงร่างงานวิจัย', icon: Presentation },
    { id: 'fullPaper', label: 'เล่มวิจัย', icon: BookOpen },
  ];

  const currentCategory = research?.categories?.[activeTab] || {
    title: tabList.find(t => t.id === activeTab)?.label,
    description: '',
    driveUrl: 'https://drive.google.com/file/d/1nlP30S4kJ_FHrdIekMgE4t9HZy6VHbAV/view?usp=drive_link',
    previewUrl: 'https://drive.google.com/file/d/1nlP30S4kJ_FHrdIekMgE4t9HZy6VHbAV/preview'
  };

  const currentSlide = slidesData[activeSlideIndex] || slidesData[0];

  const handleNextSlide = () => {
    setActiveSlideIndex(prev => (prev < slidesData.length - 1 ? prev + 1 : 0));
  };

  const handlePrevSlide = () => {
    setActiveSlideIndex(prev => (prev > 0 ? prev - 1 : slidesData.length - 1));
  };

  // Fullscreen API toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (presentationRef.current?.requestFullscreen) {
        presentationRef.current.requestFullscreen();
      } else if (presentationRef.current?.webkitRequestFullscreen) {
        presentationRef.current.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  };

  // Listen to browser fullscreen change event
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Keyboard navigation listener (Arrow Left/Right, Space, F key)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      if (activeTab === 'slides') {
        if (e.key === 'ArrowRight' || e.key === ' ') {
          e.preventDefault();
          handleNextSlide();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          handlePrevSlide();
        }
      }

      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, activeSlideIndex]);

  // Auto-play slideshow timer for slides tab
  useEffect(() => {
    if (!isPlaying || activeTab !== 'slides') return;

    const timer = setInterval(() => {
      handleNextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [isPlaying, activeTab, activeSlideIndex]);

  return (
    <div className="research-container animate-fade-in">
      <div className="page-header">
        <div className="badge">วิจัยและพัฒนา</div>
        <h1 className="text-h1">{research?.title || "วิจัยในชั้นเรียน"}</h1>
        <p className="text-body max-w-3xl">
          {research?.description || "เอกสารการวิจัยในชั้นเรียนเพื่อพัฒนาการจัดการเรียนรู้ ประกอบด้วยเค้าโครงร่างงานวิจัย เล่มรายงานวิจัยฉบับสมบูรณ์ และสไลด์นำเสนอ"}
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
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'slides') setActiveSlideIndex(0);
                }}
              >
                <Icon size={18} className="tab-icon" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {activeTab === 'slides' ? (
          <a
            href="https://canva.link/o532k7zqv9uur9j"
            target="_blank"
            rel="noopener noreferrer"
            className="drive-link-btn"
          >
            <Sparkles size={18} />
            <span>เปิดสไลด์บน Canva</span>
            <ExternalLink size={14} className="external-icon" />
          </a>
        ) : (
          (currentCategory.driveUrl || currentCategory.previewUrl) && (
            <a
              href={currentCategory.driveUrl || currentCategory.previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="drive-link-btn"
            >
              <Download size={18} />
              <span>เปิด / ดาวน์โหลดเอกสาร</span>
              <ExternalLink size={14} className="external-icon" />
            </a>
          )
        )}
      </div>

      {/* TAB 1: SLIDES (CANVA-STYLE PRESENTATION SLIDE DECK) */}
      {activeTab === 'slides' ? (
        <div 
          ref={presentationRef} 
          className={`canva-presentation-wrapper animate-fade-in ${isFullscreen ? 'fullscreen-mode' : ''}`}
        >
          {/* Top Control Bar */}
          <div className="canva-top-bar glass-panel">
            <div className="canva-topic-tabs">
              {slidesData.map((slide, sIdx) => {
                const isActive = sIdx === activeSlideIndex;
                return (
                  <button
                    key={slide.id}
                    className={`topic-pill-btn ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveSlideIndex(sIdx)}
                  >
                    <span className="pill-num">{slide.slideNumber}</span>
                    <span className="pill-title">{slide.title}</span>
                  </button>
                );
              })}
            </div>

            <div className="canva-actions-right">
              <button
                className={`pres-play-btn ${isPlaying ? 'playing' : ''}`}
                onClick={() => setIsPlaying(!isPlaying)}
                title={isPlaying ? "หยุดเล่นสไลด์อัตโนมัติ" : "เล่นสไลด์อัตโนมัติ"}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
              </button>

              <button 
                className="action-icon-btn"
                onClick={toggleFullscreen}
                title={isFullscreen ? "ออกจากเต็มจอ (Esc)" : "ขยายเต็มจอ (F)"}
              >
                {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
            </div>
          </div>

          {/* MAIN CANVA SLIDE DISPLAY CANVAS */}
          <div className="canva-slide-stage glass-panel">
            {/* Auto-play Timer Progress Bar */}
            {isPlaying && (
              <div className="slideshow-progress-bar">
                <div className="progress-fill" key={activeSlideIndex}></div>
              </div>
            )}

            {/* Main Slide Image Frame */}
            <div className="canva-slide-image-card animate-fade-in" key={currentSlide.id}>
              <img 
                src={currentSlide.image} 
                alt={currentSlide.title} 
                className="canva-slide-img"
              />

              {/* Floating Side Arrow Navigation Buttons */}
              <button 
                className="canva-arrow-btn prev"
                onClick={handlePrevSlide}
                title="สไลด์ก่อนหน้า (ลูกศรซ้าย)"
              >
                <ChevronLeft size={28} />
              </button>

              <button 
                className="canva-arrow-btn next"
                onClick={handleNextSlide}
                title="สไลด์ถัดไป (ลูกศรขวา / Space)"
              >
                <ChevronRight size={28} />
              </button>
            </div>

            {/* Floating Info Overlay Bar */}
            <div className="canva-slide-info-overlay">
              <div className="info-left">
                <span className="slide-badge-pill">{currentSlide.slideNumber}</span>
                <span className="slide-info-title">{currentSlide.title}</span>
              </div>
              <div className="info-right">
                <span className="slide-counter-badge">
                  สไลด์ {activeSlideIndex + 1} จาก {slidesData.length}
                </span>
              </div>
            </div>
          </div>

          {/* BOTTOM CANVA SLIDE THUMBNAILS STRIP */}
          <div className="canva-thumbnails-strip glass-panel">
            {slidesData.map((slide, tIdx) => {
              const isActive = tIdx === activeSlideIndex;
              return (
                <div
                  key={slide.id}
                  className={`thumbnail-card ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveSlideIndex(tIdx)}
                >
                  <img src={slide.image} alt={slide.title} className="thumb-img" />
                  <span className="thumb-num-badge">{slide.slideNumber}</span>
                </div>
              );
            })}
          </div>

          {/* Footer Keyboard Hint */}
          <div className="canva-deck-footer">
            <div className="keyboard-hint-pill">
              <Keyboard size={14} />
              <span>กด ⬅️ ➡️ เพื่อเลื่อนสไลด์ | กด F เพื่อขยายเต็มจอ</span>
            </div>
            <a 
              href="https://canva.link/o532k7zqv9uur9j"
              target="_blank"
              rel="noopener noreferrer"
              className="canva-direct-link"
            >
              <ExternalLink size={14} />
              <span>https://canva.link/o532k7zqv9uur9j</span>
            </a>
          </div>
        </div>
      ) : activeTab === 'proposal' ? (
        /* TAB 2: PROPOSAL (DOCUMENT READER VIEWER FOR เค้าโครงร่างงานวิจัย) */
        <div 
          ref={presentationRef}
          className={`research-content-section animate-fade-in ${isFullscreen ? 'fullscreen-mode' : ''}`} 
          key={activeTab}
        >
          <div className="doc-frame-container">
            <div className="doc-spine"></div>
            <div className="doc-content glass-panel">
              <div className="doc-header">
                <div className="doc-title">
                  <FileText size={20} className="text-primary" />
                  <span>{currentCategory.title} (เอกสารเค้าโครงร่างงานวิจัย)</span>
                </div>
                <div className="doc-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className="doc-status">Document Reader Mode</span>
                  <button 
                    className="action-icon-btn"
                    onClick={toggleFullscreen}
                    title={isFullscreen ? "ออกจากเต็มจอ (Esc)" : "ขยายเต็มจอ (F)"}
                  >
                    {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                  </button>
                </div>
              </div>

              <div className="iframe-wrapper">
                <iframe
                  src={currentCategory.previewUrl || "/assets/Presentation_Research.pdf"}
                  allow="autoplay"
                  title={currentCategory.title}
                  className="doc-iframe"
                ></iframe>
              </div>
            </div>
          </div>

          <div className="doc-footer-info">
            <p>
              <BookOpen size={16} />
              <span>
                สามารถเปิดอ่านและเลื่อนดูเนื้อหาเอกสารเค้าโครงร่างงานวิจัยได้โดยตรง หรือกดปุ่ม (F) บนคีย์บอร์ดเพื่อขยายเต็มหน้าจอ
              </span>
            </p>
          </div>
        </div>
      ) : (
        /* TAB 3: FULL PAPER OR EMPTY STATE */
        <div className="research-content-section animate-fade-in" key={activeTab}>
          <div className="empty-state-container glass-panel">
            <div className="empty-state-icon-wrapper">
              <FileSearch size={48} className="empty-icon" />
              <Sparkles size={24} className="sparkle-icon" />
            </div>
            <h3 className="empty-title">{currentCategory.title}</h3>
            <p className="empty-description">
              รายงานผลการวิจัยในชั้นเรียนฉบับสมบูรณ์ กำลังอยู่ในระหว่างจัดทำสรุปเล่ม
            </p>
            <a 
              href="https://canva.link/o532k7zqv9uur9j" 
              target="_blank" 
              rel="noopener noreferrer"
              className="drive-link-btn"
              style={{ marginTop: '1rem' }}
            >
              <Sparkles size={18} />
              <span>ดูสไลด์นำเสนอทั้งหมดบน Canva</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
