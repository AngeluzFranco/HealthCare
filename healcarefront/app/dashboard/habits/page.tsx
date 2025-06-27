"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useHealthcare } from "@/hooks/useHealthcare"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Target, Plus, Edit, Trash2, ArrowLeft, Heart, LogOut } from "lucide-react"
import Link from "next/link"
import type { Usuario, Habito } from "@/lib/api"
import { habitoAPI } from "@/lib/api"

const CATEGORIAS = [
  "ejercicio",
  "alimentacion",
  "hidratacion",
  "sueno",
  "meditacion",
  "lectura",
  "trabajo",
  "social",
  "otro",
]

const UNIDADES_MEDIDA = [
  "minutos",
  "horas",
  "vasos",
  "litros",
  "porciones",
  "repeticiones",
  "pasos",
  "kilometros",
  "paginas",
  "veces",
]

export default function HabitsPage() {
  const router = useRouter()
  const { habitos, crearHabito, loading } = useHealthcare()
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingHabito, setEditingHabito] = useState<Habito | null>(null)
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    categoria: "",
    metaDiaria: "",
    unidadMedida: "",
    activo: true,
  })

  // Utilidad para mostrar valores amigables
  const mostrarCategoria = (cat: string) => cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()
  const mostrarUnidad = (unidad: string) => unidad.charAt(0).toUpperCase() + unidad.slice(1).toLowerCase()

  // Mapear datos del backend a formato de UI
  const mapHabitoToUI = (habito: any) => ({
    ...habito,
    metaDiaria: habito.frecuenciaObjetivo ?? habito.metaDiaria ?? "",
    categoria: habito.categoria ? habito.categoria.toLowerCase() : "",
    unidadMedida: habito.unidadMedida ? habito.unidadMedida.toLowerCase() : "",
  })

  // Mapear todos los hábitos para la UI
  const habitosUI = habitos.map(mapHabitoToUI)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingHabito) {
        // Actualizar hábito existente
        await habitoAPI.actualizar(editingHabito.id!, formData)
        alert("Hábito actualizado correctamente")
      } else {
        // Crear nuevo hábito
        await crearHabito(formData)
        alert("Hábito creado correctamente")
      }

      resetForm()
      setIsDialogOpen(false)
      // Recargar la página para mostrar los cambios
      window.location.reload()
    } catch (error) {
      alert(editingHabito ? "Error al actualizar el hábito" : "Error al crear el hábito")
      console.error(error)
    }
  }

  const handleEdit = (habito: Habito) => {
    setEditingHabito(habito)
    setFormData({
      nombre: habito.nombre,
      descripcion: habito.descripcion,
      categoria: habito.categoria,
      metaDiaria: habito.metaDiaria,
      unidadMedida: habito.unidadMedida,
      activo: habito.activo,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (habitoId: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar este hábito?")) {
      try {
        await habitoAPI.eliminar(habitoId)
        alert("Hábito eliminado correctamente")
        // Recargar la página para mostrar los cambios
        window.location.reload()
      } catch (error) {
        alert("Error al eliminar el hábito")
        console.error(error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      categoria: "",
      metaDiaria: "",
      unidadMedida: "",
      activo: true,
    })
    setEditingHabito(null)
  }

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
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
                <h1 className="text-3xl font-bold text-gray-900">Gestión de Hábitos</h1>
                <p className="text-gray-600">Crea y administra tus hábitos saludables</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Dialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                  setIsDialogOpen(open)
                  if (!open) resetForm()
                }}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Hábito
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{editingHabito ? "Editar Hábito" : "Crear Nuevo Hábito"}</DialogTitle>
                    <DialogDescription>
                      {editingHabito
                        ? "Modifica la información de tu hábito"
                        : "Define un nuevo hábito saludable para seguir diariamente"}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="nombre">Nombre del Hábito</Label>
                      <Input
                        id="nombre"
                        value={formData.nombre}
                        onChange={(e) => handleChange("nombre", e.target.value)}
                        placeholder="Ej: Beber agua"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="descripcion">Descripción</Label>
                      <Textarea
                        id="descripcion"
                        value={formData.descripcion}
                        onChange={(e) => handleChange("descripcion", e.target.value)}
                        placeholder="Describe tu hábito..."
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="categoria">Categoría</Label>
                        <Select value={formData.categoria} onValueChange={(value) => handleChange("categoria", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona categoría" />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORIAS.map((categoria) => (
                              <SelectItem key={categoria} value={categoria}>
                                {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="unidadMedida">Unidad de Medida</Label>
                        <Select
                          value={formData.unidadMedida}
                          onValueChange={(value) => handleChange("unidadMedida", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona unidad" />
                          </SelectTrigger>
                          <SelectContent>
                            {UNIDADES_MEDIDA.map((unidad) => (
                              <SelectItem key={unidad} value={unidad}>
                                {unidad}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="metaDiaria">Meta Diaria</Label>
                      <Input
                        id="metaDiaria"
                        value={formData.metaDiaria}
                        onChange={(e) => handleChange("metaDiaria", e.target.value)}
                        placeholder="Ej: 8 vasos, 30 minutos, 10000 pasos"
                        required
                      />
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsDialogOpen(false)
                          resetForm()
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" disabled={loading}>
                        {loading
                          ? editingHabito
                            ? "Actualizando..."
                            : "Creando..."
                          : editingHabito
                            ? "Actualizar Hábito"
                            : "Crear Hábito"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {habitosUI.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No tienes hábitos configurados</h3>
              <p className="text-gray-600 mb-6">Crea tu primer hábito para comenzar a seguir tu progreso</p>
              <Dialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                  setIsDialogOpen(open)
                  if (!open) resetForm()
                }}
              >
                <DialogTrigger asChild>
                  <Button size="lg">
                    <Plus className="mr-2 h-4 w-4" />
                    Crear Primer Hábito
                  </Button>
                </DialogTrigger>
              </Dialog>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {habitosUI.map((habito) => (
              <Card key={habito.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{habito.nombre}</CardTitle>
                      <CardDescription className="capitalize">{mostrarCategoria(habito.categoria)}</CardDescription>
                    </div>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(habito)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(habito.id!)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{habito.descripcion}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Meta diaria:</span>
                      <span className="text-sm text-blue-600">{habito.metaDiaria}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Unidad:</span>
                      <span className="text-sm">{mostrarUnidad(habito.unidadMedida)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Estado:</span>
                      <span className={`text-sm ${habito.activo ? "text-green-600" : "text-red-600"}`}>
                        {habito.activo ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Estadísticas de hábitos */}
        {habitos.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total de Hábitos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{habitos.length}</div>
                <p className="text-sm text-gray-600">Hábitos configurados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Hábitos Activos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{habitos.filter((h) => h.activo).length}</div>
                <p className="text-sm text-gray-600">Hábitos en seguimiento</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categorías</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {new Set(habitos.map((h) => h.categoria)).size}
                </div>
                <p className="text-sm text-gray-600">Categorías diferentes</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
