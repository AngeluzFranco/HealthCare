"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Heart, LogOut, Trash2, Pencil } from "lucide-react"
import Link from "next/link"
import { NotificacionesPanel } from "@/components/notificaciones-panel"
import { toast } from "sonner"

export default function NotificationsPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)

  // CRUD de notificaciones personalizadas
  const [habitos, setHabitos] = useState<{ id: number; nombre: string }[]>([])
  const [notificaciones, setNotificaciones] = useState<any[]>([])
  const [loadingNotificaciones, setLoadingNotificaciones] = useState(false)
  const [form, setForm] = useState<{ id?: number; habitoId: string; titulo: string; mensaje: string; enviadaEn: string }>({
    habitoId: "",
    titulo: "",
    mensaje: "",
    enviadaEn: "",
  })
  const [editing, setEditing] = useState<null | number>(null)

  // Para evitar mostrar el toast varias veces
  const mostradasRef = useRef<{ [id: number]: boolean }>({})

  useEffect(() => {
    const user = localStorage.getItem("currentUser")
    if (!user) {
      router.push("/auth/login")
      return
    }
    const userData = JSON.parse(user)
    setCurrentUser(userData)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  // CRUD de notificaciones personalizadas
  const fetchNotificaciones = async () => {
    if (!currentUser) return
    setLoadingNotificaciones(true)
    try {
      const res = await fetch(`http://localhost:8080/api/notificaciones/usuario/${currentUser.id}`)
      const data = await res.json()
      setNotificaciones(data)
    } catch {
      setNotificaciones([])
    } finally {
      setLoadingNotificaciones(false)
    }
  }

  useEffect(() => {
    if (!currentUser) return
    fetch(`http://localhost:8080/api/habitos/usuario/${currentUser.id}`)
      .then(res => res.json())
      .then(data => setHabitos(data))
      .catch(() => setHabitos([]))
    fetchNotificaciones()
    // eslint-disable-next-line
  }, [currentUser])

  // Form handlers
  const handleFormChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.habitoId || !form.titulo || !form.mensaje || !form.enviadaEn) return
    try {
      const payload = {
        usuario: { id: currentUser!.id },
        habito: { id: Number(form.habitoId) },
        tipo: "RECORDATORIO_HABITO",
        titulo: form.titulo,
        mensaje: form.mensaje,
        estado: "ENVIADA",
        prioridad: "MEDIA",
        enviadaEn: form.enviadaEn,
      }
      if (editing) {
        await fetch(`http://localhost:8080/api/notificaciones/${editing}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      } else {
        await fetch("http://localhost:8080/api/notificaciones/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      }
      setForm({ habitoId: "", titulo: "", mensaje: "", enviadaEn: "" })
      setEditing(null)
      fetchNotificaciones()
    } catch {
      alert("Error al guardar la notificación")
    }
  }

  const handleEdit = (n: any) => {
    setEditing(n.id)
    setForm({
      id: n.id,
      habitoId: n.habito.id ? String(n.habito.id) : "",
      titulo: n.titulo,
      mensaje: n.mensaje,
      enviadaEn: n.enviadaEn ? n.enviadaEn.slice(0, 16) : "",
    })
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Eliminar esta notificación?")) return
    await fetch(`http://localhost:8080/api/notificaciones/${id}`, { method: "DELETE" })
    fetchNotificaciones()
  }

  const handleCancelEdit = () => {
    setEditing(null)
    setForm({ habitoId: "", titulo: "", mensaje: "", enviadaEn: "" })
  }

  // Mostrar notificación cuando llega la hora
  useEffect(() => {
    if (!notificaciones.length) return
    const interval = setInterval(() => {
      const now = new Date()
      notificaciones.forEach(n => {
        if (
          n.estado === "ENVIADA" &&
          !n.leidaEn &&
          new Date(n.enviadaEn) <= now &&
          !mostradasRef.current[n.id]
        ) {
          toast(n.titulo, {
            description: n.mensaje,
            action: {
              label: "Marcar como leída",
              onClick: async () => {
                await fetch(`http://localhost:8080/api/notificaciones/${n.id}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ ...n, estado: "LEIDA", leidaEn: new Date().toISOString() }),
                })
                fetchNotificaciones()
              },
            },
          })
          mostradasRef.current[n.id] = true
        }
      })
    }, 5000)
    return () => clearInterval(interval)
  }, [notificaciones])



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
                <h1 className="text-3xl font-bold text-gray-900">Centro de Notificaciones</h1>
                <p className="text-gray-600">Gestiona tus notificaciones y recordatorios</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="nuevas" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="nuevas">Nuevas</TabsTrigger>
            <TabsTrigger value="todas">Todas</TabsTrigger>
            <TabsTrigger value="recordatorios">Recordatorios por Hábito</TabsTrigger>
          </TabsList>

          <TabsContent value="nuevas">
            <NotificacionesPanel usuarioId={currentUser.id!} mostrarSoloNoLeidas={true} />
          </TabsContent>

          <TabsContent value="todas">
            <NotificacionesPanel usuarioId={currentUser.id!} mostrarSoloNoLeidas={false} />
          </TabsContent>

          <TabsContent value="recordatorios">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Notificaciones Personalizadas</CardTitle>
                <CardDescription>
                  Crea, edita o elimina tus notificaciones personalizadas para tus hábitos.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Formulario para crear/editar notificación */}
                <form className="space-y-4 mb-8" onSubmit={handleFormSubmit}>
                  <div className="flex flex-wrap gap-4">
                    <select
                      className="w-48 border rounded px-3 py-2"
                      value={form.habitoId}
                      onChange={e => handleFormChange("habitoId", e.target.value)}
                      required
                    >
                      <option value="">Selecciona un hábito</option>
                      {habitos.map(h => (
                        <option key={h.id} value={h.id}>{h.nombre}</option>
                      ))}
                    </select>
                    <input
                      className="w-48 border rounded px-3 py-2"
                      placeholder="Título"
                      value={form.titulo}
                      onChange={e => handleFormChange("titulo", e.target.value)}
                      maxLength={50}
                      required
                    />
                    <input
                      className="w-64 border rounded px-3 py-2"
                      placeholder="Mensaje"
                      value={form.mensaje}
                      onChange={e => handleFormChange("mensaje", e.target.value)}
                      maxLength={100}
                      required
                    />
                    <input
                      className="w-56 border rounded px-3 py-2"
                      type="datetime-local"
                      value={form.enviadaEn}
                      onChange={e => handleFormChange("enviadaEn", e.target.value)}
                      required
                    />
                    <div className="flex gap-2">
                      <Button type="submit">{editing ? "Actualizar" : "Crear"}</Button>
                      {editing && (
                        <Button type="button" variant="outline" onClick={handleCancelEdit}>
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </div>
                </form>

                {/* Lista de notificaciones */}
                <div>
                  <h3 className="font-semibold mb-2">Tus notificaciones</h3>
                  {loadingNotificaciones ? (
                    <div className="text-center text-gray-500">Cargando...</div>
                  ) : notificaciones.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      ¿Quieres agregar una notificación?
                    </div>
                  ) : (
                    <ul className="space-y-4">
                      {notificaciones.map((n) => (
                        <li key={n.id} className="border rounded p-4 flex justify-between items-center">
                          <div>
                            <div className="font-bold">{n.titulo}</div>
                            <div className="text-sm text-gray-600">{n.mensaje}</div>
                            <div className="text-xs text-gray-400">
                              Hábito: {habitos.find(h => h.id === n.habito.id)?.nombre || "N/A"} | {n.enviadaEn.replace("T", " ")}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleEdit(n)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => handleDelete(n.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                         
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}