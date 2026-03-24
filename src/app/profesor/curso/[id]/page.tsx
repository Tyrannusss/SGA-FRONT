"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Save, Plus, MessageSquare } from 'lucide-react';

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
        {/* Estudiantes Tab */}
        {activeTab === 'estudiantes' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0 }}>Listado de Estudiantes</h2>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Promedio Actual</th>
                    <th>Asistencia</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_STUDENTS.map(student => (
                    <tr key={student.id}>
                      <td style={{ fontWeight: 500 }}>{student.id}</td>
                      <td>{student.name}</td>
                      <td>{student.average}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ flex: 1, background: 'var(--surface-hover)', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${student.attendance}%`, background: student.attendance >= 80 ? 'var(--success)' : 'var(--warning)', height: '100%' }}></div>
                          </div>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{student.attendance}%</span>
                        </div>
                      </td>
                      <td>
                        {student.average >= 7 ?
                          <span className="badge badge-success">Regular</span> :
                          <span className="badge badge-warning">Riesgo</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Asistencia Tab */}
        {activeTab === 'asistencia' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0 }}>Registro de Asistencia</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <label htmlFor="attendance-date" style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>Clase del:</label>
                  <input
                    id="attendance-date"
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border)',
                      background: 'var(--surface)',
                      color: 'var(--foreground)',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
              <button onClick={handleSaveAttendance} className="btn btn-primary">
                {attendanceSaved ? <Check size={18} /> : <Save size={18} />}
                {attendanceSaved ? 'Guardado' : 'Guardar Cambios'}
              </button>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Estudiante</th>
                    <th style={{ width: '160px', textAlign: 'center' }}>Presente / Ausente / Notificado</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_STUDENTS.map(student => (
                    <tr key={student.id}>
                      <td>{student.name}</td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          onClick={() => toggleAttendance(student.id)}
                          style={{
                            padding: '0.5rem 1rem',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            background: attendance[student.id] === 'Presente' ? 'var(--success-bg)' : attendance[student.id] === 'Ausente' ? 'var(--danger-bg)' : 'var(--warning-bg)',
                            color: attendance[student.id] === 'Presente' ? 'var(--success)' : attendance[student.id] === 'Ausente' ? 'var(--danger)' : 'var(--warning)',
                            transition: 'all 0.2s',
                            border: '1px solid transparent',
                            width: '120px'
                          }}
                        >
                          {attendance[student.id]}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Calificaciones Tab */}
        {activeTab === 'calificaciones' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0 }}>Registro de Calificaciones</h2>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Plus size={18} /> Nueva Evaluación
                </button>
                <button onClick={handleSaveGrades} className="btn btn-primary">
                  {gradesSaved ? <Check size={18} /> : <Save size={18} />}
                  {gradesSaved ? 'Guardado' : 'Guardar Cambios'}
                </button>
              </div>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Estudiante</th>
                    {MOCK_EVALUATIONS.map(ev => (
                      <th key={ev.id} style={{ width: '120px' }}>
                        {ev.title}
                        <div style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--muted)' }}>{ev.date}</div>
                      </th>
                    ))}
                    <th style={{ width: '100px' }}>Promedio</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_STUDENTS.map(student => {
                    const studentGrades = grades[student.id] || {};
                    const total = Object.values(studentGrades).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
                    const avg = Object.keys(studentGrades).length > 0 ? (total / Object.keys(studentGrades).length).toFixed(1) : '-';

                    return (
                      <tr key={student.id}>
                        <td>{student.name}</td>
                        {MOCK_EVALUATIONS.map(ev => (
                          <td key={ev.id}>
                            <input
                              type="number"
                              className="input"
                              style={{ width: '80px', padding: '0.4rem 0.5rem', textAlign: 'center' }}
                              value={studentGrades[ev.id] || ''}
                              onChange={(e) => setGrades(prev => ({
                                ...prev,
                                [student.id]: { ...(prev[student.id] || {}), [ev.id]: e.target.value }
                              }))}
                              min="0" max="10" step="0.1"
                            />
                          </td>
                        ))}
                        <td style={{ fontWeight: 600 }}>{avg}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
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
