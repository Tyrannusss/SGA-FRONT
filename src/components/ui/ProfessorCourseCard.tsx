import React from 'react';
import Link from 'next/link';
import { BookOpen, Users, Calendar, ArrowRight } from 'lucide-react';
import styles from './ProfessorCourseCard.module.css';

interface ProfessorCourseCardProps {
  id: string;
  nombre: string;
  code: string;
  estudiantes: number;

}

export default function ProfessorCourseCard({ id, nombre, code, estudiantes }: ProfessorCourseCardProps) {
  return (
    <div className={`card ${styles.courseCard}`}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>{nombre}</h3>
          <span className="badge badge-neutral">{code}</span>
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
      </div>

      <div className={styles.action}>
        <Link href={`/profesor/curso/${id}`} className={`btn ${styles.btn}`}>
          Gestionar Curso
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
