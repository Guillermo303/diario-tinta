# Diario & Tinta — prototipo web

Diario personal **privado** para personas en terapia psicológica. No es una red social:
no hay perfiles públicos, amigos, mapas ni mensajes entre usuarios. La única otra persona
en la app es la terapeuta, y solo ve lo que el usuario decide compartir.

| Archivo        | Pantalla                                                     |
|----------------|--------------------------------------------------------------|
| `index.html`   | Diario (pliego izquierdo) y registro de ánimo privado (derecho) |
| `pensar.html`  | Escribir páginas; cada una es "Solo yo" o "Mi terapeuta"     |
| `chats.html`   | Terapia: canal confidencial con la terapeuta + líneas de crisis |
| `ajustes.html` | Escritura, privacidad y confidencialidad, avisos, papel, datos |
| `img/`         | Foto de perfil                                               |

## Cómo verlo
Abre `index.html` en el navegador, o sirve la carpeta:

    python -m http.server 5500

y entra a http://localhost:5500

## Notas
- Usa Tailwind por CDN; colores y tipografías del sistema "Cuaderno & Tinta" están en el
  bloque `tailwind.config` dentro del `<head>` de cada página.
- Todo se guarda en `localStorage` del navegador (solo en ese dispositivo):
  `dt-paginas`, `dt-borrador`, `dt-animo`, `dt-terapia`, `dt-ajustes`.
- Es un prototipo: no hay servidor. Los mensajes a la terapeuta no se envían a nadie todavía,
  y "PIN" o "cerrar sesión por inactividad" solo se guardan como preferencia.
- Para producción harían falta autenticación, cifrado y un backend que cumpla la normativa de
  datos de salud (en México, la LFPDPPP trata la salud como dato personal sensible).
- La terapeuta "Psic. Elena Ruiz" y su agenda son datos de ejemplo.

## Publicación en Render
Sitio estático: Render sirve la carpeta raíz tal cual (sin paso de compilación).
La configuración está en `render.yaml`. Cada `git push` a `main` vuelve a publicar.
