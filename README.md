# Sistema de Votaciones Universitario

Una aplicación web completa para gestionar elecciones estudiantiles en ambientes universitarios, desarrollada con HTML, CSS y JavaScript puro.

## 🗳️ Características Principales

### Para Estudiantes
- **Autenticación Segura**: Login con número de estudiante y contraseña
- **Interfaz Intuitiva**: Diseño moderno y fácil de usar
- **Votación Múltiple**: Participar en múltiples elecciones simultáneas
- **Confirmación de Voto**: Sistema de confirmación antes del envío
- **Visualización de Resultados**: Ver resultados en tiempo real tras votar
- **Prevención de Voto Doble**: Control automático para evitar votaciones duplicadas

### Para Administradores
- **Panel de Control**: Dashboard completo con estadísticas
- **Resultados en Tiempo Real**: Monitoreo live de la votación
- **Exportación de Datos**: Descarga de resultados en formato JSON
- **Estadísticas Detalladas**: Participación, total de votos, etc.
- **Visualización de Datos**: Gráficos y tablas interactivas

## 🚀 Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Estilos**: CSS Grid, Flexbox, Animaciones CSS
- **Iconos**: Font Awesome 6.0
- **Fuentes**: Google Fonts (Inter)
- **Almacenamiento**: LocalStorage para sesiones
- **Compatibilidad**: Diseño responsive para móviles y desktop

## 📁 Estructura del Proyecto

```
Votaciones-Universitario/
├── index.html              # Página principal
├── css/
│   └── styles.css          # Estilos principales
├── js/
│   ├── main.js            # Controlador principal
│   ├── auth.js            # Sistema de autenticación
│   ├── voting.js          # Sistema de votación
│   ├── admin.js           # Panel de administración
│   └── data.js            # Datos y configuración
└── README.md              # Este archivo
```

## 🔧 Instalación y Uso

### Requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (opcional, para desarrollo)

### Instalación
1. Clona o descarga el proyecto
2. Abre `index.html` en tu navegador
3. ¡Listo para usar!

### Para desarrollo local:
```bash
# Opción 1: Usar Python
python -m http.server 8000

# Opción 2: Usar Node.js con live-server
npx live-server

# Opción 3: Usar PHP
php -S localhost:8000
```

## 👥 Usuarios de Prueba

### Estudiantes
| Número de Estudiante | Contraseña | Estado |
|---------------------|------------|---------|
| 20220001 | 123456 | Sin votar |
| 20220002 | 123456 | Sin votar |
| 20220003 | 123456 | Ya votó |
| 20220004 | 123456 | Sin votar |
| 20220005 | 123456 | Sin votar |

### Administradores
| Usuario | Contraseña |
|---------|------------|
| admin | admin123 |

## 🗳️ Elecciones Configuradas

### 1. Presidente Estudiantil
- **María González** - Lista Azul (Progreso Estudiantil)
- **Carlos Rodríguez** - Lista Verde (Futuro Sostenible)  
- **Ana Martínez** - Lista Roja (Unión Estudiantil)

### 2. Vicepresidente Académico
- **Luis Herrera** - Lista Azul (Progreso Estudiantil)
- **Sofia Vargas** - Lista Verde (Futuro Sostenible)

### 3. Representante de Bienestar
- **Diego Morales** - Lista Roja (Unión Estudiantil)
- **Valentina López** - Lista Verde (Futuro Sostenible)
- **Alejandro Ruiz** - Lista Azul (Progreso Estudiantil)

## 🎨 Características de Diseño

### Interfaz de Usuario
- **Tema Moderno**: Gradientes y colores universitarios
- **Responsive**: Adaptado para móviles y tablets
- **Animaciones**: Transiciones suaves y feedback visual
- **Accesibilidad**: Soporte para lectores de pantalla
- **UX Optimizada**: Flujo intuitivo de votación

### Sistema de Navegación
- **Single Page Application**: Navegación sin recargas
- **Historial**: Soporte para botones de navegador
- **Estados**: Feedback visual para todas las acciones
- **Validación**: Validación en tiempo real de formularios

## 🔒 Seguridad

### Medidas Implementadas
- **Validación Frontend**: Validación de datos antes del envío
- **Sesiones Temporales**: Expiración automática de sesiones (24h)
- **Prevención de Fraude**: Control de voto único por estudiante
- **Validación de Formato**: Números de estudiante con formato específico
- **Escape de HTML**: Prevención de inyección de código

### Limitaciones (Simulado)
- Los datos se almacenan localmente (para demostración)
- No hay encriptación real de contraseñas
- Autenticación simulada (no conectada a base de datos real)

## 📊 Funcionalidades del Panel Admin

### Estadísticas en Tiempo Real
- Total de votos registrados
- Porcentaje de participación
- Número de elecciones activas
- Actualización automática cada 30 segundos

### Visualización de Resultados
- Tablas detalladas por elección
- Gráficos de barras por candidato
- Indicadores de ganadores
- Métricas de participación

### Exportación de Datos
- Descarga de resultados completos
- Formato JSON estructurado
- Incluye estadísticas y timestamps
- Datos listos para análisis posterior

## 🔧 Personalización

### Modificar Elecciones
Edita el archivo `js/data.js` para:
- Agregar/quitar elecciones
- Modificar candidatos
- Cambiar partidos políticos
- Actualizar descripciones

### Cambiar Estilos
Modifica `css/styles.css` para:
- Colores corporativos
- Tipografías personalizadas
- Layouts alternativos
- Temas adicionales

### Agregar Funcionalidades
Extiende los archivos JavaScript para:
- Nuevos tipos de votación
- Integraciones externas
- Reportes adicionales
- Funciones administrativas

## 📱 Compatibilidad

### Navegadores Soportados
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Opera 76+

### Dispositivos
- Desktop (1920x1080+)
- Laptop (1366x768+)
- Tablet (768x1024)
- Mobile (375x667+)

## 🚀 Mejoras Futuras

### Funcionalidades Pendientes
- [ ] Integración con bases de datos reales
- [ ] Sistema de autenticación robusto
- [ ] Notificaciones push
- [ ] Módulo de reportes avanzados
- [ ] API REST para integración
- [ ] Modo offline
- [ ] Autenticación biométrica
- [ ] Sistema de auditoría completo

### Optimizaciones Técnicas
- [ ] Service Workers para PWA
- [ ] Lazy loading de componentes
- [ ] Compresión de assets
- [ ] CDN para recursos estáticos
- [ ] Testing automatizado
- [ ] CI/CD pipeline

## 📞 Soporte

### Contacto
- **Email**: soporte@universidad.edu
- **Teléfono**: +57 (1) 234-5678
- **Sitio Web**: https://universidad.edu/votaciones

### Documentación Técnica
- Consulta el código fuente para implementación detallada
- Cada archivo JavaScript está ampliamente comentado
- Variables CSS personalizables en `:root`

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

*Desarrollado para promover la participación democrática estudiantil* 🎓