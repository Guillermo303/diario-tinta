# Diario & Tinta — prototipo en React

Diario personal **privado** para personas con posible depresión o deterioro de su salud mental.
No es una red social: la app es un **puente** entre la persona y la ayuda que necesita (IA para
desahogarse, psicólogos cercanos, contacto de confianza y líneas de crisis).

Hecho con **React 18 + Vite + Tailwind CSS + React Router**. Es un prototipo navegable: todo usa
datos de ejemplo en memoria y se reinicia al recargar; no hay servidor ni se envía nada.

## Pantallas

| Ruta          | Archivo                         | Qué hace |
|---------------|---------------------------------|----------|
| `/hoy`        | `src/pages/Hoy.jsx`             | Ánimo del día y semana, acceso a la IA, "Tú y tu terapeuta" (responder), psicólogos para ti y últimas páginas |
| `/psicologos` | `src/pages/PsicologosPage.jsx`  | Matchmaking: aviso de cambios, situación actual, mini mapa de México, recomendaciones con "¿Por qué?" y "ver otra opción", otras ayudas |
| `/hablar`     | `src/pages/Hablar.jsx`          | Desahogo con IA y 4 personalidades (Escucha, Compañía, Orden, Calma); temas detectados editables; si detecta riesgo, ofrece ayuda humana |
| `/escribir`   | `src/pages/Escribir.jsx`        | Chispa del día, página con etiquetas y privacidad (Solo yo / Mi terapeuta), lista con filtros |
| `/ajustes`    | `src/pages/Ajustes.jsx`         | Perfil, contacto de confianza, privacidad, escritura, avisos, tamaño de letra, datos |

### Acceso

| Ruta        | Archivo                | Qué hace |
|-------------|------------------------|----------|
| `/entrar`   | `src/pages/Acceso.jsx` | Pantalla de inicio (`/` abre aquí). Inicio de sesión; se elige "Busco apoyo" o "Soy psicólogo" y lleva a `/hoy` o a `/pro` |
| `/registro` | `src/pages/Acceso.jsx` | Registro con correo, nombre, teléfono y contraseña; la persona usuaria acepta el aviso de privacidad y el uso de datos de salud; el psicólogo agrega cédula, años de experiencia, ciudad, especialidades, experiencia y CV (PDF/Word). `?rol=psicologo` abre directo esa opción |

### Panel de psicólogos

| Ruta             | Archivo                        | Qué hace |
|------------------|--------------------------------|----------|
| `/pro`           | `src/pages/pro/Pacientes.jsx`  | Alertas priorizadas por la IA, solicitudes nuevas del matchmaking (aceptar o proponer horario), lista de pacientes y chat con cada uno, lo que compartió y resumen de la IA |
| `/pro/encargado` | `src/pages/pro/Encargado.jsx`  | Chat con su encargado de la red y pestañas de Contratación (alta y condiciones), Pagos (estado de cuenta y depósitos) y Ofertas de trabajo |

Se entra desde "¿Eres psicólogo? Abrir panel" (menú lateral o Ajustes). Datos en `src/data/pro.js`.

Siempre visible: botón **Ayuda ahora** con Línea de la Vida (800 911 2000), 911 y aviso al contacto de confianza.

## Estructura

```
src/
  main.jsx            rutas
  estado.jsx          estado compartido en memoria (páginas, mensajes, ánimo, letra)
  index.css           estilos base y componentes de Tailwind
  data/ejemplo.js     datos de ejemplo (psicólogos, personalidades, páginas…)
  data/mapa.js        contorno de México (Natural Earth, dominio público)
  components/         Layout (navegación y crisis), Psicologos (mapa y tarjeta), ui (piezas pequeñas)
  pages/              una pantalla por archivo
tailwind.config.js    sistema visual "Sereno" (colores y tipografía)
```

## Cómo verlo

    npm install
    npm run dev

y entra a http://localhost:5173. Para la versión de producción: `npm run build` (sale en `dist/`).

## Notas
- La versión anterior en HTML estático (estilo "Cuaderno & Tinta") está en el historial de git,
  commit `83e4552`.
- Para producción harían falta autenticación, cifrado y un backend que cumpla la normativa de
  datos de salud (en México, la LFPDPPP trata la salud como dato personal sensible).
- Psicólogos, terapeuta y usuaria son personas inventadas para el prototipo.

## Publicación en Render
`render.yaml` compila con `npm ci && npm run build`, publica `dist/` y redirige todas las rutas a
la app. Las direcciones viejas (`pensar.html`, `hablar.html`, etc.) redirigen a las nuevas.
Cada `git push` a `main` vuelve a publicar.
