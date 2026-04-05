"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "./lib/axios";
import styles from "./login.module.css";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { access_token } = response.data;


      document.cookie = `token=${access_token}; path=/; SameSite=Strict`;


      const payload: any = jwtDecode(access_token);

      const role = Number(payload.role);
      if (role === 3) {
        router.push("/admin");
      } else if (role === 2) {
        router.push("/profesor");
      } else {
        router.push("/");
      }

    } catch (error: any) {
      console.error(error);

      if (error.response) {
        alert(error.response.data.message || "Credenciales incorrectas");
      } else {
        alert("Error de conexión con el servidor");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <main className={styles.loginCard}>

        <div className={styles.header}>
          <h1 className={styles.title}>SGA</h1>
          <p className={styles.subtitle}>
            Ingresa tus credenciales para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          <div className={styles.formGroup}>
            <input
              type="email"
              id="email"
              className={styles.input}
              placeholder="correo@instituto.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="email" className={styles.label}>
              Correo Electrónico
            </label>
          </div>

          <div className={styles.formGroup}>
            <input
              type="password"
              id="password"
              className={styles.input}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label htmlFor="password" className={styles.label}>
              Contraseña
            </label>
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? "Cargando..." : "Iniciar Sesión"}
          </button>

        </form>
      </main>
    </div>
  );
}