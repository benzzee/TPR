import { useState } from 'react';
import { Calendar, ExternalLink, Download, Clock, BookOpen, Users, Grid } from 'lucide-react';
import './Schedule.css';
import siteData from '../data/siteData.json';

export function Schedule() {
  const { schedule } = siteData;
  const [activeTerm, setActiveTerm] = useState('term1');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const currentTerm = schedule[activeTerm];
  const totalHours = currentTerm.courses ? currentTerm.courses.reduce((sum, course) => sum + parseInt(course.hours || 0, 10), 0) : 0;

  // Timetable data for Term 1 (based on the user's provided image)
  const timeSlots = [
    "08:00 - 08:30", "08:30 - 09:30", "09:30 - 10:30", "10:30 - 11:30", 
    "11:30 - 12:30", "12:30 - 13:30", "13:30 - 14:30", "14:30 - 15:30", "15:30 - 16:30"
  ];

  const days = ["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์"];

  // Mapping for the grid (dayIndex, slotStartIndex, slotSpan, subject, code, color)
  const timetableEvents = {
    term1: [
      { day: 0, start: 0, span: 1, name: "กิจกรรมหน้าเสาธง", code: "", color: "#94a3b8" },
      { day: 1, start: 0, span: 1, name: "กิจกรรมหน้าเสาธง", code: "", color: "#94a3b8" },
      { day: 2, start: 0, span: 1, name: "กิจกรรมหน้าเสาธง", code: "", color: "#94a3b8" },
      { day: 3, start: 0, span: 1, name: "กิจกรรมหน้าเสาธง", code: "", color: "#94a3b8" },
      { day: 4, start: 0, span: 1, name: "กิจกรรมหน้าเสาธง", code: "", color: "#94a3b8" },
      
      { day: 0, start: 4, span: 2, name: "กิจกรรมเสริมสร้างสุจริต จิตอาสา", code: "30000 - 2001", color: "#f59e0b" },
      { day: 1, start: 5, span: 4, name: "การใช้เทคโนโลยีดิจิทัลเพื่ออาชีพ", code: "20001 - 1005", color: "#e84c7b" },
      { day: 2, start: 1, span: 3, name: "การออกแบบส่วนติดต่อผู้ใช้", code: "21901 - 2008", color: "#10b981" },
    ],
    term2: [] // Add term 2 data here later
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

        {schedule.driveUrl && (
          <a 
            href={schedule.driveUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="drive-link-btn"
          >
            <ExternalLink size={18} />
            <span>ดูเวลาฝึกงาน (Google Drive)</span>
          </a>
        )}
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
                  <div className="day-name">{day}</div>
                  <div className="slots-container">
                    {/* Render blank slots */}
                    {timeSlots.map((_, i) => (
                      <div key={i} className="empty-slot"></div>
                    ))}
                    
                    {/* Render events */}
                    {currentEvents.filter(e => e.day === dayIndex).map((event, i) => (
                      <div 
                        key={i} 
                        className="event-block"
                        style={{ 
                          gridColumnStart: event.start + 1, 
                          gridColumnEnd: event.start + 1 + event.span,
                          backgroundColor: event.color + '22',
                          borderLeft: `4px solid ${event.color}`,
                          color: event.color
                        }}
                      >
                        <span className="event-code">{event.code}</span>
                        <span className="event-name">{event.name}</span>
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
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
