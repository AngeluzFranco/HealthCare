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
import { User, Save, ArrowLeft, Heart, LogOut } from "lucide-react"
import Link from "next/link"
import type { Usuario } from "@/lib/api"

export default function ProfilePage() {
  const router = useRouter()
  const { actualizarUsuario, loading } = useHealthcare()
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null)
  const [formData, setFormData] = useState<Usuario>({
    email: "",
    nombre: "",
    apellido: "",
    edad: 0,
    genero: "",
    pesoKg: 0,
    alturaCm: 0,
    nivelActividad: "",
    objetivoSalud: "",
  })

  useEffect(() => {
    const user = localStorage.getItem("currentUser")
    if (!user) {
      router.push("/auth/login")
      return
    }
    const userData = JSON.parse(user)
    setCurrentUser(userData)
    setFormData(userData)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const usuarioActualizado = await actualizarUsuario(formData)
      setCurrentUser(usuarioActualizado)
      alert("Perfil actualizado correctamente")
    } catch (error) {
      alert("Error al actualizar el perfil")
      console.error(error)
    }
  }

  const handleChange = (field: keyof Usuario, value: string | number) => {
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <h1 className="text-3xl font-bold text-gray-900">Editar Perfil</h1>
                <p className="text-gray-600">Actualiza tu información personal y objetivos de salud</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Información Personal
            </CardTitle>
            <CardDescription>Actualiza tu información personal y objetivos de salud</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información básica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => handleChange("nombre", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="apellido">Apellido</Label>
                  <Input
                    id="apellido"
                    type="text"
                    value={formData.apellido}
                    onChange={(e) => handleChange("apellido", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="edad">Edad</Label>
                  <Input
                    id="edad"
                    type="number"
                    min="1"
                    max="120"
                    value={formData.edad || ""}
                    onChange={(e) => handleChange("edad", Number.parseInt(e.target.value) || 0)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="genero">Género</Label>
                  <Select value={formData.genero} onValueChange={(value) => handleChange("genero", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona género" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Masculino</SelectItem>
                      <SelectItem value="F">Femenino</SelectItem>
                      <SelectItem value="O">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="nivelActividad">Nivel de Actividad</Label>
                  <Select
                    value={formData.nivelActividad}
                    onValueChange={(value) => handleChange("nivelActividad", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona nivel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentario">Sedentario</SelectItem>
                      <SelectItem value="ligero">Ligero</SelectItem>
                      <SelectItem value="moderado">Moderado</SelectItem>
                      <SelectItem value="alto">Alto</SelectItem>
                      <SelectItem value="muy_alto">Muy Alto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Medidas físicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="peso">Peso (kg)</Label>
                  <Input
                    id="peso"
                    type="number"
                    min="1"
                    step="0.1"
                    value={formData.pesoKg || ""}
                    onChange={(e) => handleChange("pesoKg", Number.parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="altura">Altura (cm)</Label>
                  <Input
                    id="altura"
                    type="number"
                    min="1"
                    step="0.1"
                    value={formData.alturaCm || ""}
                    onChange={(e) => handleChange("alturaCm", Number.parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>
              </div>

              {/* Objetivo de salud */}
              <div>
                <Label htmlFor="objetivo">Objetivo de Salud</Label>
                <Textarea
                  id="objetivo"
                  placeholder="Describe tus objetivos de salud (ej: perder peso, ganar músculo, mejorar resistencia...)"
                  value={formData.objetivoSalud}
                  onChange={(e) => handleChange("objetivoSalud", e.target.value)}
                  rows={3}
                />
              </div>

              {/* Información calculada */}
              {formData.pesoKg > 0 && formData.alturaCm > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Información Calculada</h3>
                  <p className="text-blue-800">
                    IMC: {(formData.pesoKg / Math.pow(formData.alturaCm / 100, 2)).toFixed(1)}{" "}
                    <span className="text-sm">
                      (
                      {formData.pesoKg / Math.pow(formData.alturaCm / 100, 2) < 18.5
                        ? "Bajo peso"
                        : formData.pesoKg / Math.pow(formData.alturaCm / 100, 2) < 25
                          ? "Peso normal"
                          : formData.pesoKg / Math.pow(formData.alturaCm / 100, 2) < 30
                            ? "Sobrepeso"
                            : "Obesidad"}
                      )
                    </span>
                  </p>
                </div>
              )}

              <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? "Guardando..." : "Actualizar Perfil"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
