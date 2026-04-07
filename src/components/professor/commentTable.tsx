"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { MessageSquare } from "lucide-react";

interface Student {
    id_student: number;
    primer_nombre: string;
    segundo_nombre: string;
    primer_apellido: string;
    segundo_apellido: string;
}

interface Comment {
    id: number;
    texto: string;
    created_at: string;
    student: {
        id_student: number;
    };
    professor: {
        name: string;
    };
}

interface Props {
    courseId: number;
}

export default function CommentsTable({ courseId }: Props) {
    const [students, setStudents] = useState<Student[]>([]);
    const [comments, setComments] = useState<Record<number, Comment[]>>({});
    const [newComment, setNewComment] = useState<Record<number, string>>({});

    // ✅ traer estudiantes
    const fetchStudents = async () => {
        const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/students/by-course/${courseId}`,
            { withCredentials: true }
        );
        setStudents(res.data);
    };

    // ✅ traer comentarios
    const fetchComments = async () => {
        const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/comments/course/${courseId}`,
            { withCredentials: true }
        );

        const grouped: Record<number, Comment[]> = {};

        res.data.forEach((c: Comment) => {
            const studentId = c.student.id_student;
            if (!grouped[studentId]) grouped[studentId] = [];
            grouped[studentId].push(c);
        });

        setComments(grouped);
    };

    useEffect(() => {
        if (courseId) {
            fetchStudents();
            fetchComments();
        }
    }, [courseId]);

    const getFullName = (s: Student) =>
        `${s.primer_nombre} ${s.segundo_nombre || ""} ${s.primer_apellido} ${s.segundo_apellido}`.trim();

    // ✅ crear comentario
    const handleAddComment = async (studentId: number) => {
        const text = newComment[studentId];

        if (!text?.trim()) return;

        await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/comments`,
            {
                texto: text,
                student_id: studentId,
                course_id: courseId,
            },
            { withCredentials: true }
        );

        setNewComment((prev) => ({ ...prev, [studentId]: "" }));
        fetchComments();
    };

    return (
        <div>
            <h2 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "1.5rem" }}>
                Comentarios Docentes
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                {students.map((student) => (
                    <div
                        key={student.id_student}
                        style={{
                            border: "1px solid var(--border)",
                            borderRadius: "var(--radius-md)",
                            padding: "1.5rem",
                        }}
                    >
                        <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1rem" }}>
                            {getFullName(student)}
                        </h3>

                        {/* comentarios */}
                        {comments[student.id_student]?.length > 0 ? (
                            <div style={{ marginBottom: "1rem" }}>
                                {comments[student.id_student].map((comment) => (
                                    < div
                                        key={comment.id}
                                        style={{
                                            background: "var(--surface-hover)",
                                            padding: "0.75rem",
                                            borderRadius: "var(--radius-md)",
                                            marginBottom: "0.5rem",
                                            fontSize: "0.875rem",
                                        }}
                                    >
                                        <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                                            <MessageSquare size={14} />{" "}
                                            {new Date(comment.created_at).toLocaleDateString()}
                                        </div>
                                        {comment.texto}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ fontSize: "0.875rem", color: "var(--muted)" }}>
                                No hay comentarios.
                            </p>
                        )}

                        {/* input */}
                        <div style={{ display: "flex", gap: "1rem" }}>
                            <input
                                className="input"
                                placeholder="Escribir comentario..."
                                value={newComment[student.id_student] || ""}
                                onChange={(e) =>
                                    setNewComment((prev) => ({
                                        ...prev,
                                        [student.id_student]: e.target.value,
                                    }))
                                }
                            />

                            <button
                                className="btn btn-primary"
                                onClick={() => handleAddComment(student.id_student)}
                            >
                                Agregar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div >
    );
}