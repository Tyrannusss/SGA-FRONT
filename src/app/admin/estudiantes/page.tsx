"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, Eye, UserPlus } from 'lucide-react';

const MOCK_ESTUDIANTES = [
  { id: 'STU001', name: 'Ana Sofía García', curso: 'Matemáticas Avanzadas', grado: '5to Año A', estado: 'Activo' },
  { id: 'STU002', name: 'Carlos Eduardo López', curso: 'Física Cuántica', grado: '6to Año B', estado: 'Activo' },
  { id: 'STU003', name: 'María Fernanda Ruiz', curso: 'Laboratorio de Ciencias', grado: '4to Año C', estado: 'Inactivo' },
  { id: 'STU004', name: 'Juan Pablo Torres', curso: 'Matemáticas Avanzadas', grado: '5to Año A', estado: 'Activo' },
];

export default function GestionEstudiantes() {
  const [search, setSearch] = useState('');
  const [filterCurso, setFilterCurso] = useState('');

  const filteredEstudiantes = MOCK_ESTUDIANTES.filter(est => {
    const matchesSearch = est.name.toLowerCase().includes(search.toLowerCase()) || est.id.toLowerCase().includes(search.toLowerCase());
    const matchesCurso = filterCurso ? est.curso === filterCurso : true;
    return matchesSearch && matchesCurso;
  });

  const cursos = Array.from(new Set(MOCK_ESTUDIANTES.map(e => e.curso)));

  return (
    <div className="animate-fade-in">
      <div className="admin-page-header">
        <div>
          <h1 className="page-title">Gestión de Estudiantes</h1>
          <p className="page-subtitle">Administra los perfiles, historial y estado de pagos de todos los estudiantes.</p>
        </div>
        <button className="btn btn-primary">
          <UserPlus size={18} />
          Nuevo Estudiante
        </button>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="search-filter-container">
          <div className="search-wrapper">
            <Search size={18} className="input-icon" />
            <input 
              type="text" 
              className="input input-with-icon" 
              placeholder="Buscar por nombre o ID..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="filter-wrapper">
            <Filter size={18} className="input-icon" />
            <select 
              className="input select-with-icon" 
              value={filterCurso}
              onChange={(e) => setFilterCurso(e.target.value)}
            >
              <option value="">Todos los cursos</option>
              {cursos.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre del Estudiante</th>
              <th>Grado</th>
              <th>Curso Destacado</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredEstudiantes.map(est => (
              <tr key={est.id}>
                <td style={{ fontWeight: 500 }}>{est.id}</td>
                <td>{est.name}</td>
                <td>{est.grado}</td>
                <td>{est.curso}</td>
                <td>
                  <span className={`badge ${est.estado === 'Activo' ? 'badge-success' : 'badge-neutral'}`}>
                    {est.estado}
                  </span>
                </td>
                <td>
                  <Link href={`/admin/estudiantes/${est.id}`} className="btn btn-ghost action-link">
                    <Eye size={18} />
                    Ver Detalle
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
