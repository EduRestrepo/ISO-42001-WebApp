// Full list of ISO/IEC 42001:2023 Annex A controls (38 controls organized by objective)

export const seedControls = [
  // A.2 Policies related to AI
  { id: 1, categoria: "A.2 Políticas", nombre: "A.2.1 Políticas para IA", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Medio", impacto: "Medio", notas: "" },

  // A.3 Internal organization
  { id: 2, categoria: "A.3 Organización", nombre: "A.3.1 Roles y Responsabilidades", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Medio", impacto: "Medio", notas: "" },

  // A.4 Resources for AI systems
  { id: 3, categoria: "A.4 Recursos", nombre: "A.4.1 Datos para Sistemas de IA", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Alto", impacto: "Alto", notas: "" },
  { id: 4, categoria: "A.4 Recursos", nombre: "A.4.2 Herramientas de Desarrollo", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Medio", impacto: "Medio", notas: "" },
  { id: 5, categoria: "A.4 Recursos", nombre: "A.4.3 Computación y Almacenamiento", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Medio", impacto: "Medio", notas: "" },
  { id: 6, categoria: "A.4 Recursos", nombre: "A.4.4 Expertise Humano", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Medio", impacto: "Medio", notas: "" },
  { id: 7, categoria: "A.4 Recursos", nombre: "A.4.5 Otros Recursos Críticos", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Medio", impacto: "Medio", notas: "" },

  // A.5 Assessing impacts of AI systems
  { id: 8, categoria: "A.5 Impacto", nombre: "A.5.1 Evaluación del Impacto de la IA", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Crítico", impacto: "Crítico", notas: "" },

  // A.6 AI system lifecycle
  { id: 9, categoria: "A.6 Ciclo de Vida", nombre: "A.6.1 Objetivos del Sistema de IA", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Medio", impacto: "Medio", notas: "" },
  { id: 10, categoria: "A.6 Ciclo de Vida", nombre: "A.6.2 Diseño y Desarrollo Responsable", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Alto", impacto: "Alto", notas: "" },
  { id: 11, categoria: "A.6 Ciclo de Vida", nombre: "A.6.3 Verificación y Validación", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Alto", impacto: "Alto", notas: "" },
  { id: 12, categoria: "A.6 Ciclo de Vida", nombre: "A.6.4 Implementación y Despliegue", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Medio", impacto: "Medio", notas: "" },
  { id: 13, categoria: "A.6 Ciclo de Vida", nombre: "A.6.5 Operación del Sistema de IA", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Medio", impacto: "Medio", notas: "" },
  { id: 14, categoria: "A.6 Ciclo de Vida", nombre: "A.6.6 Monitoreo y Revisión", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Alto", impacto: "Alto", notas: "" },
  { id: 15, categoria: "A.6 Ciclo de Vida", nombre: "A.6.7 Mantenimiento y Retiro", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Bajo", impacto: "Medio", notas: "" },

  // A.7 Data for AI systems
  { id: 16, categoria: "A.7 Datos", nombre: "A.7.1 Requisitos de Calidad de Datos", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Alto", impacto: "Crítico", notas: "" },
  { id: 17, categoria: "A.7 Datos", nombre: "A.7.2 Procedencia de Datos", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Alto", impacto: "Alto", notas: "" },
  { id: 18, categoria: "A.7 Datos", nombre: "A.7.3 Preparación y Limpieza", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Medio", impacto: "Alto", notas: "" },
  { id: 19, categoria: "A.7 Datos", nombre: "A.7.4 Protección y Privacidad", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Crítico", impacto: "Crítico", notas: "" },

  // A.8 Information for interested parties
  { id: 20, categoria: "A.8 Información", nombre: "A.8.1 Documentación para Usuarios", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Medio", impacto: "Medio", notas: "" },
  { id: 21, categoria: "A.8 Información", nombre: "A.8.2 Transparencia del Modelo", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Alto", impacto: "Alto", notas: "" },
  { id: 22, categoria: "A.8 Información", nombre: "A.8.3 Reportes Explicabilidad", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Medio", impacto: "Medio", notas: "" },

  // A.9 Use of AI systems
  { id: 23, categoria: "A.9 Uso", nombre: "A.9.1 Uso Responsable", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Alto", impacto: "Alto", notas: "" },
  { id: 24, categoria: "A.9 Uso", nombre: "A.9.2 Supervisión Humana", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Alto", impacto: "Alto", notas: "" },
  { id: 25, categoria: "A.9 Uso", nombre: "A.9.3 Restricciones de Uso", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Medio", impacto: "Medio", notas: "" },

  // A.10 Third-party relationships
  { id: 26, categoria: "A.10 Terceros", nombre: "A.10.1 Gestión de Proveedores IA", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Medio", impacto: "Medio", notas: "" },
  { id: 27, categoria: "A.10 Terceros", nombre: "A.10.2 Acuerdos de Datos", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Medio", impacto: "Alto", notas: "" },
  { id: 28, categoria: "A.10 Terceros", nombre: "A.10.3 Monitoreo de Terceros", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Medio", impacto: "Medio", notas: "" },

  // Extended controls based on common framework sub-divisions (reaching more coverage)
  { id: 29, categoria: "A.5 Impacto", nombre: "A.5.2 Evaluación de Sesgos", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Alto", impacto: "Alto", notas: "" },
  { id: 30, categoria: "A.5 Impacto", nombre: "A.5.3 Evaluación de Equidad", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Alto", impacto: "Alto", notas: "" },
  { id: 31, categoria: "A.6 Ciclo de Vida", nombre: "A.6.8 Gestión de Versiones", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Bajo", impacto: "Medio", notas: "" },
  { id: 32, categoria: "A.6 Ciclo de Vida", nombre: "A.6.9 Pruebas de Estrés", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Alto", impacto: "Alto", notas: "" },
  { id: 33, categoria: "A.6 Ciclo de Vida", nombre: "A.6.10 Red Teaming", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Alto", impacto: "Alto", notas: "" },
  { id: 34, categoria: "A.2 Políticas", nombre: "A.2.2 Código Ético de IA", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Bajo", impacto: "Bajo", notas: "" },
  { id: 35, categoria: "A.3 Organización", nombre: "A.3.2 Comité de Ética IA", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Medio", impacto: "Medio", notas: "" },
  { id: 36, categoria: "A.3 Organización", nombre: "A.3.3 Reporte de Incidentes", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Alto", impacto: "Alto", notas: "" },
  { id: 37, categoria: "A.10 Terceros", nombre: "A.10.4 Auditorías de Proveedor", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Medio", impacto: "Medio", notas: "" },
  { id: 38, categoria: "A.7 Datos", nombre: "A.7.5 Anonimización de Datos", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Crítico", impacto: "Alto", notas: "" }
];
