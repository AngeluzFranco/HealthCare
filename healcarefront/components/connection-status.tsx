"use client"

import { useEffect, useState } from "react"
import { verificarConexion } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react"

export function ConnectionStatus() {
  const [connected, setConnected] = useState<boolean | null>(null)
  const [checking, setChecking] = useState(false)

  const checkConnection = async () => {
    setChecking(true)
    const isConnected = await verificarConexion()
    setConnected(isConnected)
    setChecking(false)
  }

  useEffect(() => {
    checkConnection()
  }, [])

  if (connected === null) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="flex items-center space-x-2 py-4">
          <RefreshCw className="h-4 w-4 animate-spin text-yellow-600" />
          <span className="text-yellow-800">Verificando conexión con el backend...</span>
        </CardContent>
      </Card>
    )
  }

  if (connected) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-green-800">Conectado al backend</span>
          </div>
          <Button variant="outline" size="sm" onClick={checkConnection} disabled={checking}>
            <RefreshCw className={`h-4 w-4 mr-2 ${checking ? "animate-spin" : ""}`} />
            Verificar
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="flex items-center text-red-800">
          <AlertCircle className="h-5 w-5 mr-2" />
          Sin conexión al backend
        </CardTitle>
        <CardDescription className="text-red-700">
          No se puede conectar al servidor en http://localhost:8080
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-red-700">
            <p className="font-medium mb-2">Para solucionar este problema:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Asegúrate de que el backend Spring Boot esté corriendo</li>
              <li>Verifica que esté en el puerto 8080</li>
              <li>Comprueba que la configuración CORS esté habilitada</li>
            </ol>
          </div>

          <div className="bg-red-100 p-3 rounded-md">
            <p className="text-sm text-red-800 font-medium mb-1">Comandos para ejecutar el backend:</p>
            <code className="text-xs bg-red-200 px-2 py-1 rounded">mvn spring-boot:run</code>
          </div>

          <Button onClick={checkConnection} disabled={checking} className="w-full">
            <RefreshCw className={`h-4 w-4 mr-2 ${checking ? "animate-spin" : ""}`} />
            {checking ? "Verificando..." : "Reintentar Conexión"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
