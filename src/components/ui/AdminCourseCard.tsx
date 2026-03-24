import React from 'react';
import { BookOpen, Edit2, User, Users } from 'lucide-react';
import styles from './AdminCourseCard.module.css';

interface AdminCourseCardProps {
  id: string;
  nombre: string;
  grado: string;
  profesor: string;
  estudiantes: number;
}

export default function AdminCourseCard({ nombre, grado, profesor, estudiantes }: AdminCourseCardProps) {
  return (
    <div className={`card ${styles.card}`}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>{nombre}</h3>
          <span className="badge badge-neutral">{grado}</span>
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
