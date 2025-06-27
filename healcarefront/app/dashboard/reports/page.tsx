"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Heart, LogOut, FileText, Download, Calendar, BarChart3, TrendingUp } from "lucide-react"
import Link from "next/link"
import { estadisticasAPI, habitoAPI, registroAPI } from "@/lib/api"
import type { Usuario } from "@/lib/api"
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { exportHtmlToPdf } from "@/lib/exportHtmlToPdf";
import { useHealthcare } from "@/hooks/useHealthcare";

export default function ReportsPage() {
  const router = useRouter()
  const { habitos, registros, estadisticas, progresoSemanal, progresoMensual, datosCategorias, loading } = useHealthcare();
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null)
  const [period, setPeriod] = useState<string>("semanal");

  useEffect(() => {
    const user = localStorage.getItem("currentUser")
    if (!user) {
      router.push("/auth/login")
      return
    }
    setCurrentUser(JSON.parse(user))
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  // Generar y descargar reporte PDF usando el HTML real
  const handleGenerateReport = async () => {
    setTimeout(() => {
      exportHtmlToPdf("report-html", `reporte-healthcare-${period}-${new Date().toISOString().split("T")[0]}.pdf`);
    }, 500);
  }

  if (!currentUser || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver al Dashboard
                </Button>
              </Link>
              <Heart className="h-6 w-6 text-blue-600 mx-4" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Generar Reportes</h1>
                <p className="text-gray-600">Exporta y analiza tu progreso</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tipos de reportes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5 text-blue-600" />
                Reporte Semanal
              </CardTitle>
              <CardDescription>Resumen de tu progreso de los últimos 7 días</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Período:</span>
                  <span className="text-sm font-medium">Últimos 7 días</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Formato:</span>
                  <span className="text-sm font-medium">PDF</span>
                </div>
                <Button className="w-full" onClick={() => { setPeriod("semanal"); handleGenerateReport(); }}>
                  <Download className="mr-2 h-4 w-4" />
                  Generar Reporte
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-green-600" />
                Reporte Mensual
              </CardTitle>
              <CardDescription>Análisis completo del mes actual</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Período:</span>
                  <span className="text-sm font-medium">Mes actual</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Formato:</span>
                  <span className="text-sm font-medium">PDF</span>
                </div>
                <Button className="w-full" onClick={() => { setPeriod("mensual"); handleGenerateReport(); }}>
                  <Download className="mr-2 h-4 w-4" />
                  Generar Reporte
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-purple-600" />
                Reporte Personalizado
              </CardTitle>
              <CardDescription>Configura tu propio período y métricas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Período:</span>
                  <span className="text-sm font-medium">Personalizable</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Formato:</span>
                  <span className="text-sm font-medium">PDF</span>
                </div>
                <Button className="w-full" variant="outline" onClick={() => { setPeriod("personalizado"); handleGenerateReport(); }}>
                  <FileText className="mr-2 h-4 w-4" />
                  Generar Reporte
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Aquí va la pantalla de estadísticas real, igual que en statistics/page.tsx */}
        {/* Puedes importar y reutilizar el componente o copiar la lógica y el layout aquí */}
        {/* ... */}

        {/* Reporte HTML oculto para exportar */}
        <div id="report-html" style={{ position: 'absolute', left: '-9999px', top: 0, width: '900px', background: 'white', zIndex: -1, padding: 0 }}>
          {/* Aquí renderiza el mismo contenido de estadísticas, pero con los datos reales y el mismo diseño */}
          {/* ... */}
        </div>
      </div>
    </div>
  )
}
