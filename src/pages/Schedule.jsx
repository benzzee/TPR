import { useState } from 'react';
import { Calendar, ExternalLink, Download, Clock, BookOpen, Users, Grid, Image as ImageIcon, X } from 'lucide-react';
import './Schedule.css';
import siteData from '../data/siteData.json';

export function Schedule() {
  const { schedule } = siteData;
  const [activeTerm, setActiveTerm] = useState('term2');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showImageModal, setShowImageModal] = useState(false);

  const currentTerm = schedule[activeTerm];
  const totalHours = currentTerm.courses ? currentTerm.courses.reduce((sum, course) => sum + parseInt(course.hours || 0, 10), 0) : 0;

  // Timetable time slots (10 slots: 08:00 - 17:30)
  const timeSlots = [
    "08:00 - 08:30", "08:30 - 09:30", "09:30 - 10:30", "10:30 - 11:30", 
    "11:30 - 12:30", "12:30 - 13:30", "13:30 - 14:30", "14:30 - 15:30", 
    "15:30 - 16:30", "16:30 - 17:30"
  ];

  const days = [
    { name: "จันทร์", color: "#eab308", bg: "#fef08a", text: "#713f12" },
    { name: "อังคาร", color: "#ec4899", bg: "#fce7f3", text: "#831843" },
    { name: "พุธ", color: "#22c55e", bg: "#dcfce7", text: "#14532d" },
    { name: "พฤหัสบดี", color: "#f97316", bg: "#ffedd5", text: "#7c2d12" },
    { name: "ศุกร์", color: "#06b6d4", bg: "#cffafe", text: "#164e63" }
  ];

  // Mapping for the grid (dayIndex, slotStartIndex, slotSpan, subject, code, classes, color)
  const timetableEvents = {
    term1: [
      { day: 0, start: 0, span: 1, name: "กิจกรรมหน้าเสาธง", code: "", color: "#94a3b8" },
      { day: 1, start: 0, span: 1, name: "กิจกรรมหน้าเสาธง", code: "", color: "#94a3b8" },
      { day: 2, start: 0, span: 1, name: "กิจกรรมหน้าเสาธง", code: "", color: "#94a3b8" },
      { day: 3, start: 0, span: 1, name: "กิจกรรมหน้าเสาธง", code: "", color: "#94a3b8" },
      { day: 4, start: 0, span: 1, name: "กิจกรรมหน้าเสาธง", code: "", color: "#94a3b8" },
      
      { day: 0, start: 4, span: 2, name: "กิจกรรมเสริมสร้างสุจริต จิตอาสา", code: "30000 - 2001", classes: "ทั้งหมด", color: "#f59e0b" },
      { day: 1, start: 5, span: 4, name: "การใช้เทคโนโลยีดิจิทัลเพื่ออาชีพ", code: "20001 - 1005", classes: "ปวช.", color: "#e84c7b" },
      { day: 2, start: 1, span: 3, name: "การออกแบบส่วนติดต่อผู้ใช้", code: "21901 - 2008", classes: "ปวช.", color: "#10b981" },
    ],
    term2: [
      // กิจกรรมหน้าเสาธง ทุกวันจันทร์ - ศุกร์
      { day: 0, start: 0, span: 1, name: "กิจกรรมหน้าเสาธง", code: "", color: "#94a3b8" },
      { day: 1, start: 0, span: 1, name: "กิจกรรมหน้าเสาธง", code: "", color: "#94a3b8" },
      { day: 2, start: 0, span: 1, name: "กิจกรรมหน้าเสาธง", code: "", color: "#94a3b8" },
      { day: 3, start: 0, span: 1, name: "กิจกรรมหน้าเสาธง", code: "", color: "#94a3b8" },
      { day: 4, start: 0, span: 1, name: "กิจกรรมหน้าเสาธง", code: "", color: "#94a3b8" },

      // วันจันทร์
      // คาบ 2-3 (09:30 - 11:30 น.)
      { day: 0, start: 2, span: 2, name: "การประยุกต์ใช้เทคโนโลยีดิจิทัลในงานอาชีพ", code: "30001-1003", classes: "ปวส.1", color: "#8b5cf6" },
      // คาบ 6-7 (13:30 - 15:30 น.)
      { day: 0, start: 6, span: 2, name: "การซ่อมและบำรุงรักษาคอมพิวเตอร์", code: "21901-2004", classes: "ปวช.1", color: "#f43f5e" },
      // คาบ 8-9 (15:30 - 17:30 น.)
      { day: 0, start: 8, span: 2, name: "ระบบปฏิบัติการคอมพิวเตอร์", code: "21910-2001", classes: "ปวช.1", color: "#3b82f6" },

      // วันอังคาร
      // คาบ 2-3 (09:30 - 11:30 น.)
      { day: 1, start: 2, span: 2, name: "การซ่อมและบำรุงรักษาคอมพิวเตอร์", code: "21901-2004", classes: "ปวช.1", color: "#f43f5e" },
      // คาบ 6-7 (13:30 - 15:30 น.)
      { day: 1, start: 6, span: 2, name: "การประยุกต์ใช้เทคโนโลยีดิจิทัลในงานอาชีพ", code: "30001-1003", classes: "ปวส.1", color: "#8b5cf6" },

      // วันพฤหัสบดี
      // คาบ 5-6 (12:30 - 14:30 น.)
      { day: 3, start: 5, span: 2, name: "ระบบปฏิบัติการคอมพิวเตอร์", code: "21910-2001", classes: "ปวช.1", color: "#3b82f6" }
    ]
  };

  const currentEvents = timetableEvents[activeTerm] || [];

  return (
    <div className="schedule-container animate-fade-in">
      <div className="page-header">
        <div className="badge">ตารางการปฏิบัติงาน</div>
        <h1 className="text-h1">{schedule.title}</h1>
        <p className="text-body">ข้อมูลการจัดการเรียนการสอนและตารางเวลาปฏิบัติงาน {currentTerm.semester}</p>
      </div>

      <div className="schedule-controls">
        <div className="tabs-wrapper glass-panel">
          <button 
            className={`tab-btn ${activeTerm === 'term1' ? 'active' : ''}`}
            onClick={() => setActiveTerm('term1')}
          >
            ภาคเรียนที่ 1
          </button>
          <button 
            className={`tab-btn ${activeTerm === 'term2' ? 'active' : ''}`}
            onClick={() => setActiveTerm('term2')}
          >
            ภาคเรียนที่ 2
          </button>
        </div>

        <div className="view-toggle glass-panel">
          <button 
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="ดูแบบตาราง"
          >
            <Grid size={18} />
          </button>
          <button 
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="ดูแบบรายการ"
          >
            <BookOpen size={18} />
          </button>
        </div>

        <div className="extra-actions">
          {currentTerm.imageUrl && (
            <button 
              className="image-preview-btn glass-panel"
              onClick={() => setShowImageModal(true)}
              title="ดูภาพตารางสอนต้นฉบับ"
            >
              <ImageIcon size={18} />
              <span>ภาพตารางสอน</span>
            </button>
          )}

          {schedule.driveUrl && (
            <a 
              href={schedule.driveUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="drive-link-btn"
            >
              <ExternalLink size={18} />
              <span>ดูเวลาฝึกงาน (Drive)</span>
            </a>
          )}
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="timetable-section animate-fade-in">
          <div className="timetable-container glass-panel">
            <div className="timetable-header">
              <div className="time-col-header">วัน / เวลา</div>
              {timeSlots.map((slot, i) => (
                <div key={i} className="slot-header">
                  <span className="slot-num">{i === 0 ? "เช้า" : `คาบ ${i}`}</span>
                  <span className="slot-time">{slot}</span>
                </div>
              ))}
            </div>
            
            <div className="timetable-body">
              {days.map((day, dayIndex) => (
                <div key={dayIndex} className="day-row">
                  <div className="day-name">
                    <span 
                      className="day-badge" 
                      style={{ 
                        backgroundColor: day.bg, 
                        color: day.text,
                        borderColor: day.color 
                      }}
                    >
                      {day.name}
                    </span>
                  </div>
                  <div className="slots-container">
                    {/* Render blank slots */}
                    {timeSlots.map((_, i) => (
                      <div key={i} className="empty-slot"></div>
                    ))}
                    
                    {/* Render events */}
                    {currentEvents.filter(e => e.day === dayIndex).map((event, i) => (
                      <div 
                        key={i} 
                        className={`event-block ${!event.code ? 'is-flag' : ''}`}
                        style={{ 
                          gridColumnStart: event.start + 1, 
                          gridColumnEnd: event.start + 1 + event.span,
                          backgroundColor: event.color + '22',
                          borderLeft: `4px solid ${event.color}`,
                          color: event.color
                        }}
                      >
                        {event.code && <span className="event-code">{event.code}</span>}
                        <span className="event-name">{event.name}</span>
                        {event.classes && <span className="event-classes">{event.classes}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="timetable-summary glass-panel">
            <span>สรุปชั่วโมงสอน:</span>
            <span className="summary-hours">{totalHours} ชม. / สัปดาห์</span>
          </div>
        </div>
      ) : (
        <div className="courses-section animate-fade-in">
          <div className="courses-list">
            {currentTerm.courses.map((course) => (
              <div key={course.id} className="course-card glass-panel">
                <div className="course-header">
                  <span className="course-code">{course.code}</span>
                  <span className="course-hours">{course.hours} ชม./สัปดาห์</span>
                </div>
                <h3 className="course-name">{course.name}</h3>
                <div className="course-footer">
                  <div className="course-info-item">
                    <Users size={16} />
                    <span>{course.classes}</span>
                  </div>
                  {course.schedule && (
                    <div className="course-info-item schedule-time">
                      <Clock size={16} />
                      <span>{course.schedule}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {showImageModal && currentTerm.imageUrl && (
        <div className="image-modal-backdrop" onClick={() => setShowImageModal(false)}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="image-modal-header">
              <h3>ตารางสอนต้นฉบับ - {currentTerm.semester}</h3>
              <button 
                className="close-modal-btn" 
                onClick={() => setShowImageModal(false)}
                title="ปิด"
              >
                <X size={20} />
              </button>
            </div>
            <div className="image-modal-body">
              <img src={currentTerm.imageUrl} alt={`ตารางสอน ${currentTerm.semester}`} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
