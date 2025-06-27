# 🏥 Proyecto HealthCare

*HealthCare* es una aplicación enfocada en la gestión de hábitos de salud, permitiendo a los usuarios registrar y monitorear aspectos clave de su bienestar, como el consumo de agua, las horas de sueño, la ingesta calórica, entre otros. Incluye integración con *Alexa*, visualización de datos y una interfaz amigable tanto en web como móvil.

---

## 👥 Integrantes del equipo

- *Angeluz Abimelek Franco Hernández*  
- *Christopher Alexis Quintana Ruiz*  
- *Ricardo Fabricio Escobar Monterrubio*  
- *Jassiel Alejandro Peralta Santos*

---


## 🔄 Clonación del Repositorio

bash
git clone https://github.com/AngeluzFranco/HealthCare.git


## 🌐 Frontend - React/Next.js
Interfaz de usuario con gráficos interactivos, gestión de hábitos, autenticación y comandos por voz con Alexa.

🚀 Instalación y Configuración
📋 Prerrequisitos
Node.js versión 18 o superior

Backend corriendo en http://localhost:8080

⚙ Pasos de instalación

bash
cd frontend
npm install
npm run dev




## 🧪 Comandos de Desarrollo
bash
Copiar
Editar
npm run dev       # Desarrollo local
npm run build     # Build para producción
npm run start     # Ejecutar build
npm run lint      # Linting


⚙ Backend - Spring Boot
API RESTful para usuarios, hábitos y registros de actividad, desarrollada con Java 17 y Spring Boot.

📋 Prerrequisitos
Java 17 o superior

Maven

MySQL (o base de datos compatible)

## ⚙ Configuración
Modifica src/main/resources/application.properties:


spring.datasource.url=jdbc:mysql://localhost:3306/healthcare
spring.datasource.username=TU_USUARIO
spring.datasource.password=TU_CONTRASEÑA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
server.port=8080
▶ Ejecutar el Backend

bash
cd backend
mvn spring-boot:run
Verifica en navegador:
http://localhost:8080/api/usuarios


