# ISO/IEC 42001:2023 Implementation Tracker v1.5B

**Autor:** Eduardo Restrepo  
**Versión:** 1.5B (Enterprise Edition)

## 📋 Descripción
Aplicación web profesional para auditar, registrar y gestionar el cumplimiento de la norma ISO/IEC 42001:2023. Permite el seguimiento detallado de controles, responsables, planes de acción y métricas evolutivas.

## 🚀 Requisitos
- [Node.js](https://nodejs.org/) (versión 14 o superior recomendada)

## 🛠️ Instalación y Ejecución
1. Abre una terminal en la carpeta del proyecto.
2. Instala las dependencias (si no lo has hecho):
   ```bash
   npm install
   ```
3. Inicia el servidor:
   ```bash
   npm start
   ```
4. Abre tu navegador en: [http://localhost:3000](http://localhost:3000)

## 📂 Estructura del Proyecto
- `server.js`: Servidor backend Node.js que gestiona la persistencia en archivos.
- `data/`: Directorio donde se almacenan los archivos JSON de datos (empresa, controles, etc.).
- `index.html`: Estructura principal de la interfaz de usuario.
- `styles.css`: Sistema de diseño moderno y responsivo.
- `js/`: Lógica de la aplicación (módulos frontend).
- `assets/`: Recursos gráficos y logos.

## 🔐 Persistencia
La aplicación utiliza un sistema de persistencia basado en archivos JSON locales, eliminando la necesidad de una base de datos externa y facilitando las copias de seguridad.

---
© 2025 Eduardo Restrepo Consultancy
