import { useState, useEffect } from 'react';
import { Image as ImageIcon, ChevronRight, Search, RefreshCw, ExternalLink, Award } from 'lucide-react';
import './Portfolio.css';
import siteData from '../data/siteData.json';

export function Portfolio() {
  const { portfolio } = siteData;
  const [activeTerm, setActiveTerm] = useState('term1');
  const [searchQuery, setSearchQuery] = useState('');
  const [liveData, setLiveData] = useState(null); // null = not loaded yet
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- CSV helpers (same pattern as Activities/Record pages) ---
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

  // Columns: วันที่(0), ชื่อผลงาน(1), หมวดหมู่(2), รายละเอียด(3), รูปภาพ(4), เทอม(5)
  const parseCSV = (text) => {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) return [];
    return lines.slice(1)
      .map((line, idx) => {
        const cols = parseCSVLine(line);
        return {
          id: `port-live-${idx}`,
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
  const fetchPortfolio = async () => {
    if (!portfolio.sheetUrl || portfolio.sheetUrl.includes('YOUR_PORTFOLIO_GID')) {
      setLiveData(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(portfolio.sheetUrl);
      if (!res.ok) throw new Error();
      const text = await res.text();
      const all = parseCSV(text);
      // Filter by term column
      const termNum = activeTerm === 'term1' ? '1' : '2';
      setLiveData(all.filter(r => !r.term || r.term === '' || r.term === termNum));
    } catch {
      setError('ไม่สามารถโหลดข้อมูลผลงานจาก Google Sheets ได้');
      setLiveData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, [activeTerm]);

  // Use live data if available, otherwise fall back to JSON static data
  const sourceData = liveData ?? (portfolio[activeTerm] || []);

  const filtered = sourceData.filter(port =>
    (port.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (port.category || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Determine if an entry has a Google Drive image ID (not a full URL)
  const isGoogleDriveId = (str) => str && !str.startsWith('http') && str.length > 10;

  return (
    <div className="portfolio-container animate-fade-in">
      <div className="page-header">
        <div className="badge">
          <Award size={14} style={{ marginRight: '4px', verticalAlign: 'middle', display: 'inline' }} />
          ผลงานและความภาคภูมิใจ
        </div>
        <h1 className="text-h1">{portfolio.title}</h1>
        <p className="text-body max-w-2xl">{portfolio.description}</p>
      </div>

      <div className="portfolio-controls">
        <div className="tabs-wrapper glass-panel">
          <button className={`tab-btn ${activeTerm === 'term1' ? 'active' : ''}`}
            onClick={() => setActiveTerm('term1')}>ภาคเรียนที่ 1</button>
          <button className={`tab-btn ${activeTerm === 'term2' ? 'active' : ''}`}
            onClick={() => setActiveTerm('term2')}>ภาคเรียนที่ 2</button>
        </div>

        <div className="search-wrapper glass-panel">
          <Search size={18} className="text-muted" />
          <input type="text" placeholder="ค้นหาผลงาน..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input" />
        </div>

        {portfolio.sheetUrl && !portfolio.sheetUrl.includes('YOUR_PORTFOLIO_GID') && (
          <button onClick={fetchPortfolio} className="port-refresh-btn" disabled={loading}>
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span>รีเฟรช</span>
          </button>
        )}
      </div>

      {loading && (
        <div className="port-loading glass-panel">
          <RefreshCw size={28} className="animate-spin text-primary" />
          <p>กำลังโหลดข้อมูลจาก Google Sheets...</p>
        </div>
      )}

      {error && (
        <div className="portfolio-error-banner glass-panel">
          <p>{error}</p>
        </div>
      )}

      <div className="portfolio-grid animate-fade-in" key={activeTerm + searchQuery}>
        {!loading && filtered.length > 0 ? (
          filtered.map((item) => (
            <div key={item.id} className="portfolio-card glass-panel">
              <div className="portfolio-image-wrapper">
                {isGoogleDriveId(item.imageId) ? (
                  <iframe
                    src={getPreviewUrl(item.imageId)}
                    className="portfolio-iframe"
                    title={item.title}
                    allow="autoplay"
                    loading="lazy"
                  />
                ) : item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} className="portfolio-img" />
                ) : (
                  <div className="portfolio-img-placeholder">
                    <ImageIcon size={40} />
                  </div>
                )}
                <div className="portfolio-category-badge">{item.category}</div>
              </div>
              <div className="portfolio-info">
                <h3 className="portfolio-title">{item.title}</h3>
                {item.description && (
                  <p className="portfolio-desc">{item.description}</p>
                )}
                <div className="portfolio-actions">
                  {isGoogleDriveId(item.imageId) && (
                    <a href={getDriveUrl(item.imageId)} target="_blank"
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
            <p>ไม่พบข้อมูลผลงานที่คุณค้นหา</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
