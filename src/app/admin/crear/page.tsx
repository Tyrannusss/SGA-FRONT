"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ArrowLeft, Save, User, Mail, Phone, Hash, Calendar, DollarSign, CreditCard, Percent, BellOff, Briefcase, LinkIcon } from "lucide-react";

export default function CrearUsuario() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    // User Base
    role: "", // 1 estudiante, 2 profesor, 3 admin
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    cedula: "", // Map from user typing 'identificacion'
    email: "",
    email_secundario: "",
    telefono: "",
    password_hash: "",

    // Estudiante
    mes_matricula: "",
    fecha_pago_dia: "",
    mensualidad_base: "",
    tasa_iva: "",
    total_mensual: "",
    fecha_inicio: "",
    no_contactar: false,
    correo_teams: "",

    // Profesor
    fecha_entrada: "",
    encuesta_url: "",
    correo_institucional: "",
    puesto_id: "",
    area_id: "",
    estado_laboral_id: "",
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // cálculo automático estudiante
  useEffect(() => {
    if (formData.role !== "1") return;
    const base = parseFloat(formData.mensualidad_base);
    const iva = parseFloat(formData.tasa_iva);

    if (!isNaN(base) && !isNaN(iva)) {
      setFormData((prev) => ({
        ...prev,
        total_mensual: (base * (1 + iva)).toFixed(2),
      }));
    }
  }, [formData.mensualidad_base, formData.tasa_iva, formData.role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!formData.role) {
      setError("Debes seleccionar un rol para el usuario.");
      setLoading(false);
      return;
    }

    try {
      let endpoint = "";
      let payload: any = {};

      const basePayload = {
        primer_nombre: formData.primer_nombre,
        segundo_nombre: formData.segundo_nombre || undefined,
        primer_apellido: formData.primer_apellido,
        segundo_apellido: formData.segundo_apellido || undefined,
        cedula: formData.cedula,
        email: formData.email,
        email_secundario: formData.email_secundario || undefined,
        telefono: formData.telefono || undefined,
        password_hash: formData.password_hash || "default123",
      };

      if (formData.role === "1") {
        endpoint = `${process.env.NEXT_PUBLIC_API_URL}/students`;

        payload = {
          ...basePayload,
          mes_matricula: formData.mes_matricula || undefined,
          fecha_pago_dia: formData.fecha_pago_dia
            ? parseInt(formData.fecha_pago_dia)
            : undefined,
          mensualidad_base: formData.mensualidad_base
            ? parseFloat(formData.mensualidad_base)
            : undefined,
          tasa_iva: formData.tasa_iva
            ? parseFloat(formData.tasa_iva)
            : 0.19,
          fecha_inicio: formData.fecha_inicio || undefined,
          fecha_salida: undefined,
          no_contactar: formData.no_contactar,
          correo_teams: formData.correo_teams || undefined,
        };

        setSuccess("Estudiante creado con éxito");
      }

      if (formData.role === "2") {
        endpoint = `${process.env.NEXT_PUBLIC_API_URL}/professors`;

        payload = {
          ...basePayload,
          fecha_entrada: formData.fecha_entrada || undefined,
          correo_institucional: formData.correo_institucional || undefined,
          encuesta_url: formData.encuesta_url || undefined,
          puesto_id: parseInt(formData.puesto_id),
          area_id: parseInt(formData.area_id),
          estado_laboral_id: parseInt(formData.estado_laboral_id),
        };

        setSuccess("Profesor creado con éxito");
      }

      await axios.post(endpoint, payload, {
        withCredentials: true,
      });

      // ❌ NO redirigir si quieres quedarte en la vista
      // router.push("/admin/estudiantes");

    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        "Error al crear el usuario. Revisa los datos."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto pb-12 px-4 pt-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin/estudiantes" className="btn btn-ghost inline-flex items-center gap-2 hover:-translate-x-1 transition-transform">
            <ArrowLeft size={18} />
            Volver
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100 mt-2">
            Nuevo Usuario
          </h1>
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            form="studentForm"
            className="btn btn-primary"
            disabled={loading}
          >
            <Save size={18} />
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 shadow-sm flex items-center gap-3 animate-fade-in">
          <div className="font-semibold text-lg">Error:</div>
          <div>{error}</div>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-md mb-6 shadow-sm flex items-center gap-3 animate-fade-in">
          <div className="font-semibold text-lg">✔</div>
          <div>{success}</div>
        </div>
      )}
      {/* CONTENEDOR PRINCIPAL */}
      <div className="card shadow-md border-t-4 border-t-primary p-6 md:p-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <form id="studentForm" onSubmit={handleSubmit} className="space-y-8">

          {/* SELECCIÓN DE ROL */}
          <div className="pb-6 border-b border-slate-100 dark:border-slate-800">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Selecciona el Rol del Usuario <span className="text-red-500">*</span>
            </label>
            <select className="input focus:border-primary text-lg p-3 bg-slate-50 dark:bg-slate-800 shadow-inner" name="role" value={formData.role} onChange={handleChange} required>
              <option value="">-- Elige un Rol --</option>
              <option value="1">Estudiante</option>
              <option value="2">Profesor</option>
            </select>
          </div>

          {/* SECCIÓN 1: DATOS PERSONALES BASE */}
          <div>
            <div className="flex items-center gap-2 mb-5 pb-2 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Datos Personales</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <User size={15} className="text-slate-400" />
                  Primer Nombre <span className="text-red-500">*</span>
                </label>
                <input className="input focus:border-primary" name="primer_nombre" placeholder="Ej. Juan" value={formData.primer_nombre} onChange={handleChange} required />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <User size={15} className="text-slate-400 opacity-60" />
                  Segundo Nombre
                </label>
                <input className="input focus:border-primary" name="segundo_nombre" placeholder="Ej. Carlos" value={formData.segundo_nombre} onChange={handleChange} />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <User size={15} className="text-slate-400" />
                  Primer Apellido <span className="text-red-500">*</span>
                </label>
                <input className="input focus:border-primary" name="primer_apellido" placeholder="Ej. Pérez" value={formData.primer_apellido} onChange={handleChange} required />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <User size={15} className="text-slate-400 opacity-60" />
                  Segundo Apellido
                </label>
                <input className="input focus:border-primary" name="segundo_apellido" placeholder="Opcional" value={formData.segundo_apellido} onChange={handleChange} />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <Hash size={15} className="text-slate-400" />
                  Cédula <span className="text-red-500">*</span>
                </label>
                <input className="input focus:border-primary" name="cedula" placeholder="Ej. 12345678-9" value={formData.cedula} onChange={handleChange} required />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <Phone size={15} className="text-slate-400" />
                  Teléfono
                </label>
                <input className="input focus:border-primary" name="telefono" placeholder="+56 9 1234 5678" value={formData.telefono} onChange={handleChange} />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <Mail size={15} className="text-slate-400" />
                  Correo Principal <span className="text-red-500">*</span>
                </label>
                <input className="input focus:border-primary" type="email" name="email" placeholder="juan@ejemplo.com" value={formData.email} onChange={handleChange} required />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <Mail size={15} className="text-slate-400 opacity-60" />
                  Correo Secundario
                </label>
                <input className="input focus:border-primary" type="email" name="email_secundario" placeholder="Opcional" value={formData.email_secundario} onChange={handleChange} />
              </div>

              {formData.role === "1" && (
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <User size={15} className="text-slate-400 opacity-60" />
                    Correo Teams
                  </label>
                  <input className="input focus:border-primary" type="email" name="correo_teams" placeholder="usuario@teams.com" value={formData.correo_teams} onChange={handleChange} />
                </div>
              )}
            </div>

            {formData.role === "1" && (
              <div className="mt-4">
                <label className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-slate-800/30 cursor-pointer hover:bg-slate-100 transition-colors w-fit">
                  <input type="checkbox" name="no_contactar" checked={formData.no_contactar} onChange={handleChange} className="w-4 h-4 accent-primary cursor-pointer" />
                  <span className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                    <BellOff size={15} className="text-slate-500" /> No contactar
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* SECCIÓN 2: ESTUDIANTE (Finanzas y Matrícula) */}
          {formData.role === "1" && (
            <div className="animate-fade-in pt-4">
              <div className="flex items-center gap-2 mb-5 pb-2 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Detalles de Matrícula y Finanzas</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <Calendar size={15} className="text-slate-400" />
                    Fecha de Inicio
                  </label>
                  <input className="input focus:border-primary" type="date" name="fecha_inicio" value={formData.fecha_inicio} onChange={handleChange} />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <Calendar size={15} className="text-slate-400" />
                    Mes Matrícula
                  </label>
                  <input className="input focus:border-primary" name="mes_matricula" placeholder="Ej. Marzo" value={formData.mes_matricula} onChange={handleChange} />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <Calendar size={15} className="text-slate-400" />
                    Día de Pago
                  </label>
                  <input className="input focus:border-primary" type="number" name="fecha_pago_dia" placeholder="1-31" min="1" max="31" value={formData.fecha_pago_dia} onChange={handleChange} />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <DollarSign size={15} className="text-slate-400" />
                    Base
                  </label>
                  <input className="input focus:border-primary" type="number" step="0.01" name="mensualidad_base" placeholder="0.00" value={formData.mensualidad_base} onChange={handleChange} />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <Percent size={15} className="text-slate-400" />
                    IVA
                  </label>
                  <input className="input focus:border-primary" type="number" step="0.0001" name="tasa_iva" placeholder="0.19" value={formData.tasa_iva || "0.19"} onChange={handleChange} />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-bold text-primary">
                    <CreditCard size={15} />
                    Total Mensual
                  </label>
                  <input
                    className="input bg-primary/5 border-primary/20 text-primary font-bold focus:border-primary"
                    type="text"
                    name="total_mensual"
                    placeholder="$ 0.00"
                    value={formData.total_mensual ? `$ ${formData.total_mensual}` : ""}
                    readOnly
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECCIÓN 2: PROFESOR (Detalles Laborales) */}
          {formData.role === "2" && (
            <div className="animate-fade-in pt-4">
              <div className="flex items-center gap-2 mb-5 pb-2 border-b border-slate-100 dark:border-slate-800">
                <Briefcase size={20} className="text-primary" />
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Detalles Profesionales y Laborales</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <Calendar size={15} className="text-slate-400" />
                    Fecha de Entrada
                  </label>
                  <input className="input focus:border-primary" type="date" name="fecha_entrada" value={formData.fecha_entrada} onChange={handleChange} />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <Mail size={15} className="text-slate-400" />
                    Correo Institucional
                  </label>
                  <input className="input focus:border-primary" type="email" name="correo_institucional" placeholder="profesor@institucion.com" value={formData.correo_institucional} onChange={handleChange} />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <Briefcase size={15} className="text-slate-400" />
                    Puesto <span className="text-red-500">*</span>
                  </label>
                  <select className="input focus:border-primary bg-white dark:bg-slate-900" name="puesto_id" value={formData.puesto_id} onChange={handleChange} required>
                    <option value="">-- Seleccionar Puesto --</option>
                    <option value="1">Director Académico</option>
                    <option value="2">Instructor</option>
                    <option value="3">Gerente</option>
                    <option value="4">Administrativo</option>
                    <option value="5">Miscelánea</option>
                    <option value="6">Ventas</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <Briefcase size={15} className="text-slate-400" />
                    Área <span className="text-red-500">*</span>
                  </label>
                  <select className="input focus:border-primary bg-white dark:bg-slate-900" name="area_id" value={formData.area_id} onChange={handleChange} required>
                    <option value="">-- Seleccionar Área --</option>
                    <option value="1">Inglés</option>
                    <option value="2">Administración</option>
                    <option value="3">Sin área</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <Briefcase size={15} className="text-slate-400" />
                    Estado Laboral <span className="text-red-500">*</span>
                  </label>
                  <select className="input focus:border-primary bg-white dark:bg-slate-900" name="estado_laboral_id" value={formData.estado_laboral_id} onChange={handleChange} required>
                    <option value="">-- Seleccionar Estado --</option>
                    <option value="1">Planilla</option>
                    <option value="2">Renuncia</option>
                    <option value="3">Servicios Profesionales</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <LinkIcon size={15} className="text-slate-400" />
                    Enlace de Encuesta
                  </label>
                  <input className="input focus:border-primary" type="url" name="encuesta_url" placeholder="https://..." value={formData.encuesta_url} onChange={handleChange} />
                </div>

              </div>
            </div>
          )}

        </form>
      </div>
    </div>
  );
}