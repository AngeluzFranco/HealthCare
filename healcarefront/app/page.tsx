"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Activity, Target, Users, Smartphone, Mic } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">HealthCare</h1>
            </div>
            <div className="flex space-x-4">
              <Link href="/auth/login">
                <Button variant="outline">Iniciar Sesión</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Registrarse</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Tu Salud, Nuestro <span className="text-blue-600">Compromiso</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transforma tu vida con nuestro sistema inteligente de seguimiento de hábitos saludables. Conecta con Alexa y
            lleva tu bienestar al siguiente nivel.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/auth/register">
              <Button size="lg" className="px-8 py-3">
                <Activity className="mr-2 h-5 w-5" />
                Comenzar Ahora
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-3"
              onClick={() => {
                document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              Conocer Más
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Funcionalidades Principales</h3>
            <p className="text-lg text-gray-600">Todo lo que necesitas para mantener un estilo de vida saludable</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Target className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Seguimiento de Hábitos</CardTitle>
                <CardDescription>
                  Registra y monitorea tus hábitos diarios de forma sencilla e intuitiva
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Activity className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>Análisis Personalizado</CardTitle>
                <CardDescription>
                  Obtén insights detallados sobre tu progreso y recomendaciones personalizadas
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Mic className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Integración con Alexa</CardTitle>
                <CardDescription>Controla tu seguimiento de salud usando comandos de voz con Alexa</CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Smartphone className="h-12 w-12 text-orange-600 mb-4" />
                <CardTitle>App Móvil</CardTitle>
                <CardDescription>
                  Accede a todas las funciones desde tu dispositivo móvil en cualquier momento
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-red-600 mb-4" />
                <CardTitle>Comunidad</CardTitle>
                <CardDescription>Conecta con otros usuarios y comparte tu progreso en la comunidad</CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Heart className="h-12 w-12 text-pink-600 mb-4" />
                <CardTitle>Bienestar Integral</CardTitle>
                <CardDescription>
                  Enfoque holístico que abarca ejercicio, nutrición, sueño y bienestar mental
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Alexa Integration Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Mic className="h-16 w-16 mx-auto mb-6" />
            <h3 className="text-3xl font-bold mb-4">Integración con Alexa</h3>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Controla tu salud con la voz. Registra hábitos, consulta tu progreso y recibe recordatorios usando
              comandos de voz naturales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Comandos de Registro</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-white/90">
                  <li>• "Alexa, registra que bebí 8 vasos de agua"</li>
                  <li>• "Alexa, completé 30 minutos de ejercicio"</li>
                  <li>• "Alexa, caminé 10000 pasos hoy"</li>
                  <li>• "Alexa, medité por 15 minutos"</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Comandos de Consulta</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-white/90">
                  <li>• "Alexa, ¿cómo va mi progreso hoy?"</li>
                  <li>• "Alexa, ¿qué hábitos me faltan?"</li>
                  <li>• "Alexa, muestra mi resumen semanal"</li>
                  <li>• "Alexa, ¿cuál es mi racha actual?"</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-6">¿Listo para Transformar tu Salud?</h3>
          <p className="text-lg text-gray-600 mb-8">
            Únete a miles de usuarios que ya están mejorando su bienestar con HealthCare
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="px-12 py-4 text-lg">
              <Heart className="mr-2 h-5 w-5" />
              Comenzar Gratis
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Heart className="h-6 w-6 text-blue-400 mr-2" />
                <span className="text-xl font-bold">HealthCare</span>
              </div>
              <p className="text-gray-400">Tu compañero inteligente para un estilo de vida saludable</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Producto</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Funcionalidades
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Precios
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Soporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Documentación
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contacto
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Acerca de
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Carreras
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 HealthCare. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
