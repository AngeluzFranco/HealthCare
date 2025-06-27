"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useHealthcare } from "@/hooks/useHealthcare"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Heart, LogOut, BarChart3, TrendingUp, Calendar, Target } from "lucide-react"
import Link from "next/link"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import type { Usuario } from "@/lib/api"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#FF6B6B", "#4ECDC4", "#45B7D1"]

export default function StatisticsPage() {
  const router = useRouter()
  const { habitos, registros, loading } = useHealthcare()
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null)

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

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  // Calcular datos reales a partir de registros y hábitos
  // Progreso semanal real
  const diasSemana = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
  const hoy = new Date()
  const semanaActual = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(hoy)
    d.setDate(hoy.getDate() - (hoy.getDay() === 0 ? 6 : hoy.getDay() - 1) + i)
    return d
  })
  const datosSemanales = semanaActual.map((fecha, idx) => {
    const fechaStr = fecha.toISOString().split("T")[0]
    const registrosDia = registros.filter((r) => r.fecha === fechaStr)
    const completados = registrosDia.filter((r) => r.completado).length
    return {
      dia: diasSemana[idx],
      completados,
      total: registrosDia.length,
    }
  })

  // Progreso mensual real
  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
  const datosMensuales = Array.from({ length: 6 }, (_, i) => {
    const mes = new Date(hoy.getFullYear(), hoy.getMonth() - (5 - i), 1)
    const mesStr = mes.toISOString().slice(0, 7)
    const registrosMes = registros.filter((r) => r.fecha.startsWith(mesStr))
    const completados = registrosMes.filter((r) => r.completado).length
    const promedio = registrosMes.length > 0 ? Math.round((completados / registrosMes.length) * 100) : 0
    return {
      mes: meses[mes.getMonth()],
      promedio,
    }
  })

  // Mejor categoría y racha
  let mejorCategoria = "-"
  let mejorPorcentaje = 0
  let rachaActual = 0
  let diasActivos = 0
  const diasMes = new Set()
  const categoriaStats: Record<string, { total: number; completados: number }> = {}
  registros.forEach((r) => {
    if (!categoriaStats[r.habito.categoria]) categoriaStats[r.habito.categoria] = { total: 0, completados: 0 }
    categoriaStats[r.habito.categoria].total++
    if (r.completado) categoriaStats[r.habito.categoria].completados++
    if (r.completado) diasMes.add(r.fecha)
  })
  Object.entries(categoriaStats).forEach(([cat, stat]) => {
    const porcentaje = stat.total > 0 ? Math.round((stat.completados / stat.total) * 100) : 0
    if (porcentaje > mejorPorcentaje) {
      mejorPorcentaje = porcentaje
      mejorCategoria = cat.charAt(0).toUpperCase() + cat.slice(1)
    }
  })
  diasActivos = diasMes.size
  // Racha actual (días consecutivos con al menos un hábito completado)
  let racha = 0
  let fechaIter = new Date(hoy)
  while (true) {
    const fechaStr = fechaIter.toISOString().split("T")[0]
    if (registros.some((r) => r.fecha === fechaStr && r.completado)) {
      racha++
      fechaIter.setDate(fechaIter.getDate() - 1)
    } else {
      break
    }
  }
  rachaActual = racha

  // Datos por categoría para gráficos
  const datosPorCategoria = habitos.reduce(
    (acc, habito) => {
      const categoria = habito.categoria
      if (!acc[categoria]) {
        acc[categoria] = { nombre: categoria, total: 0, completados: 0 }
      }
      acc[categoria].total += 1
      const registro = registros.find((r) => r.habito.id === habito.id)
      if (registro?.completado) {
        acc[categoria].completados += 1
      }
      return acc
    },
    {} as Record<string, { nombre: string; total: number; completados: number }>,
  )
  const datosCategoriasChart = Object.values(datosPorCategoria).map((cat) => ({
    name: cat.nombre,
    value: cat.total,
    completados: cat.completados,
    porcentaje: cat.total > 0 ? Math.round((cat.completados / cat.total) * 100) : 0,
  }))

  // Sugerencias dinámicas
  const sugerencias: string[] = []
  if (habitos.length === 0) {
    sugerencias.push("Aún no tienes hábitos configurados. ¡Crea tu primer hábito para comenzar a mejorar tu salud!")
  } else {
    Object.keys(categoriaStats).forEach((cat) => {
      const stat = categoriaStats[cat]
      const porcentaje = stat.total > 0 ? Math.round((stat.completados / stat.total) * 100) : 0
      if (porcentaje === 0) {
        sugerencias.push(`No has completado ningún hábito de la categoría ${cat}. ¡Intenta registrar alguno esta semana!`)
      } else if (porcentaje < 60) {
        sugerencias.push(`Puedes mejorar en la categoría ${cat}. Intenta cumplir más hábitos para subir tu porcentaje.`)
      } else if (porcentaje < 100) {
        sugerencias.push(`¡Vas bien en la categoría ${cat}! Un poco más y logras el 100%.`)
      } else {
        sugerencias.push(`¡Excelente! Has completado todos los hábitos de la categoría ${cat}.`)
      }
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <h1 className="text-3xl font-bold text-gray-900">Estadísticas</h1>
                <p className="text-gray-600">Analiza tu progreso y tendencias</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Promedio Semanal</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(
                  datosSemanales.reduce((acc, d) => acc + (d.total > 0 ? (d.completados / d.total) * 100 : 0), 0) /
                    datosSemanales.length || 0
                ).toFixed(2)}%
              </div>
              <p className="text-xs text-muted-foreground">Promedio de cumplimiento semanal</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Racha Actual</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rachaActual} días</div>
              <p className="text-xs text-muted-foreground">Días consecutivos con hábitos completados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mejor Categoría</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mejorCategoria}</div>
              <p className="text-xs text-muted-foreground">{mejorPorcentaje}% de cumplimiento</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Días Activos</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{diasActivos}</div>
              <p className="text-xs text-muted-foreground">Días con al menos un hábito completado este mes</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Progreso Semanal */}
          <Card>
            <CardHeader>
              <CardTitle>Progreso Semanal</CardTitle>
              <CardDescription>Hábitos completados por día</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={datosSemanales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dia" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completados" fill="#8884d8" />
                  <Bar dataKey="total" fill="#e0e0e0" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Tendencia Mensual */}
          <Card>
            <CardHeader>
              <CardTitle>Tendencia Mensual</CardTitle>
              <CardDescription>Promedio de cumplimiento por mes</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={datosMensuales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="promedio" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Análisis por categorías */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Distribución por Categorías */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Distribución por Categorías</CardTitle>
              <CardDescription>Número de hábitos por categoría</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={datosCategoriasChart}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {datosCategoriasChart.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
