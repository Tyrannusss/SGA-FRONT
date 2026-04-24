"use client";

import Link from 'next/link';
import { BookOpen, Users, LayoutDashboard, GraduationCap, Search, LogOut } from 'lucide-react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function Navbar({
  role = 'profesor',
  user,
}: {
  role?: 'profesor' | 'admin';
  user: {
    primer_nombre: string;
    primer_apellido: string;
  };
}) {
  const router = useRouter();

  const handleLogout = () => {
    // eliminar cookie
    Cookies.remove("token", { path: "/" });

    // redirigir al login
    router.push("/");
  };

  const fullName = `${user.primer_nombre} ${user.primer_apellido}`;
  const profesorLinks: any[] = [];

  const adminLinks = [
    { href: '/admin/estudiantes', label: 'Estudiantes', icon: Users },
    { href: '/admin/cursos', label: 'Cursos', icon: BookOpen },
    { href: '/admin/crear', label: 'Crear Usuario', icon: Users },
  ];

  const links = role === 'profesor' ? profesorLinks : adminLinks;

  return (
    <header className="app-navbar">
      <div className="navbar-left">
        <div className="navbar-logo-container">
          <div className="navbar-logo-icon">
            <GraduationCap size={24} />
          </div>
          <div>
            <h1 className="navbar-logo-title">SGA</h1>
            <span className="navbar-logo-subtitle">
              Portal {role === 'profesor' ? 'Docente' : 'Administrativo'}
            </span>
          </div>
        </div>

        <nav className="navbar-nav">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href} className="navbar-link">
                <Icon size={18} className="navbar-link-icon" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="navbar-right">
        <div className="navbar-user-section">
          <div className="navbar-user-info">
            <p className="navbar-user-name">{fullName}</p>
          </div>
          <div className="navbar-user-avatar">
            {fullName[0].toUpperCase()}{fullName[1].toUpperCase()}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="btn btn-ghost navbar-logout-btn"
          title="Cerrar Sesión"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}