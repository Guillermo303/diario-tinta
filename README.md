# Diario & Tinta — prototipo web

Diario personal **privado** para personas en terapia psicológica. No es una red social:
no hay perfiles públicos, amigos, mapas de otros usuarios ni mensajes entre usuarios. La única otra persona
en la app es la terapeuta, y solo ve lo que el usuario decide compartir.

| Archivo        | Pantalla                                                     |
|----------------|--------------------------------------------------------------|
| `index.html`   | El libro: página izquierda **Mi diario** (ánimo, escribir, resumen de "Tú y tu terapeuta", últimas páginas) y derecha **Psicólogos para ti** (recomendaciones compatibles, mini mapa de México y en qué ayuda cada uno). En móvil se pasa de página con las cintas; `#psicologos` abre la derecha |
| `hablar.html`  | Desahogo con IA: 4 personalidades (Escucha, Compañía, Orden, Calma), charla de ejemplo y temas detectados que alimentan las recomendaciones de psicólogos |
| `pensar.html`  | Escribir páginas; cada una es "Solo yo" o "Mi terapeuta"     |
| `chats.html`   | Redirección a `index.html` (enlaces antiguos) |
| `ajustes.html` | Escritura, privacidad y confidencialidad, avisos, papel, datos |
| `img/`         | Foto de perfil                                               |

## Cómo verlo
Abre `index.html` en el navegador, o sirve la carpeta:

    python -m http.server 5500

y entra a http://localhost:5500

## Notas
- Usa Tailwind por CDN; colores y tipografías del sistema "Cuaderno & Tinta" están en el
  bloque `tailwind.config` dentro del `<head>` de cada página.
- **Son plantillas de diseño estáticas**: no hay JavaScript de la app. Botones, formularios e
  interruptores son solo visuales y el contenido es de ejemplo fijo. Lo único "vivo" es pasar
  de página en móvil (Mi diario ↔ Terapia), hecho solo con CSS (`:target`).
- La versión con lógica funcional (guardar en `localStorage`, enviar mensajes, filtros) está
  en el historial de git, en el commit `3e49889`, por si se retoma la programación.
- Para producción harían falta autenticación, cifrado y un backend que cumpla la normativa de
  datos de salud (en México, la LFPDPPP trata la salud como dato personal sensible).
- La terapeuta "Psic. Elena Ruiz" y su agenda son datos de ejemplo.

## Publicación en Render
Sitio estático: Render sirve la carpeta raíz tal cual (sin paso de compilación).
La configuración está en `render.yaml`. Cada `git push` a `main` vuelve a publicar.
