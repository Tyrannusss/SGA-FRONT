"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, User, Mail, Phone, Calendar, BookOpen, AlertCircle, CheckCircle2, History } from 'lucide-react';

const MOCK_ESTUDIANTE = {
  id: 'STU001',
  name: 'Ana Sofía García',
  fechaNacimiento: '15/04/2006',
  email: 'ana.garcia@email.com',
  telefono: '+54 11 1234-5678',
  tutor: 'María García (Madre)',
  estadoPagos: 'Pendiente',
  deudaTotal: '$15,000',
  cursosActuales: [
    { id: 'C01', nombre: 'Matemáticas Avanzadas', profesor: 'Roberto Mendoza' },
    { id: 'C04', nombre: 'Literatura Contemporánea', profesor: 'Silvia Pérez' }
  ],
  historialAcademico: [
    { curso: 'Matemáticas Básicas', periodo: '2022', notaFinal: 9.5, asistencia: '98%', comentarios: 'Excelente participación.' },
    { curso: 'Física I', periodo: '2022', notaFinal: 8.0, asistencia: '90%', comentarios: 'Buen trabajo en equipo.' },
    { curso: 'Historia Nacional', periodo: '2022', notaFinal: 7.5, asistencia: '85%', comentarios: 'Debe mejorar en los ensayos.' }
  ],
  historialPagos: [
    { fecha: '05/10/2023', concepto: 'Cuota Octubre', monto: '$15,000', estado: 'Pendiente' },
    { fecha: '02/09/2023', concepto: 'Cuota Septiembre', monto: '$15,000', estado: 'Pagado' },
    { fecha: '04/08/2023', concepto: 'Cuota Agosto', monto: '$15,000', estado: 'Pagado' },
    { fecha: '01/03/2023', concepto: 'Matrícula Anual', monto: '$25,000', estado: 'Pagado' }
  ]
};

export default function EstudianteDetalle({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<'historial' | 'pagos'>('historial');

  return (
    <div className="animate-fade-in">
      <Link href="/admin/estudiantes" className="btn btn-ghost" style={{ padding: '0', marginBottom: '1.5rem', display: 'inline-flex', color: 'var(--muted)' }}>
        <ArrowLeft size={20} />
        Volver a Estudiantes
      </Link>

      <div className="student-detail-grid">
        
        {/* Columna Izquierda: Información General */}
        <div className="card student-profile-card">
          <div className="student-avatar-container">
            <div className="student-avatar">
              <User size={40} />
            </div>
            <h1 className="student-name">{MOCK_ESTUDIANTE.name}</h1>
            <span className="badge badge-neutral">{params.id}</span>
          </div>

          <div className="student-info-list">
            <div className="student-info-item">
              <Mail size={16} /> {MOCK_ESTUDIANTE.email}
            </div>
            <div className="student-info-item">
              <Phone size={16} /> {MOCK_ESTUDIANTE.telefono}
            </div>
            <div className="student-info-item">
              <Calendar size={16} /> Nacimiento: {MOCK_ESTUDIANTE.fechaNacimiento}
            </div>
            <div className="student-info-item">
              <User size={16} /> Tutor: {MOCK_ESTUDIANTE.tutor}
            </div>
          </div>

          <div>
            <h3 className="student-courses-title">Cursos Actuales</h3>
            <div className="student-courses-section">
              {MOCK_ESTUDIANTE.cursosActuales.map(curso => (
                <div key={curso.id} className="student-course-item">
                  <div className="student-course-item-name">{curso.nombre}</div>
                  <div className="student-course-item-prof">
                    <BookOpen size={12} /> {curso.profesor}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Columna Derecha: Tabs de Historial y Pagos */}
        <div>
          <div className="tabs-container">
            <button
              onClick={() => setActiveTab('historial')}
              className={`tab-btn ${activeTab === 'historial' ? 'active' : ''}`}
            >
              <History size={18} /> Historial Académico
            </button>
            <button
              onClick={() => setActiveTab('pagos')}
              className={`tab-btn ${activeTab === 'pagos' ? 'active' : ''}`}
            >
              <span>
                Pagos
                {MOCK_ESTUDIANTE.estadoPagos === 'Pendiente' && (
                  <span className="notification-dot" />
                )}
              </span>
            </button>
          </div>

          {activeTab === 'historial' && (
            <div className="card">
              <h2 className="section-title">Rendimiento Histórico</h2>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Curso</th>
                      <th>Período</th>
                      <th>Nota Final</th>
                      <th>Asistencia</th>
                      <th>Comentario Final</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_ESTUDIANTE.historialAcademico.map((h, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 500 }}>{h.curso}</td>
                        <td>{h.periodo}</td>
                        <td style={{ fontWeight: 600, color: h.notaFinal >= 7 ? 'var(--success)' : 'var(--danger)' }}>{h.notaFinal}</td>
                        <td>{h.asistencia}</td>
                        <td style={{ color: 'var(--muted)', fontSize: '0.8rem', maxWidth: '200px' }}>{h.comentarios}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'pagos' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Indicador visual de deuda */}
              {MOCK_ESTUDIANTE.estadoPagos === 'Pendiente' ? (
                <div className="debt-alert-card">
                  <div className="debt-alert-info">
                    <AlertCircle size={32} />
                    <div>
                      <h3 className="debt-alert-title">Deuda Pendiente</h3>
                      <p className="debt-alert-desc">El estudiante tiene pagos atrasados.</p>
                    </div>
                  </div>
                  <div className="debt-alert-action">
                    <div className="debt-amount">{MOCK_ESTUDIANTE.deudaTotal}</div>
                    <button className="btn btn-outline btn-danger-outline">Registrar Pago</button>
                  </div>
                </div>
              ) : (
                <div className="success-alert-card">
                  <CheckCircle2 size={32} />
                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>Estado de cuenta al día</h3>
                    <p style={{ margin: 0, opacity: 0.9 }}>No hay deudas pendientes registradas.</p>
                  </div>
                </div>
              )}

              <div className="card">
                <h2 className="section-title">Historial de Transacciones</h2>
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Concepto</th>
                        <th>Monto</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_ESTUDIANTE.historialPagos.map((p, i) => (
                        <tr key={i}>
                          <td>{p.fecha}</td>
                          <td style={{ fontWeight: 500 }}>{p.concepto}</td>
                          <td style={{ fontWeight: 600 }}>{p.monto}</td>
                          <td>
                            <span className={`badge ${p.estado === 'Pagado' ? 'badge-success' : 'badge-danger'}`}>
                              {p.estado}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
