export function Placeholder({ title, description }) {
  return (
    <div className="animate-fade-in" style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      gap: '1rem',
      backgroundColor: 'var(--surface)',
      borderRadius: 'var(--radius-xl)',
      padding: '3rem',
      border: '1px dashed var(--border)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        backgroundColor: 'var(--primary-alpha)',
        color: 'var(--primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2rem',
        marginBottom: '1rem'
      }}>
        🚧
      </div>
      <h2 className="text-h2">{title}</h2>
      <p className="text-body" style={{ maxWidth: '400px' }}>
        {description || 'กำลังอยู่ในระหว่างการพัฒนาหน้านี้ จะเปิดใช้งานในเร็วๆ นี้'}
      </p>
    </div>
  );
}
