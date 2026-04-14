"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { Search, Filter, Eye, UserPlus } from "lucide-react";

export default function GestionEstudiantes() {
  const [estudiantes, setEstudiantes] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filterCurso, setFilterCurso] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  useEffect(() => {
    setPage(1);
  }, [search, filterCurso]);

  // 🔹 Obtener datos de la API
  useEffect(() => {
    const fetchEstudiantes = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/students/full-info`,
          {
            withCredentials: true,
          }
        );

        const data = res.data.map((s: any) => ({
          id: s.id_student,
          name: s.nombre_completo,
          curso: s.cursos || "Sin curso",
          promedio: Number(s.promedio_asistencia) || 0,
          estado:
            s.estado_cobro === 1
              ? "Pagado"
              : s.estado_cobro === 2
                ? "Pendiente"
                : s.estado_cobro === 3
                  ? "No aplica"
                  : s.estado_cobro === 4
                    ? "Exento"
                    : "Desconocido",


        }));

        setEstudiantes(data);
      } catch (error) {
        console.error("Error al obtener estudiantes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEstudiantes();
  }, []);


  // 🔹 filtros

  const cursos = Array.from(
    new Set(estudiantes.map((e) => e.curso))
  );

  const filteredEstudiantes = estudiantes.filter((est) => {

    const matchesSearch =
      est.name?.toLowerCase().includes(search.toLowerCase()) ||
      est.id?.toString().includes(search);

    const matchesCurso = filterCurso ? est.curso === filterCurso : true;

    return matchesSearch && matchesCurso;
  });
  const paginatedEstudiantes = filteredEstudiantes.slice(startIndex, endIndex);

  return (
    <div className="animate-fade-in">
      {/* Header */}<div
        className="admin-page-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1 className="page-title">Gestión de Estudiantes</h1>
          <p className="page-subtitle">
            Administra los perfiles, historial y estado de pagos de todos los estudiantes.
          </p>
        </div>
        <button className="btn btn-primary" style={{ alignItems: "center", alignContent: "right" }}>
          <UserPlus size={18} />
          Nuevo Estudiante
        </button>
      </div>

      {/* Filtros */}
      <div className="card" style={{ marginBottom: "2rem" }}>
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
              {cursos.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="table-container">
        {loading ? (
          <p>Cargando estudiantes...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre del Estudiante</th>
                <th>Promedio de Asistencias</th>
                <th>Curso</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {paginatedEstudiantes.map((est) => (
                <tr key={est.id}>
                  <td style={{ fontWeight: 500 }}>{est.id}</td>
                  <td>{est.name}</td>
                  <td>
                    <span
                      className={`badge ${est.promedio < 60
                        ? "badge-error"
                        : est.promedio < 80
                          ? "badge-warning"
                          : "badge-success"
                        }`}
                    >
                      {(est.promedio).toFixed(0)}%
                    </span>
                  </td>
                  <td>{est.curso}</td>
                  <td>
                    <span
                      className={`badge ${est.estado === "Activo"
                        ? "badge-success"
                        : "badge-neutral"
                        }`}
                    >
                      {est.estado}
                    </span>
                  </td>
                  <td>
                    <Link
                      href={`/admin/estudiantes/${est.id}`}
                      className="btn btn-ghost action-link"
                    >
                      <Eye size={18} />
                      Ver Detalle
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
        <button
          className="btn"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Anterior
        </button>

        <span>Página {page}</span>

        <button
          className="btn"
          disabled={endIndex >= filteredEstudiantes.length}
          onClick={() => setPage(page + 1)}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}