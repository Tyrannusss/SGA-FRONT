import { Bell, Search } from 'lucide-react';

export default function Topbar({ user = { name: 'Juan Pérez', avatar: 'JP' } }) {
  return (
    <header className="app-topbar">
      <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
          <input 
            type="text" 
            placeholder="Buscar estudiantes, cursos..." 
            className="input"
            style={{ paddingLeft: '2.5rem', borderRadius: 'var(--radius-full)', background: 'var(--surface-hover)', border: 'none' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <button className="btn btn-ghost" style={{ padding: '0.5rem', borderRadius: 'var(--radius-full)' }}>
          <Bell size={20} />
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600 }}>{user.name}</p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--muted)' }}>Preceptor</p>
          </div>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: 'var(--radius-full)', 
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 600
          }}>
            {user.avatar}
          </div>
        </div>
      </div>
    </header>
  );
}
