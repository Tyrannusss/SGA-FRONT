"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Student {
    id_student: number;
    primer_nombre: string;
    segundo_nombre: string;
    primer_apellido: string;
    segundo_apellido: string;
    course_id: number;
    promedio_general: number | null;
}
export default function StudentsTable({ courseId }: { courseId: number }) {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/students/by-course/${courseId}`, {
                    withCredentials: true,
                });
                setStudents(res.data);
            } catch (error) {
                console.error("Error al obtener estudiantes", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [courseId]);

    const getFullName = (s: Student) => {
        return `${s.primer_nombre} ${s.segundo_nombre || ""} ${s.primer_apellido} ${s.segundo_apellido}`.trim();
    };

    if (loading) return <p>Cargando estudiantes...</p>;

    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Promedio Actual</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => {
                        const promedio = Number(student.promedio_general) || 0;

                        return (
                            <tr key={student.id_student}>
                                <td style={{ fontWeight: 500 }}>{student.id_student}</td>

                                <td>{getFullName(student)}</td>

                                <td>{promedio.toFixed(1)}</td>

                                <td>
                                    {promedio >= 7 ? (
                                        <span className="badge badge-success">Regular</span>
                                    ) : (
                                        <span className="badge badge-warning">Riesgo</span>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}