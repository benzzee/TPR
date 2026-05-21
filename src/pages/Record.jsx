import { useState, useEffect } from 'react';
import { Calendar, BookOpen, Clock, Info, ExternalLink, RefreshCw } from 'lucide-react';
import './Record.css';
import siteData from '../data/siteData.json';

export function Record() {
  const { teachingRecord } = siteData;
  const [activeTerm, setActiveTerm] = useState('term1');
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [records, setRecords] = useState([]);
  const [maxWeek, setMaxWeek] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Generate realistic mock records as a robust fallback if fetching fails
  const generateMockRecords = () => {
    return [
      {
        date: '5/5/2569',
        subject: '-',
        detail: 'จัดเตรียมความพร้อมของห้องเรียนพร้อมทั้งตรวจสอบตารางสอน รายวิชา ของคุณครูและของนักเรียน',
        imageId: '1IAM8k-4EkiTiytDSqoXoHfooQHkDpd6l',
        term: '1',
        week: 1
      },
      {
        date: '6/5/2569',
        subject: '-',
        detail: 'ประชุมครู ครั้งที่ 3/2569 โดยได้มีการแนะนำตัวในที่ประชุม',
        imageId: '1mQ9ekAacA3hJ81ZzXjTiXklG0w6tSPra',
        term: '1',
        week: 1
      },
      {
        date: '7/5/2569',
        subject: '-',
        detail: 'Setup Switch บริเวณตึก 5 ของวิทยาลัยเพื่อเพิ่มพอร์ตการเชื่อมต่อให้เพียงพอ',
        imageId: '1NOjgfI058TagtFZyVr17r9sjvyaiGHmc',
        term: '1',
        week: 1
      },
      {
        date: '8/5/2569',
        subject: '-',
        detail: 'เข้าร่วมอบรม "หนี ซ่อน สู้" เพื่อเอาชีวิตรอดเมื่อเผชิญเหตุการณ์รุนแรง',
        imageId: '1_7bh-XVNthmPqeJ57mR_N8dmao5nNtWJ',
        term: '1',
        week: 1
      },
      {
        date: '11/5/2569',
        subject: '-',
        detail: 'เตรียมเนื้อหาการสอนในรายวิชาการใช้เทคโนโลยีดิจิทัลเพื่ออาชีพ',
        imageId: '1mbFQqNqAvvacQXQtwCUM5NwIll7GlpWC',
        term: '1',
        week: 2
      },
      {
        date: '12/5/2569',
        subject: '-',
        detail: 'จัดเตรียมห้องเรียน ณ ห้อง 713 ได้ทำความสะอาดห้องเรียนและลง Windows ใหม่จำนวน 23 เครื่อง',
        imageId: '1IZq-y8tc6KcDBu_LYyEFvqXn-Dvc44rn',
        term: '1',
        week: 2
      },
      {
        date: '13/5/2569',
        subject: '-',
        detail: 'วันหยุดราชการเนื่องจาก "วันพืชมงคล"',
        imageId: '1obuSKK9xJ864-cCkRLSNvcmH1grKhN61',
        term: '1',
        week: 2
      },
      {
        date: '14/5/2569',
        subject: '-',
        detail: 'ปฐมนิเทศนักศึกษาใหม่ ในระดับชั้น ปวช.1และ ปวส.1',
        imageId: '195ZaUQ1Sq-gt6NrMOO0zGOVqdyVnbqiO',
        term: '1',
        week: 2
      },
      {
        date: '15/5/2569',
        subject: '-',
        detail: 'จัดเตรียมห้องเรียน ณ ห้อง 132 ได้มีการลง Windows ใหม่ จำนวน 20 เครื่อง',
        imageId: '1Qbgja5iciYRG07XyLsTRhvyAwtW8JKcR',
        term: '1',
        week: 2
      },
      {
        date: '18/5/2569',
        subject: '-',
        detail: 'ดูแลนักเรียน ในรายวิชากิจกรรมเสริมสร้างสุจริต จิตอาสา ให้นักเรียนสมัครเข้าชมรมวิชาชีพ',
        imageId: '1WbpzKroBPZl3f1hqodHyXJeLqMjgQayP',
        term: '1',
        week: 3
      },
      {
        date: '19/5/2569',
        subject: '-',
        detail: 'ดูแลนักเรียนคาบ HomeRoom และสอนวิชาการใช้เทคโนโลยีดิจิทัลเพื่ออาชีพได้ทำการสอนหน่วยที่1 พร้อมทำแบบทดสอบในห้องเรียน',
        imageId: '1Rym88kstrZO00sIOFjWULpN2Iyjeibyd',
        term: '1',
        week: 3
      },
      {
        date: '20/5/2569',
        subject: '-',
        detail: 'สอนรายวิชาการออกแบบส่วนติดต่อผู้ใช้ สอนบทนำของรายวิชาและพานักเรียนทำกิจกรรม "Crazy 8S" เพื่อให้นักเรียนออกแบบแอปในระยะเวลา 8 นาทีพร้อมสุ่มนักเรียนนำเสนอหน้าชั้นเรียน',
        imageId: '1XHrqJ-IOa65OBBpgngZbXrfOvzsw8cF9',
        term: '1',
        week: 3
      },
      {
        date: '21/5/2569',
        subject: '-',
        detail: 'แนะนำตัวหน้าเสาธงบริเวณอาคารโดมช่วงเช้าและแก้ไขปัญหาสายแลนใช้งานไม่ได้เนื่องจากสายขาด',
        imageId: '17S8uRh07GjxBqTK9Ksb6b3Uy99LH2gH9',
        term: '1',
        week: 3
      }
    ];
  };

  const getPreviewUrl = (id) => {
    if (!id || id === '-' || id === '') return null;
    return `https://drive.google.com/file/d/${id}/preview`;
  };

  const getDriveUrl = (id) => {
    if (!id || id === '-' || id === '') return null;
    return `https://drive.google.com/file/d/${id}/view`;
  };

  // Robust CSV line parser that handles quoted fields
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

  // Parse raw CSV text → array of record objects
  // Columns: วันที่(0), วิชาสอน(1), รายละเอียด(2), รูปภาพ(3), เทอม(4), สัปดาห์(5)
  const parseCSV = (text) => {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) return [];

    const rows = lines.slice(1); // Skip header row
    const parsed = rows
      .map(line => {
        const cols = parseCSVLine(line);
        return {
          date: cols[0] || '',
          subject: cols[1] || '-',
          detail: cols[2] || '',
          imageId: cols[3] || '',
          term: cols[4] || '',
          week: parseInt(cols[5]) || 0,
        };
      })
      // Only keep rows that have a date AND some content
      .filter(r => r.date && r.date.trim() !== '' && (r.detail.trim() !== '' || r.imageId.trim() !== ''));

    return parsed;
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setIsDemoMode(false);
    try {
      const response = await fetch(teachingRecord.sheetUrl);
      if (!response.ok) throw new Error('Network error');
      const text = await response.text();
      const all = parseCSV(text);
      // Filter by term column (activeTerm === 'term1' → term === '1', etc.)
      const termNum = activeTerm === 'term1' ? '1' : '2';
      const data = all.filter(r => !r.term || r.term === '' || r.term === termNum);
      setRecords(data);
      // Set maxWeek from sheet's สัปดาห์ column
      const max = data.reduce((acc, r) => Math.max(acc, r.week || 0), 1);
      setMaxWeek(max > 0 ? max : 1);
    } catch (err) {
      console.warn('Failed to fetch real sheet data, falling back to local records.', err);
      // Load mock records so page remains beautiful and weeks menu is visible!
      const mockRecords = generateMockRecords();
      const termNum = activeTerm === 'term1' ? '1' : '2';
      const data = mockRecords.filter(r => !r.term || r.term === '' || r.term === termNum);
      setRecords(data);
      // Set maxWeek
      const max = data.reduce((acc, r) => Math.max(acc, r.week || 0), 1);
      setMaxWeek(max > 0 ? max : 1);
      setIsDemoMode(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    setSelectedWeek(1);
  }, [activeTerm]);

  const filteredRecords = records.filter(r => r.week === selectedWeek);
  // Show weeks 1..maxWeek (based on สัปดาห์ column from sheet)
  const weeks = Array.from({ length: maxWeek }, (_, i) => i + 1);

  return (
    <div className="record-container animate-fade-in">
      <div className="page-header">
        <div className="badge">บันทึกการปฏิบัติงาน</div>
        <h1 className="text-h1">{teachingRecord.title}</h1>
      </div>

      {/* Demo Warning Banner */}
      {isDemoMode && (
        <div className="demo-banner glass-panel animate-fade-in">
          <Info size={20} className="demo-icon" />
          <div className="demo-message">
            <strong>ระบบกำลังแสดงข้อมูลจำลอง (Demo)</strong> เนื่องจากไม่สามารถดึงข้อมูลจริงจาก Google Sheets ได้ 
            กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต หรือสถานะการแชร์ของชีตนี้
          </div>
        </div>
      )}

      {/* Term Selection */}
      <div className="record-top-bar">
        <div className="term-tabs">
          <button
            className={`term-tab ${activeTerm === 'term1' ? 'active' : ''}`}
            onClick={() => setActiveTerm('term1')}
          >ภาคเรียนที่ 1</button>
          <button
            className={`term-tab ${activeTerm === 'term2' ? 'active' : ''}`}
            onClick={() => setActiveTerm('term2')}
          >ภาคเรียนที่ 2</button>
        </div>
        <button onClick={fetchData} className="refresh-btn" disabled={loading}>
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          <span>รีเฟรช</span>
        </button>
      </div>

      {/* Week Selection */}
      {!loading && !error && weeks.length > 0 && (
        <div className="week-selector-wrapper glass-panel">
          <div className="selector-header">
            <Clock size={18} />
            <span>เลือกสัปดาห์</span>
          </div>
          <div className="week-grid">
            {weeks.map(week => (
              <button
                key={week}
                className={`week-btn ${selectedWeek === week ? 'active' : ''}`}
                onClick={() => setSelectedWeek(week)}
              >
                W{week}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="error-banner glass-panel">
          <Info size={20} />
          <p>{error}</p>
        </div>
      )}

      {/* Content Area */}
      <div className="records-grid">
        {loading ? (
          <div className="loading-state glass-panel">
            <RefreshCw size={32} className="animate-spin text-primary" />
            <p>กำลังดึงข้อมูลจาก Google Sheets...</p>
          </div>
        ) : filteredRecords.length > 0 ? (
          filteredRecords.map((item, index) => (
            <div key={index} className="record-card glass-panel animate-slide-up"
              style={{ animationDelay: `${index * 0.08}s` }}>
              <div className="card-header">
                <div className="date-tag">
                  <Calendar size={14} />
                  {item.date}
                </div>
                {item.subject && item.subject !== '-' && (
                  <div className="subject-tag">
                    <BookOpen size={14} />
                    {item.subject}
                  </div>
                )}
              </div>
              <div className="card-body">
                <p className="detail-text">{item.detail}</p>
                {item.imageId && item.imageId !== '-' && item.imageId !== '' && (
                  <>
                    <div className="record-image-wrapper">
                      <iframe
                        src={getPreviewUrl(item.imageId)}
                        className="record-iframe"
                        title="ภาพกิจกรรม"
                        allow="autoplay"
                        loading="lazy"
                      />
                    </div>
                    <a href={getDriveUrl(item.imageId)} target="_blank"
                      rel="noopener noreferrer" className="view-original-btn">
                      <ExternalLink size={14} />
                      <span>ดูรูปภาพต้นฉบับ</span>
                    </a>
                  </>
                )}
              </div>
            </div>
          ))
        ) : !error ? (
          <div className="empty-state glass-panel">
            <Info size={48} className="text-muted" />
            <h3>ไม่พบข้อมูลสำหรับสัปดาห์ที่ {selectedWeek}</h3>
            <p>ยังไม่มีรายการบันทึกในสัปดาห์นี้</p>
          </div>
        ) : null}
      </div>

      <div className="guide-footer glass-panel">
        <a href={activeTerm === 'term1' ? teachingRecord.term1Url : teachingRecord.term2Url}
          target="_blank" rel="noopener noreferrer" className="sheet-link-btn">
          <ExternalLink size={18} />
          <span>เปิด Google Sheet ของ {activeTerm === 'term1' ? 'เทอม 1' : 'เทอม 2'}</span>
        </a>
      </div>
    </div>
  );
}
