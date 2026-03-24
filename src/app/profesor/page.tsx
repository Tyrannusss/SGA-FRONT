import Link from 'next/link';
import ProfessorCourseCard from '@/components/ui/ProfessorCourseCard';

export default function ProfesorDashboard() {
  const cursos = [
    { id: '1', nombre: 'Ingles 1', grado: 'C-001', estudiantes: 32, horario: 'Lun - Mié 08:00', icon: 'bg-blue-100 text-blue-600' },
    { id: '2', nombre: 'Ingles 2', grado: 'C-002', estudiantes: 28, horario: 'Mar - Jue 10:30', icon: 'bg-purple-100 text-purple-600' },
    { id: '3', nombre: 'Ingles 3', grado: 'C-003', estudiantes: 25, horario: 'Vie 14:00', icon: 'bg-emerald-100 text-emerald-600' },
  ];

  return (
    <div className="animate-fade-in">
      <h1 className="page-title">Bienvenido, Roberto</h1>
      <p className="page-subtitle">Aquí está el resumen de tus cursos asignados para el ciclo actual.</p>


      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Mis Cursos</h2>
        <button className="btn btn-ghost" style={{ fontSize: '0.875rem' }}>Ver todos</button>
      </div>

      <div className="course-grid">
        {cursos.map(curso => (
          <ProfessorCourseCard key={curso.id} {...curso} />
        ))}
      </div>
    </div>
  );
}
