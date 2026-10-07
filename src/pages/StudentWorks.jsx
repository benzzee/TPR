import { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Search, 
  RefreshCw, 
  Calendar, 
  User, 
  Eye, 
  X, 
  Info, 
  Sparkles,
  FolderCheck,
  CheckCircle2,
  Table
} from 'lucide-react';
import './StudentWorks.css';
import siteData from '../data/siteData.json';

export function StudentWorks() {
  const { studentWorks } = siteData || {};
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [searchQuery, setSearchQuery] = useState('');
  const [liveData, setLiveData] = useState(null); // null = not loaded / use JSON fallback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  // Modal states
  const [selectedWork, setSelectedWork] = useState(null);
  const [showSheetGuide, setShowSheetGuide] = useState(false);

  // --- CSV Line Parser ---
  const parseCSVLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    result.push(current.trim());
    return result;
  };

  // --- Parse Raw CSV text into Student Work items ---
  // Expected Columns:
  // 0: วันที่, 1: ชื่อผลงาน, 2: ชื่อนักเรียน/ผู้จัดทำ, 3: ชั้นเรียน, 4: หมวดหมู่, 5: รายละเอียด, 6: รูปภาพ(ID/URL), 7: ลิงก์ชิ้นงาน
  const parseCSV = (text) => {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) return [];

    const rows = lines.slice(1); // Skip header row
    return rows
      .map((line, idx) => {
        const cols = parseCSVLine(line);
        return {
          id: `sw-live-${idx}`,
          date: cols[0] || '',
          title: cols[1] || '',
          studentName: cols[2] || '',
          class: cols[3] || '',
          category: cols[4] || 'ทั่วไป',
          description: cols[5] || '',
          imageId: cols[6] || '',
          driveUrl: cols[7] || '',
        };
      })
      .filter(r => r.title.trim() !== '' || r.studentName.trim() !== '');
  };

  // Default sample image used for all cards as fallback
  const DEFAULT_SAMPLE_IMAGE = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800&h=450";

  // Google Drive Helpers
  const isGoogleDriveId = (str) => str && !str.startsWith('http') && str.length > 10;

  const getImageSrc = (item) => {
    if (!item) return DEFAULT_SAMPLE_IMAGE;
    if (item.imageUrl && item.imageUrl.startsWith('http')) return item.imageUrl;
    if (item.imageId) {
      if (item.imageId.startsWith('http')) return item.imageId;
      if (isGoogleDriveId(item.imageId)) {
        return `https://drive.google.com/uc?export=view&id=${item.imageId}`;
      }
    }
    return DEFAULT_SAMPLE_IMAGE;
  };

  const getDrivePreviewUrl = (id) => {
    if (!id || id === '-' || id === '') return null;
    if (isGoogleDriveId(id)) return `https://drive.google.com/file/d/${id}/preview`;
    return null;
  };

  // --- Fetch Google Sheet CSV Data ---
  const fetchStudentWorks = async () => {
    if (!studentWorks?.sheetUrl || studentWorks.sheetUrl.includes('STUDENT_WORKS_GID')) {
      setLiveData(null);
      setIsDemoMode(true);
      return;
    }

    setLoading(true);
    setError(null);
    setIsDemoMode(false);

    try {
      let url = studentWorks.sheetUrl.trim();
      if (url.includes('/pubhtml')) {
        url = url.replace('/pubhtml', '/pub');
      }
      if (!url.includes('output=csv')) {
        url += (url.includes('?') ? '&' : '?') + 'output=csv';
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error('ไม่สามารถโหลดข้อมูลจาก Google Sheet ได้');
      const text = await res.text();
      const parsed = parseCSV(text);
      if (parsed.length === 0) {
        setLiveData(null);
        setIsDemoMode(true);
      } else {
        setLiveData(parsed);
      }
    } catch (err) {
      console.warn('StudentWorks: Falling back to local data.', err);
      setError('ไม่สามารถเชื่อมต่อกับ Google Sheet ได้ (แสดงข้อมูลตัวอย่างจากระบบ)');
      setLiveData(null);
      setIsDemoMode(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentWorks();
  }, []);

  // Determine all items (Google Sheet data or combined local siteData JSON)
  let allWorks = [];
  if (liveData && liveData.length > 0) {
    allWorks = liveData;
  } else {
    allWorks = [
      ...(studentWorks?.items || []),
      ...(studentWorks?.term1 || []),
      ...(studentWorks?.term2 || [])
    ];
  }

  // Categories extraction
  const allCategories = ['ทั้งหมด', ...new Set(allWorks.map(i => i.category || 'ทั่วไป').filter(Boolean))];

  // Filtering
  const filteredWorks = allWorks.filter(item => {
    const matchesCategory = selectedCategory === 'ทั้งหมด' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      (item.title || '').toLowerCase().includes(q) ||
      (item.studentName || '').toLowerCase().includes(q) ||
      (item.class || '').toLowerCase().includes(q) ||
      (item.description || '').toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="student-works-container animate-fade-in">
      {/* Page Header */}
      <div className="page-header flex-between">
        <div>
          <div className="badge">
            <GraduationCap size={14} style={{ marginRight: '6px', display: 'inline', verticalAlign: 'middle' }} />
            ผลงานและการพัฒนาผู้เรียน
          </div>
          <h1 className="text-h1">{studentWorks?.title || 'ผลงานนักเรียน'}</h1>
          <p className="text-body max-w-2xl">{studentWorks?.description}</p>
        </div>

        <div className="header-actions">
          <button className="btn-secondary" onClick={() => setShowSheetGuide(true)}>
            <Table size={16} />
            <span>โครงสร้าง Google Sheet</span>
          </button>
          <button className="btn-icon-refresh" onClick={fetchStudentWorks} title="รีเฟรชข้อมูลจาก Google Sheet">
            <RefreshCw size={18} className={loading ? 'spinning' : ''} />
          </button>
        </div>
      </div>

      {/* Demo Mode Notification */}
      {isDemoMode && (
        <div className="demo-banner glass-panel">
          <Info size={20} className="demo-icon" />
          <div className="demo-message">
            <strong>กำลังแสดงผลข้อมูลตัวอย่าง (Demo Data):</strong> สามารถใส่ URL ของ Google Sheet ในไฟล์ 
            <code>siteData.json</code> (คีย์ <code>studentWorks.sheetUrl</code>) เพื่อซิงค์ข้อมูลจริงได้ทันที
          </div>
        </div>
      )}

      {/* Controls Bar with Search and Category Pills */}
      <div className="controls-bar glass-panel">
        <div className="search-wrapper full-width">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            className="search-input" 
            placeholder="ค้นหาชื่อผลงาน, นักเรียน, หรือระดับชั้น..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => setSearchQuery('')}>
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      {allCategories.length > 1 && (
        <div className="category-pills">
          {allCategories.map(cat => (
            <button
              key={cat}
              className={`pill-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Content Grid */}
      {loading ? (
        <div className="loading-state glass-panel">
          <RefreshCw size={32} className="spinning text-primary" />
          <p>กำลังโหลดข้อมูลผลงานนักเรียน...</p>
        </div>
      ) : filteredWorks.length === 0 ? (
        <div className="empty-state glass-panel">
          <FolderCheck size={48} className="text-muted" />
          <h3>ไม่พบข้อมูลผลงานนักเรียน</h3>
          <p>ยังไม่มีรายการผลงานในระบบ หรือคำค้นหาไม่ตรงกับรายการใด</p>
        </div>
      ) : (
        <div className="student-works-grid">
          {filteredWorks.map((item) => {
            const imgSrc = getImageSrc(item);
            return (
              <div key={item.id} className="work-card glass-panel">
                <div className="work-image-container">
                  {imgSrc ? (
                    <img 
                      src={imgSrc} 
                      alt={item.title} 
                      className="work-image" 
                      loading="lazy" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_SAMPLE_IMAGE;
                      }}
                    />
                  ) : (
                    <div className="work-image-placeholder">
                      <Sparkles size={36} className="placeholder-icon" />
                      <span>{item.title}</span>
                    </div>
                  )}

                  <div className="image-overlay">
                    <button className="btn-preview-overlay" onClick={() => setSelectedWork(item)}>
                      <Eye size={18} />
                      <span>ขยายดูผลงาน</span>
                    </button>
                  </div>

                  <span className="category-tag">{item.category || 'ทั่วไป'}</span>
                </div>

                <div className="work-content">
                  <h3 className="work-title">{item.title}</h3>
                  
                  <div className="work-meta">
                    {item.studentName && (
                      <div className="meta-item">
                        <User size={15} />
                        <span>{item.studentName}</span>
                      </div>
                    )}
                    {item.class && (
                      <div className="meta-badge">
                        <GraduationCap size={13} />
                        <span>{item.class}</span>
                      </div>
                    )}
                    {item.date && (
                      <div className="meta-item text-muted">
                        <Calendar size={13} />
                        <span>{item.date}</span>
                      </div>
                    )}
                  </div>

                  <p className="work-desc">{item.description}</p>

                  <div className="work-card-footer">
                    <button className="btn-details" onClick={() => setSelectedWork(item)}>
                      <Eye size={15} />
                      <span>ดูรายละเอียด</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal View Details / Zoom */}
      {selectedWork && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setSelectedWork(null)}>
          <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedWork(null)}>
              <X size={20} />
            </button>

            <div className="modal-header">
              <span className="category-tag modal-tag">{selectedWork.category || 'ผลงานนักเรียน'}</span>
              <h2 className="text-h2">{selectedWork.title}</h2>
            </div>

            <div className="modal-body">
              {getImageSrc(selectedWork) ? (
                <div className="modal-image-wrapper">
                  <img 
                    src={getImageSrc(selectedWork)} 
                    alt={selectedWork.title} 
                    className="modal-image" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DEFAULT_SAMPLE_IMAGE;
                    }}
                  />
                </div>
              ) : getDrivePreviewUrl(selectedWork.imageId) ? (
                <div className="modal-iframe-wrapper">
                  <iframe 
                    src={getDrivePreviewUrl(selectedWork.imageId)} 
                    title={selectedWork.title} 
                    className="modal-iframe" 
                    allow="autoplay"
                  ></iframe>
                </div>
              ) : null}

              <div className="modal-info-box">
                <div className="info-grid">
                  {selectedWork.studentName && (
                    <div className="info-row">
                      <User size={18} className="text-primary" />
                      <div>
                        <strong>ผู้จัดทำ:</strong>
                        <p>{selectedWork.studentName}</p>
                      </div>
                    </div>
                  )}

                  {selectedWork.class && (
                    <div className="info-row">
                      <GraduationCap size={18} className="text-primary" />
                      <div>
                        <strong>ระดับชั้น / แผนก:</strong>
                        <p>{selectedWork.class}</p>
                      </div>
                    </div>
                  )}

                  {selectedWork.date && (
                    <div className="info-row">
                      <Calendar size={18} className="text-primary" />
                      <div>
                        <strong>วันที่:</strong>
                        <p>{selectedWork.date}</p>
                      </div>
                    </div>
                  )}
                </div>

                {selectedWork.description && (
                  <div className="desc-section">
                    <h4>รายละเอียดผลงาน:</h4>
                    <p>{selectedWork.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Google Sheet Schema Guide Modal */}
      {showSheetGuide && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setShowSheetGuide(false)}>
          <div className="modal-content guide-modal glass-panel" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowSheetGuide(false)}>
              <X size={20} />
            </button>

            <div className="guide-header">
              <Table size={24} className="text-primary" />
              <h2 className="text-h2">โครงสร้างคอลัมน์ Google Sheet (ผลงานนักเรียน)</h2>
            </div>

            <p className="text-body mb-4">
              หากต้องการดึงข้อมูลจาก Google Sheets ให้สร้าง Sheet/Tab ใหม่ และใส่ข้อมูลคอลัมน์ในแถวแรก (Header) ดังนี้:
            </p>

            <div className="table-wrapper">
              <table className="schema-table">
                <thead>
                  <tr>
                    <th>ลำดับ (Col)</th>
                    <th>ชื่อคอลัมน์</th>
                    <th>คำอธิบาย / ตัวอย่าง</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>A (1)</td>
                    <td><code>วันที่</code></td>
                    <td>วันที่ส่งชิ้นงาน เช่น <code>15 ก.ค. 2569</code></td>
                  </tr>
                  <tr>
                    <td>B (2)</td>
                    <td><code>ชื่อผลงาน</code></td>
                    <td>ชื่อชิ้นงาน/โครงงาน เช่น <code>เว็บไซต์ Portfolio</code></td>
                  </tr>
                  <tr>
                    <td>C (3)</td>
                    <td><code>นักเรียน/ผู้จัดทำ</code></td>
                    <td>ชื่อผู้สร้างสรรค์ เช่น <code>นายสมชาย ใจดี และคณะ</code></td>
                  </tr>
                  <tr>
                    <td>D (4)</td>
                    <td><code>ชั้นเรียน</code></td>
                    <td>ระดับชั้น เช่น <code>ปวช.1/1</code></td>
                  </tr>
                  <tr>
                    <td>E (5)</td>
                    <td><code>หมวดหมู่</code></td>
                    <td>เช่น <code>ชิ้นงานในชั้นเรียน</code>, <code>โครงงานนักศึกษา</code></td>
                  </tr>
                  <tr>
                    <td>F (6)</td>
                    <td><code>รายละเอียด</code></td>
                    <td>สรุปรายละเอียด หรือแนวคิดชิ้นงาน</td>
                  </tr>
                  <tr>
                    <td>G (7)</td>
                    <td><code>รูปภาพ</code></td>
                    <td>Google Drive File ID หรือ Image URL Direct Link (ระบุหรือไม่ระบูก็ได้)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="guide-footer mt-4">
              <button className="btn-primary-action" onClick={() => setShowSheetGuide(false)}>
                <CheckCircle2 size={18} />
                <span>เข้าใจแล้ว</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
