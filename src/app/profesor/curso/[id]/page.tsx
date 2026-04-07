"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Save, Plus, MessageSquare } from 'lucide-react';
import StudentsTable from '@/components/professor/studentTable';
import AttendanceTable from '@/components/professor/attendanceTable';
import GradesTable from '@/components/professor/gradesTable';

const MOCK_STUDENTS = [
  { id: 'STU001', name: 'Ana Sofía García', average: 8.5, attendance: 95 },
  { id: 'STU002', name: 'Carlos Eduardo López', average: 7.2, attendance: 82 },
  { id: 'STU003', name: 'María Fernanda Ruiz', average: 9.8, attendance: 100 },
  { id: 'STU004', name: 'Juan Pablo Torres', average: 6.5, attendance: 75 },
];

const MOCK_EVALUATIONS = [
  { id: 'ev1', title: 'Parcial 1', date: '2023-09-15' },
  { id: 'ev2', title: 'Trabajo Práctico', date: '2023-10-02' },
];

export default function CursoDetalle({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<'estudiantes' | 'asistencia' | 'calificaciones' | 'comentarios'>('estudiantes');

  // States for interactive features
  type AttendanceStatus = 'Presente' | 'Ausente' | 'Notificado';
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>(
    MOCK_STUDENTS.reduce((acc, student) => ({ ...acc, [student.id]: 'Presente' as AttendanceStatus }), {})
  );
  const [attendanceSaved, setAttendanceSaved] = useState(false);
  const [attendanceDate, setAttendanceDate] = useState(() => new Date().toISOString().split('T')[0]);

  const [grades, setGrades] = useState<Record<string, Record<string, string>>>(
    MOCK_STUDENTS.reduce((acc, student) => ({
      ...acc,
      [student.id]: { ev1: '8', ev2: '9' }
    }), {})
  );
  const [gradesSaved, setGradesSaved] = useState(false);

  const [comments, setComments] = useState<Record<string, string[]>>(
    MOCK_STUDENTS.reduce((acc, student) => ({ ...acc, [student.id]: ['Buen rendimiento en clase.'] }), {})
  );
  const [newComment, setNewComment] = useState<Record<string, string>>({});

  const handleSaveAttendance = () => {
    setAttendanceSaved(true);
    setTimeout(() => setAttendanceSaved(false), 2000);
  };

  const toggleAttendance = (studentId: string) => {
    setAttendance(prev => {
      const current = prev[studentId];
      let next: AttendanceStatus = 'Presente';
      if (current === 'Presente') next = 'Ausente';
      else if (current === 'Ausente') next = 'Notificado';
      return { ...prev, [studentId]: next };
    });
  };

  const handleSaveGrades = () => {
    setGradesSaved(true);
    setTimeout(() => setGradesSaved(false), 2000);
  };

  const handleAddComment = (studentId: string) => {
    if (!newComment[studentId]?.trim()) return;
    setComments(prev => ({
      ...prev,
      [studentId]: [...(prev[studentId] || []), newComment[studentId]]
    }));
    setNewComment(prev => ({ ...prev, [studentId]: '' }));
  };

  return (
    <div className="animate-fade-in">
      <Link href="/profesor" className="btn btn-ghost" style={{ padding: '0', marginBottom: '1.5rem', display: 'inline-flex', color: 'var(--muted)' }}>
        <ArrowLeft size={20} />
        Volver al Dashboard
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: '0.25rem' }}>Ingles 1</h1>
          <p className="page-subtitle" style={{ margin: 0 }}>Curso {params.id} • C-001</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container" style={{ overflowX: 'auto' }}>
        {[
          { id: 'estudiantes', label: 'Estudiantes Inscritos' },
          { id: 'asistencia', label: 'Asistencia' },
          { id: 'calificaciones', label: 'Calificaciones' },
          { id: 'comentarios', label: 'Comentarios Docentes' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            style={{ whiteSpace: 'nowrap' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="card">

        {activeTab === 'estudiantes' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0 }}>
                Listado de Estudiantes
              </h2>
            </div>

            <div className="card">
              <StudentsTable courseId={Number(params.id)} />
            </div>
          </div>
        )}

        {activeTab === 'asistencia' && (
          <AttendanceTable courseId={Number(params.id)} />
        )}
        {activeTab === 'calificaciones' && (
          <GradesTable courseId={Number(params.id)} />
        )}

        {/* Comentarios Tab */}
        {activeTab === 'comentarios' && (
          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, margin: '0 0 1.5rem 0' }}>Comentarios Docentes</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {MOCK_STUDENTS.map(student => (
                <div key={student.id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 1rem 0', display: 'flex', justifyContent: 'space-between' }}>
                    {student.name}
                    <span className="badge badge-neutral">{student.id}</span>
                  </h3>

                  {/* Previous comments list */}
                  {comments[student.id]?.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                      {comments[student.id].map((comment, index) => (
                        <div key={index} style={{ background: 'var(--surface-hover)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--muted)', marginBottom: '0.25rem', fontSize: '0.75rem' }}>
                            <MessageSquare size={14} /> Docente • {new Date().toLocaleDateString()}
                          </div>
                          {comment}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: '0.875rem', color: 'var(--muted)', fontStyle: 'italic', marginBottom: '1rem' }}>No hay comentarios previos.</p>
                  )}

                  {/* Add comment form */}
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <input
                      type="text"
                      className="input"
                      placeholder="Escribir un nuevo comentario..."
                      value={newComment[student.id] || ''}
                      onChange={(e) => setNewComment(prev => ({ ...prev, [student.id]: e.target.value }))}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddComment(student.id)}
                    />
                    <button
                      className="btn btn-primary"
                      onClick={() => handleAddComment(student.id)}
                      disabled={!newComment[student.id]?.trim()}
                      style={{ opacity: !newComment[student.id]?.trim() ? 0.5 : 1 }}
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
