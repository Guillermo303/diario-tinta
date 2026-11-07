# Diario & Tinta — prototipo web

Exportado desde el proyecto de Stitch "Diario Interactivo con Mapa".

| Archivo      | Pantalla de Stitch                          |
|--------------|---------------------------------------------|
| `index.html` | Diario Abierto & Mapa de Amigos (inicio)    |
| `mapa.html`  | Pliego Derecho - Mapa de México & Amigos    |
| `chats.html` | Chats Anteriores - Cartas Manuscritas       |
| `pensar.html`| Pensamientos (diseñada a mano, mismo estilo) |
| `ajustes.html`| Ajustes (diseñada a mano, mismo estilo)     |
| `img/`       | Fotos descargadas localmente                |

## Cómo verlo
Abre `index.html` en el navegador, o sirve la carpeta:

    python -m http.server 5500

y entra a http://localhost:5500

## Notas
- Usa Tailwind por CDN; los colores y tipografías del sistema "Cuaderno & Tinta"
  están en el bloque `tailwind.config` dentro del `<head>` de cada página.
- Navegación inferior conectada: Diario, Pensar, Amigos (mapa), Chats y Ajustes. El avatar de la cabecera también abre Ajustes.
- Todo se guarda en `localStorage` del navegador: `dt-paginas`, `dt-borrador` (Pensar) y `dt-ajustes` (Ajustes).
- Ajustes que ya afectan al sitio: tamaño de letra (todas las páginas), tinta predeterminada y chispa del día (Pensar). El resto se guarda pero aún no cambia nada (no hay servidor).
- El logo original era un recurso privado de Stitch; se reemplazó por un ícono.

## Mapa (mapa.html)
- Contorno y 32 estados reales de México, generados de datos geográficos
  (proyección equirectangular corregida a 23° N) e incrustados como SVG.
- Los pines se colocan por latitud/longitud con la misma proyección (`PROY` en el script).
- Tocar un amigo acerca el mapa y abre su tarjeta postal; buscar por nombre, ciudad o estado;
  filtros funcionales. Respeta "Aparecer en el mapa" y la ciudad de Ajustes.
- Para agregar un amigo: añade un objeto al arreglo `AMIGOS` con `lat`, `lon` y `estado` (slug).

## Publicación en Render
Sitio estático: Render sirve la carpeta raíz tal cual (sin paso de compilación).
La configuración está en `render.yaml`. Cada `git push` a `main` vuelve a publicar.
