"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Save, Plus, MessageSquare } from 'lucide-react';
import StudentsTable from '@/components/professor/studentTable';
import AttendanceTable from '@/components/professor/attendanceTable';
import GradesTable from '@/components/professor/gradesTable';
import CommentsTable from '@/components/professor/commentTable';



export default function CursoDetalle({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<'estudiantes' | 'asistencia' | 'calificaciones' | 'comentarios'>('estudiantes');


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
        {activeTab === 'comentarios' && (
          <CommentsTable courseId={Number(params.id)} />
        )}
      </div>
    </div>
  );
}
