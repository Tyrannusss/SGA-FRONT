"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { ArrowLeft, User } from "lucide-react";

export default function EstudianteDetalle({
  params,
}: {
  params: { id: string };
}) {
  const [student, setStudent] = useState<any>(null);
  const [payments, setPayments] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"academico" | "pagos">("academico");

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/students/${params.id}/full-detail`,
          { withCredentials: true }
        );

        const s = res.data;

        setStudent({
          id: s.id_student,
          name: s.nombre_completo,
          estado: s.estado,
          cursos: s.cursos,
          asistencia: Number(s.promedio_asistencia),
          promedio: Number(s.promedio_evaluaciones),
          evaluaciones: s.evaluaciones || [],
          comentarios: s.comentarios || [],
          email: s.email,
          email_secundario: s.email_secundario,
          telefono: s.telefono,
        });
      } catch (error) {
        console.error("Error estudiante:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchPayments = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/liquidaciones/student/${params.id}/summary`,
          { withCredentials: true }
        );

        setPayments(res.data);
      } catch (error) {
        console.error("Error pagos:", error);
      }
    };

    fetchStudent();
    fetchPayments();
  }, [params.id]);

  if (loading) return <p>Cargando estudiante...</p>;
  if (!student) return <p>No se encontró el estudiante</p>;

  const estadoActual = (() => {
    const cobros = payments?.cobros || [];

    const adeudoTotal = cobros
      .filter((c: any) => c.estado === "pendiente")
      .reduce((sum: number, c: any) => sum + Number(c.monto), 0);
    if (!cobros.length) return null;

    const hayPendientes = cobros.some(
      (c: any) => c.estado === "pendiente"
    );

    const todosPagados = cobros.every(
      (c: any) => c.estado === "pagado"
    );

    if (hayPendientes) return "adeudo";
    if (todosPagados) return "al_dia";

    return null;
  })();
  const formatPeriodo = (p: string) =>
    p ? `${p.slice(0, 4)}/${p.slice(4)}` : "";

  return (
    <div className="animate-fade-in">

      {/* BACK */}
      <Link
        href="/admin/estudiantes"
        className="btn btn-ghost"
        style={{ marginBottom: "1.5rem", display: "inline-flex" }}
      >
        <ArrowLeft size={20} />
        Volver
      </Link>

      {/* HEADER */}
      <div
        style={{
          marginBottom: "2rem",
          padding: "1.5rem",
          background: "#f8fafc",
          borderRadius: "12px",
        }}
      >
        <h1 style={{ fontSize: "2.2rem", fontWeight: "bold" }}>
          Gestión de Estudiantes
        </h1>
        <p style={{ color: "#6b7280" }}>
          Administración y pagos del estudiante
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: "1.5rem",
        }}
      >

        {/* IZQUIERDA */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {/* PERFIL */}
          <div className="card" style={{ padding: "1rem" }}>
            <div style={{ textAlign: "center", marginBottom: "1rem" }}>
              <User size={40} />
              <h1>{student.name}</h1>
              <span className="badge badge-neutral">{student.id}</span>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <span
                style={{
                  padding: "6px 14px",
                  borderRadius: "999px",
                  backgroundColor:
                    student.estado === "Activo" ? "#22c55e" : "#ef4444",
                  color: "white",
                }}
              >
                {student.estado}
              </span>
            </div>

            <div>📧 {student.email}</div>
            <div>📧 {student.email_secundario}</div>
            <div>📱 {student.telefono}</div>
            <div>📚 {student.cursos}</div>
          </div>

          {/* MÉTRICAS */}
          <div className="card" style={{ padding: "1rem" }}>
            <h3>Rendimiento</h3>

            <div style={{ display: "flex", gap: "1rem" }}>
              <div style={{ flex: 1, textAlign: "center" }}>
                <p>Asistencia</p>
                <h2>{student.asistencia.toFixed(0)}%</h2>
              </div>

              <div style={{ flex: 1, textAlign: "center" }}>
                <p>Evaluaciones</p>
                <h2>{student.promedio.toFixed(0)}%</h2>
              </div>
            </div>
          </div>
        </div>

        {/* DERECHA */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {/* TABS */}
          <div
            style={{
              display: "flex",
              borderBottom: "1px solid #e5e7eb",
              gap: "1rem",
            }}
          >
            <button
              onClick={() => setTab("academico")}
              style={{
                padding: "0.75rem",
                border: "none",
                background: "transparent",
                borderBottom:
                  tab === "academico"
                    ? "2px solid var(--primary)"
                    : "2px solid transparent",
                fontWeight: 500,
              }}
            >
              Historial Académico
            </button>

            <button
              onClick={() => setTab("pagos")}
              style={{
                padding: "0.75rem",
                border: "none",
                background: "transparent",
                borderBottom:
                  tab === "pagos"
                    ? "2px solid var(--primary)"
                    : "2px solid transparent",
                fontWeight: 500,
              }}
            >
              Pagos
            </button>
          </div>

          {/* ACADÉMICO */}
          {tab === "academico" && (
            <>
              <div className="card">
                <table>
                  <thead>
                    <tr>
                      <th>Curso</th>
                      <th>Tipo</th>
                      <th>Calificación</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>

                  <tbody>
                    {student.evaluaciones.map((ev: any, i: number) => (
                      <tr key={i}>
                        <td>{ev.curso}</td>
                        <td>{ev.tipo}</td>
                        <td>{ev.calificacion}</td>
                        <td>
                          {new Date(ev.fecha)
                            .toISOString()
                            .slice(0, 10)
                            .replace(/-/g, "/")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* COMENTARIOS */}
              <div className="card">
                {student.comentarios.length === 0 ? (
                  <p style={{ color: "gray" }}>Sin comentarios</p>
                ) : (
                  student.comentarios.map((c: any, i: number) => (
                    <div
                      key={i}
                      style={{
                        padding: "1rem",
                        marginBottom: "1rem",
                        border: "1px solid #e5e7eb",
                        borderRadius: "10px",
                      }}
                    >
                      <p>{c.comentario || c.texto}</p>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {/* PAGOS */}
          {tab === "pagos" && (
            <>
              {(() => {
                const cobros = payments?.cobros || [];

                const adeudoTotal = cobros
                  .filter((c: any) => c.estado === "pendiente")
                  .reduce((sum: number, c: any) => sum + Number(c.monto), 0);

                const estado =
                  !cobros.length
                    ? null
                    : (() => {
                      const adeudoTotal = cobros
                        .filter((c: any) => c.estado === "pendiente")
                        .reduce((sum: number, c: any) => sum + Number(c.monto), 0);

                      const hayPendientes = cobros.some(
                        (c: any) => c.estado === "pendiente"
                      );

                      if (adeudoTotal === 0) return "al_dia";
                      if (hayPendientes) return "adeudo";

                      return "al_dia";
                    })();

                return (
                  <>
                    {/* ESTADO ACTUAL */}
                    <div
                      style={{
                        padding: "1.5rem",
                        border: "1px solid #e5e7eb",
                        borderRadius: "12px",
                        textAlign: "center",
                      }}
                    >
                      <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>
                        Estado de pago
                      </h3>

                      <div
                        style={{
                          fontSize: "2rem",
                          fontWeight: "bold",
                          marginBottom: "0.5rem",
                          color:
                            estado === "al_dia"
                              ? "#166534"
                              : estado === "adeudo"
                                ? "#991b1b"
                                : "#374151",
                        }}
                      >
                        {estado === "adeudo" && "⚠ Adeudo"}
                        {estado === "al_dia" && "✔ Al día"}
                        {!estado && "Sin estado"}
                      </div>

                      {estado === "adeudo" && (
                        <div
                          style={{
                            fontSize: "1.5rem",
                            fontWeight: "600",
                            color: "#991b1b",
                          }}
                        >
                          Deuda total: ${adeudoTotal.toLocaleString("es-MX")}
                        </div>
                      )}
                    </div>

                    {/* HISTORIAL */}
                    <div className="card">
                      <h3>Historial de pagos</h3>

                      <table>
                        <thead>
                          <tr>
                            <th>Periodo</th>
                            <th>Monto</th>
                            <th>Estado</th>
                          </tr>
                        </thead>

                        <tbody>
                          {cobros.map((pago: any) => (
                            <tr key={pago.id_cobro}>
                              <td>{formatPeriodo(pago.periodo)}</td>
                              <td>${pago.monto}</td>
                              <td>{pago.estado}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {cobros.length === 0 && (
                        <p style={{ color: "gray", marginTop: "1rem" }}>
                          Sin registros de pagos
                        </p>
                      )}
                    </div>
                  </>
                );
              })()}
            </>
          )}
        </div>
      </div>
    </div>
  );
}