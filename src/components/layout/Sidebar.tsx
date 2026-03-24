import Link from 'next/link';
import { BookOpen, Users, LayoutDashboard, Settings, LogOut, GraduationCap, DollarSign } from 'lucide-react';

export default function Sidebar({ role = 'profesor' }: { role?: 'profesor' | 'admin' }) {
  const profesorLinks = [
    { href: '/profesor', label: 'Dashboard', icon: LayoutDashboard },
  ];

  const adminLinks = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/estudiantes', label: 'Estudiantes', icon: Users },
    { href: '/admin/cursos', label: 'Cursos', icon: BookOpen },
    { href: '/admin/finanzas', label: 'Finanzas', icon: DollarSign },
  ];

  const links = role === 'profesor' ? profesorLinks : adminLinks;

  return (
    <aside className="app-sidebar">
      <div style={{ padding: '2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: 'var(--radius-md)', color: 'white' }}>
          <GraduationCap size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>SGA</h1>
          <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Portal {role === 'profesor' ? 'Docente' : 'Administrativo'}</span>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '0 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link 
              key={link.href} 
              href={link.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                color: 'var(--foreground)',
                fontWeight: 500,
                fontSize: '0.875rem',
                transition: 'all 0.2s',
              }}
              className="nav-item"
            >
              <Icon size={20} style={{ color: 'var(--muted)' }} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)' }}>
        <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--danger)' }}>
          <LogOut size={20} />
          Cerrar Sesión
        </button>
      </div>

      <style>{`
        .nav-item:hover {
          background: var(--surface-hover);
        }
      `}</style>
    </aside>
  );
}
