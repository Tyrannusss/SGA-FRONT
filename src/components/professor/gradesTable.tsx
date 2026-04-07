"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Student {
    id_student: number;
    primer_nombre: string;
    segundo_nombre: string;
    primer_apellido: string;
    segundo_apellido: string;
}

interface Evaluation {
    id: string;
    title: string;
    date: string;
}

export default function GradesTable({ courseId }: { courseId: number }) {
    const [students, setStudents] = useState<Student[]>([]);
    const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
    const [grades, setGrades] = useState<Record<number, Record<string, string>>>({});
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState(false);
    const [newEvaluation, setNewEvaluation] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const gradesRes = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/grades/by-course/${courseId}`,
                    { withCredentials: true }
                );

                const data = gradesRes.data;

                const evalSet = new Set<string>();
                const initialGrades: Record<number, Record<string, string>> = {};

                data.forEach((student: any) => {
                    initialGrades[student.student_id] = {};

                    student.evaluaciones.forEach((ev: any) => {
                        initialGrades[student.student_id][ev.tipo] =
                            ev.calificacion?.toString() || "";
                        evalSet.add(ev.tipo);
                    });
                });

                const evaluationsArray: Evaluation[] = Array.from(evalSet).map((ev) => ({
                    id: ev,
                    title: ev,
                    date: "",
                }));

                setEvaluations(evaluationsArray);
                setGrades(initialGrades);

                // 2. Students (para nombres)
                const studentsRes = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/students/by-course/${courseId}`,
                    { withCredentials: true }
                );

                setStudents(studentsRes.data);

            } catch (error) {
                console.error("Error al cargar datos", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [courseId]);

    const handleAddEvaluation = () => {
        if (!newEvaluation.trim()) return;

        const evId = newEvaluation.trim();

        const newEv: Evaluation = {
            id: evId,
            title: evId,
            date: new Date().toISOString().split("T")[0],
        };

        // agregar a columnas
        setEvaluations((prev) => [...prev, newEv]);

        // inicializar en cada estudiante
        setGrades((prev) => {
            const updated = { ...prev };

            Object.keys(updated).forEach((studentId) => {
                updated[Number(studentId)][evId] = "";
            });

            return updated;
        });

        setNewEvaluation("");
    };

    const handleChange = (studentId: number, evId: string, value: string) => {
        setGrades((prev) => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                [evId]: value,
            },
        }));
    };

    // Save
    const handleSave = async () => {
        try {
            const payload = {
                courseId,
                fecha: new Date().toISOString().split("T")[0],
                grades: Object.entries(grades).flatMap(([studentId, evs]) =>
                    Object.entries(evs).map(([evName, value]) => ({
                        student_id: Number(studentId),
                        tipo_evaluacion: evName,
                        calificacion: Number(value) || 0,
                    }))
                ),
            };

            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/grades`,
                payload,
                { withCredentials: true }
            );

            alert(res.data.message);

            setSaved(true);
            setTimeout(() => setSaved(false), 2000);

        } catch (error) {
            console.error("Error al guardar calificaciones", error);
        }
    };

    const getFullName = (s: Student) =>
        `${s.primer_nombre} ${s.segundo_nombre || ""} ${s.primer_apellido} ${s.segundo_apellido}`.trim();

    if (loading) return <p>Cargando calificaciones...</p>;

    return (
        <div>
            {/* HEADER */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                <h2 style={{ fontSize: "1.125rem", fontWeight: 600 }}>
                    Registro de Calificaciones
                </h2>

                <button className="btn btn-primary" onClick={handleSave}>
                    {saved ? "Guardado" : "Guardar"}
                </button>
            </div>

            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                <input
                    type="text"
                    placeholder="Nombre de evaluación (Ej: Parcial 1)"
                    value={newEvaluation}
                    onChange={(e) => setNewEvaluation(e.target.value)}
                    className="input"
                />

                <button className="btn btn-outline" onClick={handleAddEvaluation}>
                    + Agregar evaluación
                </button>
            </div>

            {/* TABLE */}
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Estudiante</th>

                            {evaluations.map((ev) => (
                                <th key={ev.id}>
                                    {ev.title}
                                </th>
                            ))}

                            <th>Promedio</th>
                        </tr>
                    </thead>

                    <tbody>
                        {students.map((student) => {
                            const studentGrades = grades[student.id_student] || {};

                            const values = Object.values(studentGrades)
                                .map((v) => Number(v))
                                .filter((v) => !isNaN(v));

                            const avg =
                                values.length > 0
                                    ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)
                                    : "-";

                            return (
                                <tr key={student.id_student}>
                                    <td>{getFullName(student)}</td>

                                    {evaluations.map((ev) => (
                                        <td key={ev.id}>
                                            <input
                                                type="number"
                                                className="input"
                                                value={studentGrades[ev.id] || ""}
                                                onChange={(e) =>
                                                    handleChange(
                                                        student.id_student,
                                                        ev.id,
                                                        e.target.value
                                                    )
                                                }
                                                min="0"
                                                max="10"
                                                step="0.1"
                                                style={{ width: "80px", textAlign: "center" }}
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
    );
}