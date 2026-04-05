"use client";

import { useEffect, useState } from "react";
import ProfessorCourseCard from "@/components/ui/ProfessorCourseCard";
import axios from "axios";

export default function ProfesorDashboard() {
  const [cursos, setCursos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/professors/my-courses/`,
          {
            withCredentials: true, // ✅ importante para cookies
          }
        );

        const data = response.data.map((c: any) => ({
          id: c.id_course,
          code: c.course_code,
          nombre: c.nombre,
          estudiantes: c.students_count,
          icon: c.icon || "bg-blue-100 text-blue-600",
        }));

        setCursos(data);
      } catch (error) {
        console.error("Error al obtener cursos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCursos();
  }, []);

  return (
    <div className="animate-fade-in">
      <h1 className="page-title">Bienvenido, Profesor</h1>
      <p className="page-subtitle">
        Aquí está el resumen de tus cursos asignados para el ciclo actual.
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "1.5rem",
        }}
      >
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600, margin: 0 }}>
          Mis Cursos
        </h2>
        <button className="btn btn-ghost" style={{ fontSize: "0.875rem" }}>
          Ver todos
        </button>
      </div>

      {loading ? (
        <p>Cargando cursos...</p>
      ) : (
        <div className="course-grid">
          {cursos.map((curso) => (
            <ProfessorCourseCard key={curso.id} {...curso} />
          ))}
        </div>
      )}
    </div>
  );
}