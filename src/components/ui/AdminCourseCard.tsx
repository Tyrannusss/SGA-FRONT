import React from 'react';
import { BookOpen, Edit2, User, Users } from 'lucide-react';
import styles from './AdminCourseCard.module.css';

interface AdminCourseCardProps {
  id: string;
  nombre: string;
  grado: string;
  profesor: string;
  estudiantes: number;
  activo: boolean;
}

export default function AdminCourseCard({ nombre, grado, profesor, estudiantes, activo }: AdminCourseCardProps) {
  return (
    <div className={`card ${styles.card}`}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>{nombre}</h3>

          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <span className="badge badge-neutral">{grado}</span>

            <span
              className={`badge ${activo ? "badge-success" : "badge-error"
                }`}
            >
              {activo ? "Activo" : "Inactivo"}
            </span>
          </div>
        </div>

        <div className={styles.iconWrapper}>
          <BookOpen size={20} />
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <Users size={16} />
          <span>{estudiantes} alumnos</span>
        </div>
        <div className={styles.statItem}>
          <User size={16} />
          <span>{profesor}</span>
        </div>
      </div>

      <div className={styles.action}>
        <button className={`btn ${styles.btn}`}>
          <Edit2 size={16} /> Editar Curso
        </button>
      </div>
    </div>
  );
}
