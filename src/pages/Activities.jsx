import { useState, useEffect } from 'react';
import { Calendar, Image as ImageIcon, ChevronRight, Search, RefreshCw, ExternalLink } from 'lucide-react';
import './Activities.css';
import siteData from '../data/siteData.json';

export function Activities() {
  const { activities } = siteData;
  const [activeTerm, setActiveTerm] = useState('term1');
  const [searchQuery, setSearchQuery] = useState('');
  const [liveData, setLiveData] = useState(null); // null = not loaded yet
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- CSV helpers (same pattern as Record page) ---
  const parseCSVLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { inQuotes = !inQuotes; }
      else if (ch === ',' && !inQuotes) { result.push(current.trim()); current = ''; }
      else { current += ch; }
    }
    result.push(current.trim());
    return result;
  };

  // Columns: วันที่(0), ชื่อกิจกรรม(1), หมวดหมู่(2), รายละเอียด(3), รูปภาพ(4), เทอม(5)
  const parseCSV = (text) => {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) return [];
    return lines.slice(1)
      .map((line, idx) => {
        const cols = parseCSVLine(line);
        return {
          id: `act-live-${idx}`,
          date: cols[0] || '',
          title: cols[1] || '',
          category: cols[2] || 'ทั่วไป',
          description: cols[3] || '',
          imageId: cols[4] || '',
          term: cols[5] || '',
        };
      })
      .filter(r => r.date.trim() !== '' && r.title.trim() !== '');
  };

  const getPreviewUrl = (id) => {
    if (!id || id === '-' || id === '') return null;
    return `https://drive.google.com/file/d/${id}/preview`;
  };

  const getDriveUrl = (id) => {
    if (!id || id === '-' || id === '') return null;
    return `https://drive.google.com/file/d/${id}/view`;
  };

  // --- Fetch from Sheets if URL is configured ---
  const fetchActivities = async () => {
    if (!activities.sheetUrl) { setLiveData(null); return; }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(activities.sheetUrl);
      if (!res.ok) throw new Error();
      const text = await res.text();
      const all = parseCSV(text);
      // Filter by term column
      const termNum = activeTerm === 'term1' ? '1' : '2';
      setLiveData(all.filter(r => !r.term || r.term === '' || r.term === termNum));
    } catch {
      setError('ไม่สามารถโหลดข้อมูลกิจกรรมจาก Google Sheets ได้');
      setLiveData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [activeTerm]);

  // Use live data if available, otherwise fall back to JSON static data
  const sourceData = liveData ?? (activities[activeTerm] || []);

  const filtered = sourceData.filter(act =>
    (act.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (act.category || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Determine if an entry has a Google Drive image ID (not a full URL)
  const isGoogleDriveId = (str) => str && !str.startsWith('http') && str.length > 10;

  return (
    <div className="activities-container animate-fade-in">
      <div className="page-header">
        <div className="badge">กิจกรรมและการเรียนรู้</div>
        <h1 className="text-h1">{activities.title}</h1>
        <p className="text-body max-w-2xl">{activities.description}</p>
      </div>

      <div className="activities-controls">
        <div className="tabs-wrapper glass-panel">
          <button className={`tab-btn ${activeTerm === 'term1' ? 'active' : ''}`}
            onClick={() => setActiveTerm('term1')}>ภาคเรียนที่ 1</button>
          <button className={`tab-btn ${activeTerm === 'term2' ? 'active' : ''}`}
            onClick={() => setActiveTerm('term2')}>ภาคเรียนที่ 2</button>
        </div>

        <div className="search-wrapper glass-panel">
          <Search size={18} className="text-muted" />
          <input type="text" placeholder="ค้นหากิจกรรม..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input" />
        </div>

        {(activities.term1Url || activities.term2Url) && (
          <button onClick={fetchActivities} className="act-refresh-btn" disabled={loading}>
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span>รีเฟรช</span>
          </button>
        )}
      </div>

      {loading && (
        <div className="act-loading glass-panel">
          <RefreshCw size={28} className="animate-spin text-primary" />
          <p>กำลังโหลดข้อมูลจาก Google Sheets...</p>
        </div>
      )}

      <div className="activities-grid animate-fade-in" key={activeTerm + searchQuery}>
        {!loading && filtered.length > 0 ? (
          filtered.map((activity) => (
            <div key={activity.id} className="activity-card glass-panel">
              <div className="activity-image-wrapper">
                {isGoogleDriveId(activity.imageId) ? (
                  <iframe
                    src={getPreviewUrl(activity.imageId)}
                    className="activity-iframe"
                    title={activity.title}
                    allow="autoplay"
                    loading="lazy"
                  />
                ) : activity.imageUrl ? (
                  <img src={activity.imageUrl} alt={activity.title} className="activity-img" />
                ) : (
                  <div className="activity-img-placeholder">
                    <ImageIcon size={40} />
                  </div>
                )}
                <div className="activity-category-badge">{activity.category}</div>
              </div>
              <div className="activity-info">
                <div className="activity-date">
                  <Calendar size={14} />
                  <span>{activity.date}</span>
                </div>
                <h3 className="activity-title">{activity.title}</h3>
                {activity.description && (
                  <p className="activity-desc">{activity.description}</p>
                )}
                <div className="activity-actions">
                  {isGoogleDriveId(activity.imageId) && (
                    <a href={getDriveUrl(activity.imageId)} target="_blank"
                      rel="noopener noreferrer" className="view-details-btn">
                      <ExternalLink size={14} />
                      <span>ดูรูปภาพ</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : !loading ? (
          <div className="no-results glass-panel">
            <ImageIcon size={48} className="text-muted" />
            <p>ไม่พบข้อมูลกิจกรรมที่คุณค้นหา</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
