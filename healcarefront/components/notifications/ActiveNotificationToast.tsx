"use client"
import { useEffect, useRef, useState } from "react";
import { Toaster, toast } from "sonner"; // Instala con: npm install sonner

type Notificacion = {
  id: number;
  titulo: string;
  mensaje: string;
  enviadaEn: string;
};

interface Props {
  usuarioId: number;
}

export default function ActiveNotificationToast({ usuarioId }: Props) {
  const [lastId, setLastId] = useState<number | null>(null);
  const polling = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/notificaciones/activas/${usuarioId}`);
        const data: Notificacion[] = await res.json();
        if (data.length > 0 && data[0].id !== lastId) {
          toast(`${data[0].titulo}: ${data[0].mensaje}`);
          setLastId(data[0].id);
        }
      } catch (e) {
        // Silenciar error de red
      }
    };
    fetchNotifications();
    polling.current = setInterval(fetchNotifications, 15000);
    return () => polling.current && clearInterval(polling.current);
  }, [usuarioId, lastId]);

  return <Toaster position="top-right" />;
}