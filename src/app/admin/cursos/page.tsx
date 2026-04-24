"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Plus } from "lucide-react";
import AdminCourseCard from "@/components/ui/AdminCourseCard";

export default function GestionCursos() {
  const [cursos, setCursos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔍 búsqueda
  const [search, setSearch] = useState("");

  // 🎯 filtro estado
  const [filtroEstado, setFiltroEstado] = useState("todos"); // todos | activos | inactivos

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/courses`,
          { withCredentials: true }
        );

        setCursos(res.data);
      } catch (error) {
        console.error("Error cargando cursos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCursos();
  }, []);

  // 🧠 FILTRO COMBINADO
  const cursosFiltrados = cursos.filter((curso) => {
    const texto = search.toLowerCase();

    const coincideBusqueda =
      curso.nombre?.toLowerCase().includes(texto) ||
      curso.profesor?.toLowerCase().includes(texto) ||
      curso.grado?.toLowerCase().includes(texto);

    let coincideEstado = true;

    if (filtroEstado === "activos") {
      coincideEstado = curso.activo === true;
    } else if (filtroEstado === "inactivos") {
      coincideEstado = curso.activo === false;
    }

    return coincideBusqueda && coincideEstado;
  });

  return (
    <div className="animate-fade-in">
      {/* HEADER */}
      <div
        className="admin-page-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1 className="page-title">Gestión de Cursos</h1>
          <p className="page-subtitle">
            Crea, edita y asigna profesores a los cursos académicos.
          </p>
        </div>

        <button className="btn btn-primary">
          <Plus size={18} />
          Crear Curso
        </button>
      </div>

      {/* 🔍 FILTROS */}
      <div className="flex flex-col md:flex-row gap-3 my-4">
        {/* BUSCADOR */}
        <input
          type="text"
          placeholder="Buscar por nombre, profesor o código..."
          className="input w-full md:w-1/2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* FILTRO ESTADO */}
        <select
          className="input w-full md:w-1/4"
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="todos">Todos</option>
          <option value="activos">Activos</option>
          <option value="inactivos">Inactivos</option>
        </select>
      </div>

      {/* 🔄 LOADING */}
      {loading ? (
        <p>Cargando cursos...</p>
      ) : (
        <>
          {/* ❌ SIN RESULTADOS */}
          {cursosFiltrados.length === 0 ? (
            <p className="text-gray-500 mt-4">
              No se encontraron cursos.
            </p>
          ) : (
            <div className="course-grid">
              {cursosFiltrados.map((curso) => (
                <AdminCourseCard
                  key={curso.id}
                  id={curso.id}
                  nombre={curso.nombre || "Sin nombre"}
                  grado={curso.grado}
                  profesor={curso.profesor || "Sin asignar"}
                  estudiantes={curso.estudiantes}
                  activo={curso.activo}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}