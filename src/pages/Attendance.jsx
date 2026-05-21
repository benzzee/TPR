import { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, AlertTriangle, FileText, UserCheck, ExternalLink, RefreshCw, Info } from 'lucide-react';
import './Attendance.css';
import siteData from '../data/siteData.json';

export function Attendance() {
  const { attendance } = siteData;
  const [selectedMonth, setSelectedMonth] = useState('พฤษภาคม');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Month list in order of the academic term (May - October)
  const defaultMonths = ['พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม'];

  // Generate extremely realistic mock data for fallback/demo
  const generateMockData = () => {
    const mockList = [];
    const monthsData = [
      { name: 'พฤษภาคม', days: 15, startDay: 4, monthNum: 5 },
      { name: 'มิถุนายน', days: 20, startDay: 2, monthNum: 6 },
      { name: 'กรกฎาคม', days: 22, startDay: 4, monthNum: 7 },
      { name: 'สิงหาคม', days: 21, startDay: 1, monthNum: 8 },
      { name: 'กันยายน', days: 22, startDay: 3, monthNum: 9 },
      { name: 'ตุลาคม', days: 20, startDay: 5, monthNum: 10 }
    ];

    const thaiMonthsShort = ['', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

    monthsData.forEach(({ name, days, startDay, monthNum }) => {
      let currentDayOfWeek = startDay; // 1 = Monday, ..., 5 = Friday
      let workDayCount = 1;

      for (let d = 1; d <= 30; d++) {
        // Skip weekend days simple simulation
        if (currentDayOfWeek > 5) {
          currentDayOfWeek = currentDayOfWeek >= 7 ? 1 : currentDayOfWeek + 1;
          continue;
        }

        if (workDayCount > days) break;

        const dateStr = `${d} ${thaiMonthsShort[monthNum]} 68`;
        
        // Randomize status and times for realistic demo
        let checkIn = '07:35';
        let checkOut = '16:30';
        let status = 'ปกติ';
        let note = 'ปฏิบัติหน้าที่สอนและทำงานฝ่ายวิชาการ';

        const rand = Math.random();
        if (rand < 0.08) {
          status = 'สาย';
          checkIn = `08:${Math.floor(Math.random() * 15) + 10}`; // 08:10 - 08:24
          note = 'มาสายเนื่องจากการจราจรติดขัด มีเวรหน้าประตูควบคุมแถว';
        } else if (rand < 0.12) {
          status = 'ลา';
          checkIn = '-';
          checkOut = '-';
          note = 'ลากิจ / เข้าร่วมสัมมนาวิชาการวิทยาลัย';
        } else if (rand < 0.13) {
          status = 'ขาด';
          checkIn = '-';
          checkOut = '-';
          note = 'ขาดงานเนื่องจากเกิดอุบัติเหตุทางรถยนต์';
        }

        mockList.push({
          date: dateStr,
          checkIn,
          checkOut,
          status,
          note,
          month: name
        });

        workDayCount++;
        currentDayOfWeek = currentDayOfWeek >= 7 ? 1 : currentDayOfWeek + 1;
      }
    });

    return mockList;
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

  // Parse CSV records
  // Expect Columns: วันที่(0), เวลาเข้า(1), เวลาออก(2), สถานะ(3), หมายเหตุ(4), เดือน(5)
  const parseCSV = (text) => {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) return [];

    const rows = lines.slice(1); // Skip header
    return rows
      .map(line => {
        const cols = parseCSVLine(line);
        const date = cols[0] || '';
        const checkIn = cols[1] || '-';
        const checkOut = cols[2] || '-';
        const status = cols[3] || 'ปกติ';
        const note = cols[4] || '-';
        let month = cols[5] || '';

        // If month is empty, try to guess month from date string
        if (!month && date) {
          if (date.includes('พ.ค.') || date.includes('พฤษภาคม')) month = 'พฤษภาคม';
          else if (date.includes('มิ.ย.') || date.includes('มิถุนายน')) month = 'มิถุนายน';
          else if (date.includes('ก.ค.') || date.includes('กรกฎาคม')) month = 'กรกฎาคม';
          else if (date.includes('ส.ค.') || date.includes('สิงหาคม')) month = 'สิงหาคม';
          else if (date.includes('ก.ย.') || date.includes('กันยายน')) month = 'กันยายน';
          else if (date.includes('ต.ค.') || date.includes('ตุลาคม')) month = 'ตุลาคม';
          else month = 'พฤษภาคม'; // Default fallback
        }

        return { date, checkIn, checkOut, status, note, month };
      })
      .filter(r => r.date && r.date.trim() !== '');
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setIsDemoMode(false);
    try {
      const response = await fetch(attendance.sheetUrl);
      if (!response.ok) throw new Error('Network error');
      const text = await response.text();
      const parsed = parseCSV(text);
      if (parsed.length === 0) throw new Error('Empty data');
      setRecords(parsed);
    } catch (err) {
      console.warn('Failed to fetch real sheet data, falling back to beautiful demo mock data.', err);
      const mock = generateMockData();
      setRecords(mock);
      setIsDemoMode(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter records by selected month
  const filteredRecords = records.filter(r => r.month === selectedMonth);

  // Calculate monthly stats
  const calculateStats = () => {
    const stats = {
      total: filteredRecords.length,
      normal: 0,
      late: 0,
      leave: 0,
      absent: 0
    };

    filteredRecords.forEach(r => {
      const s = r.status.trim();
      if (s === 'ปกติ' || s === 'มาปกติ' || s === 'มาทำงาน') {
        stats.normal++;
      } else if (s === 'สาย' || s === 'มาสาย') {
        stats.late++;
      } else if (s === 'ลา' || s === 'ลาป่วย' || s === 'ลากิจ') {
        stats.leave++;
      } else if (s === 'ขาด' || s === 'ขาดงาน') {
        stats.absent++;
      } else {
        // Fallback to normal for any unrecognized positive work record
        stats.normal++;
      }
    });

    return stats;
  };

  const stats = calculateStats();

  // Get status class for styling
  const getStatusBadgeClass = (status) => {
    const s = status.trim();
    if (s === 'ปกติ' || s === 'มาปกติ' || s === 'มาทำงาน') return 'badge-success';
    if (s === 'สาย' || s === 'มาสาย') return 'badge-warning';
    if (s === 'ลา' || s === 'ลาป่วย' || s === 'ลากิจ') return 'badge-info';
    return 'badge-danger'; // ขาด
  };

  // Get Google Drive Link for currently selected month
  const currentMonthDriveUrl = attendance.monthlyDriveUrls[selectedMonth] || attendance.driveUrl;

  return (
    <div className="attendance-container animate-fade-in">
      {/* Page Header */}
      <div className="page-header flex-header">
        <div>
          <div className="badge flex-badge">
            <Clock size={12} />
            <span>ระบบลงเวลาการทำงาน</span>
            {isDemoMode && <span className="demo-tag">DEMO MODE</span>}
          </div>
          <h1 className="text-h1">{attendance.title}</h1>
          <p className="text-body max-w-2xl">{attendance.description}</p>
        </div>
        <button onClick={fetchData} className="refresh-btn" disabled={loading}>
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          <span>รีเฟรชข้อมูล</span>
        </button>
      </div>

      {/* Demo Warning Banner */}
      {isDemoMode && (
        <div className="demo-banner glass-panel">
          <Info size={20} className="demo-icon" />
          <div className="demo-message">
            <strong>ระบบกำลังแสดงข้อมูลจำลอง (Demo)</strong> เนื่องจากไม่พบข้อมูลจาก Google Sheets 
            คุณสามารถตั้งค่าลิงก์ชีตจริงของคุณได้โดยระบุลิงก์ CSV ในไฟล์ <code>src/data/siteData.json</code>
          </div>
        </div>
      )}

      {/* Month Tabs */}
      <div className="month-tabs-wrapper glass-panel">
        <div className="month-tabs">
          {defaultMonths.map(month => (
            <button
              key={month}
              className={`month-tab ${selectedMonth === month ? 'active' : ''}`}
              onClick={() => setSelectedMonth(month)}
            >
              {month}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="loading-state glass-panel">
          <RefreshCw size={32} className="animate-spin text-primary" />
          <p>กำลังดึงข้อมูลบันทึกเวลาจาก Google Sheets...</p>
        </div>
      ) : (
        <>
          {/* Summary Stats Grid */}
          <div className="stats-summary-grid">
            <div className="stats-card glass-panel gradient-border-total">
              <div className="stats-icon-wrapper icon-total">
                <Calendar size={24} />
              </div>
              <div className="stats-info">
                <span className="stats-label">วันทำงานทั้งหมด</span>
                <h2 className="stats-value">{stats.total} <span className="stats-unit">วัน</span></h2>
              </div>
            </div>

            <div className="stats-card glass-panel gradient-border-success">
              <div className="stats-icon-wrapper icon-success">
                <UserCheck size={24} />
              </div>
              <div className="stats-info">
                <span className="stats-label">มาปกติ</span>
                <h2 className="stats-value text-success">{stats.normal} <span className="stats-unit">วัน</span></h2>
              </div>
            </div>

            <div className="stats-card glass-panel gradient-border-warning">
              <div className="stats-icon-wrapper icon-warning">
                <Clock size={24} />
              </div>
              <div className="stats-info">
                <span className="stats-label">สาย</span>
                <h2 className="stats-value text-warning">{stats.late} <span className="stats-unit">วัน</span></h2>
              </div>
            </div>

            <div className="stats-card glass-panel gradient-border-info">
              <div className="stats-icon-wrapper icon-info">
                <FileText size={24} />
              </div>
              <div className="stats-info">
                <span className="stats-label">ลา</span>
                <h2 className="stats-value text-info">{stats.leave} <span className="stats-unit">วัน</span></h2>
              </div>
            </div>

            <div className="stats-card glass-panel gradient-border-danger">
              <div className="stats-icon-wrapper icon-danger">
                <AlertTriangle size={24} />
              </div>
              <div className="stats-info">
                <span className="stats-label">ขาด</span>
                <h2 className="stats-value text-danger">{stats.absent} <span className="stats-unit">วัน</span></h2>
              </div>
            </div>
          </div>

          {/* Table / List Area */}
          <div className="table-container glass-panel animate-slide-up">
            <div className="table-header-title">
              <CheckCircle size={18} className="text-primary" />
              <span>ตารางเวลาเข้างาน ประจำเดือน {selectedMonth}</span>
            </div>
            
            {filteredRecords.length > 0 ? (
              <div className="responsive-table-wrapper">
                <table className="attendance-table">
                  <thead>
                    <tr>
                      <th style={{ width: '80px' }}>ลำดับ</th>
                      <th style={{ width: '180px' }}>วันที่</th>
                      <th style={{ width: '120px' }}>เวลาเข้า</th>
                      <th style={{ width: '120px' }}>เวลาออก</th>
                      <th style={{ width: '130px' }}>สถานะ</th>
                      <th>ภาระงาน / หมายเหตุ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.map((item, idx) => (
                      <tr key={idx}>
                        <td className="text-center font-semibold">{idx + 1}</td>
                        <td className="font-semibold text-main-color">{item.date}</td>
                        <td className="text-center">{item.checkIn}</td>
                        <td className="text-center">{item.checkOut}</td>
                        <td className="text-center">
                          <span className={`status-badge ${getStatusBadgeClass(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="note-cell text-muted">{item.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state-attendance">
                <Calendar size={48} className="text-muted" />
                <h3>ไม่มีบันทึกข้อมูลในเดือน {selectedMonth}</h3>
                <p>ยังไม่มีรายการลงเวลาทำงานบันทึกไว้ในเดือนนี้</p>
              </div>
            )}
          </div>

          {/* Drive Proof Section */}
          <div className="drive-proof-card glass-panel animate-slide-up">
            <div className="drive-logo-wrapper">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" 
                alt="Google Drive Logo" 
                className="drive-logo" 
              />
            </div>
            <div className="drive-content">
              <h3>หลักฐานภาพถ่ายการเข้าออกงาน</h3>
              <p>คุณสามารถคลิกปุ่มด้านข้างเพื่อเข้าชมภาพถ่ายหลักฐานการสแกนนิ้ว การลงเวลา และการทำกิจกรรมเข้าแถวของเดือน <strong>{selectedMonth}</strong> ทั้งหมดผ่านทาง Google Drive</p>
            </div>
            <a 
              href={currentMonthDriveUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="drive-action-btn"
            >
              <ExternalLink size={18} />
              <span>เปิดดูรูปหลักฐาน {selectedMonth}</span>
            </a>
          </div>
        </>
      )}
    </div>
  );
}
