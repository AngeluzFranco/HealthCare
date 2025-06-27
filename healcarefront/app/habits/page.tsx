"use client"

import type React from "react"

import { useState } from "react"
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
import { Target, Plus, Edit, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"

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
  const { usuario, habitos, crearHabito, loading } = useHealthcare()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Mapear datos del formulario al formato del backend
      const dataToSend = {
        ...formData,
        categoria: formData.categoria.toUpperCase(),
        unidadMedida: formData.unidadMedida.toUpperCase(),
        frecuenciaObjetivo: formData.metaDiaria,
        metaDiaria: undefined, // No enviar metaDiaria
      }
      await crearHabito(dataToSend)
      setFormData({
        nombre: "",
        descripcion: "",
        categoria: "",
        metaDiaria: "",
        unidadMedida: "",
        activo: true,
      })
      setIsDialogOpen(false)
      alert("Hábito creado correctamente")
    } catch (error) {
      alert("Error al crear el hábito")
      console.error(error)
    }
  }

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  if (!usuario) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Necesitas crear tu perfil primero</p>
          <Link href="/profile">
            <Button>Crear Perfil</Button>
          </Link>
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
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver al Dashboard
                </Button>
              </Link>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Hábitos</h1>
              <p className="text-gray-600">Crea y administra tus hábitos saludables</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Hábito
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Hábito</DialogTitle>
                  <DialogDescription>Define un nuevo hábito saludable para seguir diariamente</DialogDescription>
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
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Creando..." : "Crear Hábito"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {habitos.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No tienes hábitos configurados</h3>
              <p className="text-gray-600 mb-6">Crea tu primer hábito para comenzar a seguir tu progreso</p>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                      <CardDescription className="capitalize">
                        {mostrarCategoria(habito.categoria)}
                      </CardDescription>
                    </div>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
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
                <div className="text-3xl font-bold text-green-600">
                  {habitos.filter((h) => h.activo).length}
                </div>
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
