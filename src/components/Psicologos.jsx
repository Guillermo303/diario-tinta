import { useState } from 'react';
import { Avatar, Chip, Icono } from './ui';
import { CIUDADES, MEXICO_PATH } from '../data/mapa';
import { TERAPEUTA } from '../data/ejemplo';

const COLOR_PIN = { 'bg-primario': '#1f6f6b', 'bg-azul': '#3b6c9e', 'bg-lila': '#6a5fa8', 'bg-ambar': '#9a6510', 'bg-exito': '#2f7a4d' };
// El mapa se acerca al centro y norte del país, donde están la persona y sus psicólogos.
const VISTA = { x: 120, y: 66, w: 160, h: 132 };
const k = VISTA.w / 400; // escala de los marcadores respecto al mapa completo
// Separación para que Torreón y Gómez Palacio (ciudades vecinas) no se encimen.
const AJUSTE = { torreon: [6, -9], gomez: [-10, -3], saltillo: [0, 5] };
// Dónde va la etiqueta de cada ciudad para que no choquen entre sí.
const ETIQUETA = { torreon: 'arriba', gomez: 'izq', saltillo: 'abajo' };
const corto = n => n.replace(/^(Psic\.|Mtra\.)\s*/, '').split(' ').slice(0, 2).map((w, i) => (i ? w[0] + '.' : w)).join(' ');

export function MapaMexico({ psicologos, seleccionado, onSeleccionar }) {
  const tu = CIUDADES.torreon;
  const ter = CIUDADES[TERAPEUTA.ciudad];
  const pin = 11 * k;
  return (
    <figure className="tarjeta overflow-hidden p-0">
      <svg viewBox={`${VISTA.x} ${VISTA.y} ${VISTA.w} ${VISTA.h}`} className="block h-auto w-full bg-[#eaf2f2]" role="img"
        aria-label={`Mapa: tú estás en ${tu.nombre}. Psicólogos en ${psicologos.map(p => CIUDADES[p.ciudad].nombre).join(', ')}. Tu terapeuta está en ${ter.nombre}.`}>
        <path d={MEXICO_PATH} fill="#ffffff" stroke="#c9d8d8" strokeWidth={1.4 * k} strokeLinejoin="round" />
        <circle cx={tu.x} cy={tu.y} r={34 * k} fill="#1f6f6b" fillOpacity=".07" stroke="#1f6f6b" strokeOpacity=".35" strokeWidth={1.2 * k} strokeDasharray={`${4 * k} ${4 * k}`} />
        <text x={tu.x} y={tu.y - 36 * k} textAnchor="middle" fontSize={9 * k} fill="#1f6f6b" fontWeight="700" fontFamily="Manrope, sans-serif">La Laguna</text>

        {psicologos.map((p, i) => {
          const c = CIUDADES[p.ciudad]; const [dx, dy] = (AJUSTE[p.ciudad] || [0, 0]).map(v => v * k * 2.2);
          const x = c.x + dx, y = c.y + dy, sel = seleccionado === p.id, color = COLOR_PIN[p.color];
          const lado = ETIQUETA[p.ciudad] || 'der';
          return (
            <g key={p.id} onClick={() => onSeleccionar?.(p.id)} className="cursor-pointer">
              {sel && <line x1={tu.x} y1={tu.y} x2={x} y2={y} stroke={color} strokeWidth={2 * k} strokeDasharray={`${4 * k} ${3 * k}`} />}
              <circle cx={x} cy={y} r={sel ? pin * 1.25 : pin} fill={color} stroke="#fff" strokeWidth={2.5 * k} />
              <text x={x} y={y + 3.6 * k} textAnchor="middle" fontSize={10 * k} fontWeight="800" fill="#fff" fontFamily="Manrope, sans-serif">{i + 1}</text>
              {(() => {
                const pos = { izq: [x - pin - 3 * k, y, 'end'], der: [x + pin + 3 * k, y, 'start'], arriba: [x, y - pin - 13 * k, 'middle'], abajo: [x, y + pin + 9 * k, 'middle'] }[lado];
                return (
                  <g transform={`translate(${pos[0]} ${pos[1]})`}>
                    <text textAnchor={pos[2]} y={-1 * k} fontSize={10 * k} fontWeight="800" fill="#132a2c" stroke="#fff" strokeWidth={3 * k} paintOrder="stroke" fontFamily="Manrope, sans-serif">{corto(p.nombre)}</text>
                    <text textAnchor={pos[2]} y={9 * k} fontSize={8 * k} fill="#56696b" stroke="#fff" strokeWidth={3 * k} paintOrder="stroke" fontFamily="Manrope, sans-serif">{c.nombre} · ★ {p.estrellas}</text>
                  </g>
                );
              })()}
            </g>
          );
        })}

        <g>
          <circle cx={ter.x} cy={ter.y} r={pin} fill="#132a2c" stroke="#fff" strokeWidth={2.5 * k} />
          <text x={ter.x} y={ter.y + 3.2 * k} textAnchor="middle" fontSize={8 * k} fontWeight="800" fill="#fff" fontFamily="Manrope, sans-serif">{TERAPEUTA.iniciales}</text>
          <text x={ter.x + pin + 3 * k} y={ter.y + 3 * k} fontSize={9 * k} fill="#56696b" fontFamily="Manrope, sans-serif">Tu terapeuta · {ter.nombre}</text>
        </g>
        <circle cx={tu.x} cy={tu.y} r={6 * k} fill="#b3261e" stroke="#fff" strokeWidth={2.5 * k} />
        <text x={tu.x + 4 * k} y={tu.y + 19 * k} textAnchor="middle" fontSize={10 * k} fontWeight="800" fill="#b3261e" fontFamily="Manrope, sans-serif">Tú</text>
      </svg>
      <figcaption className="flex flex-wrap gap-x-4 gap-y-1 px-4 py-2.5 text-[12px] font-semibold text-gris">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-alerta" /> Tú</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-primario" /> Psicólogos recomendados</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-tinta" /> Tu terapeuta actual</span>
        <span className="ml-auto text-tenue">Toca un punto para ver su reseña</span>
      </figcaption>
    </figure>
  );
}

const Estrellas = ({ valor }) => (
  <span className="flex items-center gap-0.5 text-ambar" aria-label={`${valor} de 5 estrellas`}>
    {[1, 2, 3, 4, 5].map(i => <Icono key={i} nombre="star" lleno={valor >= i - 0.25} className="text-[14px]" />)}
  </span>
);

// Reseña compacta: lo esencial a la vista y el resto al desplegar.
export function Resena({ p, n, seleccionado, onSeleccionar, onOtra, onAgendar }) {
  const [abierta, setAbierta] = useState(false);
  return (
    <li className={`rounded-2xl border bg-superficie transition ${seleccionado ? 'border-primario/50 shadow-tarjeta' : 'border-linea/70'}`}>
      <div className="flex items-center gap-3 p-3" onMouseEnter={() => onSeleccionar?.(p.id)}>
        <div className="relative">
          <Avatar iniciales={p.iniciales} color={p.color} tam="w-10 h-10 text-[13px]" />
          <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-superficie bg-tinta text-[9px] font-extrabold text-white">{n}</span>
        </div>
        <button type="button" onClick={() => { setAbierta(v => !v); onSeleccionar?.(p.id); }} aria-expanded={abierta} className="min-w-0 flex-1 text-left">
          <span className="block truncate font-bold">{p.nombre}</span>
          <span className="flex items-center gap-1.5 text-[12px] text-gris">
            <Estrellas valor={p.estrellas} /> <b className="text-tinta">{p.estrellas}</b> · {p.resenas} reseñas · {p.distancia}
          </span>
        </button>
        <span className="hidden sm:block rounded-full bg-primario-suave px-2 py-0.5 text-[12px] font-extrabold text-primario-oscuro">{p.compat}%</span>
        <button type="button" onClick={() => onAgendar?.(p)} className={`${n === 1 ? 'boton-primario' : 'boton-suave'} !px-3 !py-1.5 text-[13px]`} aria-label={`Hablar 15 minutos con ${p.nombre}`}>
          <Icono nombre="videocam" className="text-[17px]" /><span className="hidden sm:inline">15 min</span>
        </button>
      </div>
      <p className="mx-3 mb-3 -mt-1 border-l-2 border-linea pl-3 text-[13px] italic text-gris">“{p.resena.texto}” <span className="not-italic text-tenue">— {p.resena.autor}</span></p>
      {abierta && (
        <div className="aparece flex flex-col gap-2.5 border-t border-linea px-3 py-3">
          <p className="text-[14px]"><b>En qué te puede ayudar:</b> {p.ayuda}</p>
          <div className="flex flex-wrap gap-1.5">{p.enfoques.map(e => <Chip key={e} className="!py-0.5 !text-[12px]">{e}</Chip>)}</div>
          <p className="text-[13px] text-gris">{p.lugar} · {p.modo} · <b className="text-tinta">${p.precio}</b> por sesión · Libre: {p.libre}</p>
          <div className="rounded-xl bg-suave/70 p-2.5">
            <p className="text-[12px] font-bold text-gris">Por qué te lo recomendamos</p>
            <ul className="list-disc pl-5 text-[13px] text-gris">{p.razones.map(r => <li key={r}>{r}</li>)}</ul>
          </div>
          {onOtra && <button type="button" onClick={() => onOtra(p.id)} className="self-start text-[13px] font-bold text-gris underline hover:text-tinta">No me convence: ver otra opción</button>}
        </div>
      )}
    </li>
  );
}
