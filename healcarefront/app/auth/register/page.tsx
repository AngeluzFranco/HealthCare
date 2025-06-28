"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Heart, ArrowLeft, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { usuarioAPI, type Usuario } from "@/lib/api"

export default function RegisterPage() {
  const router = useRouter()
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
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Validaciones
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      setLoading(false)
      return
    }

    // Validar contraseña: solo dígitos, 5 a 8 caracteres
    if (!/^\d{5,8}$/.test(password)) {
      setError("La contraseña debe tener solo dígitos y entre 5 y 8 caracteres")
      setLoading(false)
      return
    }

    try {
      // Agregar la contraseña al objeto de usuario
      const usuarioConPassword = { ...formData, password }
      const usuarioCreado = await usuarioAPI.crear(usuarioConPassword)

      // Guardar usuario en localStorage
      localStorage.setItem("currentUser", JSON.stringify(usuarioCreado))

      // Redirigir al dashboard
      router.push("/dashboard")
    } catch (err) {
      setError("Error al crear la cuenta. El email podría estar en uso.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof Usuario, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al inicio
          </Link>
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">HealthCare</h1>
          </div>
          <h2 className="text-xl text-gray-600">Crea tu cuenta</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Registro</CardTitle>
            <CardDescription>Completa tu información para crear tu cuenta de HealthCare</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información de cuenta */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Información de Cuenta</h3>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="tu@email.com"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="password">Contraseña</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="•••••"
                        required
                        pattern="\d{5,8}"
                        title="Solo dígitos, entre 5 y 8 caracteres"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="•••••"
                      required
                      pattern="\d{5,8}"
                      title="Solo dígitos, entre 5 y 8 caracteres"
                    />
                  </div>
                </div>
              </div>

              {/* Información personal */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Información Personal</h3>

                <div className="grid grid-cols-2 gap-4">
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

                <div className="grid grid-cols-3 gap-4">
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
                        <SelectValue placeholder="Selecciona" />
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
                        <SelectValue placeholder="Selecciona" />
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

                <div className="grid grid-cols-2 gap-4">
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
              </div>

              {/* IMC calculado */}
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

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">{error}</div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creando cuenta..." : "Crear Cuenta"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes una cuenta?{" "}
                <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}