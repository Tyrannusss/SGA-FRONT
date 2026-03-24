"use client";

import { Plus } from 'lucide-react';
import AdminCourseCard from '@/components/ui/AdminCourseCard';

const MOCK_CURSOS = [
  { id: 'C01', nombre: 'Ingles 1', grado: 'C-001', profesor: 'Roberto Mendoza', estudiantes: 32 },
  { id: 'C02', nombre: 'Ingles 2', grado: 'C-002', profesor: 'Laura Jiménez', estudiantes: 28 },
  { id: 'C03', nombre: 'Ingles 3', grado: 'C-003', profesor: 'Sin Asignar', estudiantes: 25 },
];

export default function GestionCursos() {
  return (
    <div className="animate-fade-in">
      <div className="admin-page-header">
        <div>
          <h1 className="page-title">Gestión de Cursos</h1>
          <p className="page-subtitle">Crea, edita y asigna profesores a los cursos académicos.</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'start', marginBottom: '1rem' }}>
          <button className="btn btn-primary">
            <Plus size={18} />
            Crear Curso
          </button>
        </div>
      </div>

      <div className="course-grid">
        {MOCK_CURSOS.map(curso => (
          <AdminCourseCard key={curso.id} {...curso} />
        ))}
      </div>
    </div>
  );
}
