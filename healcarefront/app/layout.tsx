import type { ReactNode } from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ActiveNotificationToast from "@/components/notifications/ActiveNotificationToast";

export const metadata: Metadata = {
  title: "HealthCare - Sistema de Seguimiento de Hábitos",
  description: "Aplicación para el seguimiento de hábitos saludables con integración de Alexa",
  generator: 'HealthCare App',
}

const inter = Inter({ subsets: ["latin"] }) // If you want to use this, apply it to <body> className

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  let usuarioId = 1;
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("currentUser");
    if (user) usuarioId = JSON.parse(user).id;
  }

  const hideNotification =
    pathname === "/auth/login" || pathname === "/auth/register";

  return (
    <html lang="es">
      <body className={inter.className}>
        {!hideNotification && <ActiveNotificationToast usuarioId={usuarioId} />}
        {children}
      </body>
    </html>
  );
}