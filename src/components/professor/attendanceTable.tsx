"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type AttendanceStatus = "Presente" | "Ausente" | "Notificado";

interface Student {
    id_student: number;
    primer_nombre: string;
    segundo_nombre: string;
    primer_apellido: string;
    segundo_apellido: string;
}

export default function AttendanceTable({ courseId }: { courseId: number }) {
    const [students, setStudents] = useState<Student[]>([]);
    const [attendance, setAttendance] = useState<Record<number, AttendanceStatus>>({});
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState(false);
    const [date, setDate] = useState(() =>
        new Date().toISOString().split("T")[0]
    );

    // 🔥 obtener estudiantes del curso
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/students/by-course/${courseId}`,
                    { withCredentials: true }
                );

                setStudents(res.data);

                // inicializar asistencia en "Presente"
                const initialAttendance: Record<number, AttendanceStatus> = {};
                res.data.forEach((s: Student) => {
                    initialAttendance[s.id_student] = "Presente";
                });

                setAttendance(initialAttendance);
            } catch (error) {
                console.error("Error al obtener estudiantes", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [courseId]);

    // 🔄 cambiar estado
    const toggleAttendance = (studentId: number) => {
        setAttendance((prev) => {
            const current = prev[studentId];
            let next: AttendanceStatus = "Presente";

            if (current === "Presente") next = "Ausente";
            else if (current === "Ausente") next = "Notificado";

            return { ...prev, [studentId]: next };
        });
    };

    // 💾 guardar asistencia
    const handleSave = async () => {
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/attendance`,
                {
                    courseId,
                    fecha: date,
                    attendance: Object.entries(attendance).map(([studentId, status]) => ({
                        student_id: Number(studentId),
                        status,
                    })),
                },
                { withCredentials: true }
            );

            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (error) {
            console.error("Error al guardar asistencia", error);
        }
    };

    const getFullName = (s: Student) =>
        `${s.primer_nombre} ${s.segundo_nombre || ""} ${s.primer_apellido} ${s.segundo_apellido}`.trim();

    if (loading) return <p>Cargando asistencia...</p>;

    return (
        <div>
            {/* Header */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1.5rem",
                }}
            >
                <div>
                    <h2 style={{ fontSize: "1.125rem", fontWeight: 600 }}>
                        Registro de Asistencia
                    </h2>

                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        style={{
                            marginTop: "0.5rem",
                            padding: "0.25rem",
                            borderRadius: "6px",
                        }}
                    />
                </div>

                <button className="btn btn-primary" onClick={handleSave}>
                    {saved ? "Guardado" : "Guardar"}
                </button>
            </div>

            {/* Tabla */}
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Estudiante</th>
                            <th style={{ textAlign: "center" }}>Asistencia</th>
                        </tr>
                    </thead>

                    <tbody>
                        {students.map((student) => {
                            const status = attendance[student.id_student];

                            return (
                                <tr key={student.id_student}>
                                    <td>{getFullName(student)}</td>

                                    <td style={{ textAlign: "center" }}>
                                        <button
                                            onClick={() => toggleAttendance(student.id_student)}
                                            style={{
                                                padding: "0.5rem 1rem",
                                                borderRadius: "999px",
                                                fontWeight: 600,
                                                background:
                                                    status === "Presente"
                                                        ? "var(--success-bg)"
                                                        : status === "Ausente"
                                                            ? "var(--danger-bg)"
                                                            : "var(--warning-bg)",
                                                color:
                                                    status === "Presente"
                                                        ? "var(--success)"
                                                        : status === "Ausente"
                                                            ? "var(--danger)"
                                                            : "var(--warning)",
                                            }}
                                        >
                                            {status}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}