"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import axios from "axios";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        withCredentials: true,
      });

      setUser(res.data);
    };

    fetchUser();
  }, []);

  if (!user) return null; // o loader

  return (
    <div className="app-layout">
      <Navbar
        role="admin"
        user={{
          primer_nombre: user.primer_nombre,
          primer_apellido: user.primer_apellido,
        }}
      />
      <div className="app-main">
        <main className="app-content">{children}</main>
      </div>
    </div>
  );
}