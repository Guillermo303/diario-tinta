import { useState } from 'react';
import { Avatar, Chip, Icono } from './ui';
import { CIUDADES, MEXICO_PATH } from '../data/mapa';
import { TERAPEUTA } from '../data/ejemplo';

const COLOR_PIN = { 'bg-primario': '#1f6f6b', 'bg-azul': '#3b6c9e', 'bg-lila': '#6a5fa8', 'bg-ambar': '#9a6510', 'bg-exito': '#2f7a4d' };
// Pequeño desplazamiento para que Torreón y Gómez Palacio no se encimen.
const AJUSTE = { torreon: [10, -8], gomez: [-10, -6] };

export function MapaMexico({ psicologos, seleccionado, onSeleccionar }) {
  const tu = CIUDADES.torreon;
  const ter = CIUDADES[TERAPEUTA.ciudad];
  return (
    <figure className="rounded-2xl bg-suave/70 p-3">
      <svg viewBox="0 0 400 260" className="h-auto w-full" role="img"
        aria-label={`Mapa de México: tú estás en ${tu.nombre}. Psicólogos en ${psicologos.map(p => CIUDADES[p.ciudad].nombre).join(', ')}. Tu terapeuta está en ${ter.nombre}.`}>
        <path d={MEXICO_PATH} fill="#ffffff" stroke="#c9d8d8" strokeWidth="1.2" strokeLinejoin="round" />
        <circle cx={tu.x} cy={tu.y} r="20" fill="#1f6f6b" fillOpacity=".07" stroke="#1f6f6b" strokeOpacity=".3" strokeDasharray="3 3" />
        {psicologos.map((p, i) => {
          const c = CIUDADES[p.ciudad]; const [dx, dy] = AJUSTE[p.ciudad] || [0, 0];
          const x = c.x + dx, y = c.y + dy, sel = seleccionado === p.id;
          return (
            <g key={p.id} onClick={() => onSeleccionar?.(p.id)} className="cursor-pointer">
              {sel && <line x1={tu.x} y1={tu.y} x2={x} y2={y} stroke={COLOR_PIN[p.color]} strokeWidth="1.5" strokeDasharray="3 3" />}
              <circle cx={x} cy={y} r={sel ? 10 : 8} fill={COLOR_PIN[p.color]} stroke="#fff" strokeWidth="2" />
              <text x={x} y={y + 3.3} textAnchor="middle" fontSize="9" fontWeight="800" fill="#fff" fontFamily="Manrope, sans-serif">{i + 1}</text>
              {!AJUSTE[p.ciudad] && <text x={x + 13} y={y + 3.5} fontSize="10" fill="#56696b" fontFamily="Manrope, sans-serif">{c.nombre}</text>}
            </g>
          );
        })}
        <g>
          <circle cx={ter.x} cy={ter.y} r="9" fill="#132a2c" stroke="#fff" strokeWidth="2" />
          <text x={ter.x} y={ter.y + 3} textAnchor="middle" fontSize="7.5" fontWeight="800" fill="#fff" fontFamily="Manrope, sans-serif">{TERAPEUTA.iniciales}</text>
          <text x={ter.x + 13} y={ter.y + 3.5} fontSize="10" fill="#56696b" fontFamily="Manrope, sans-serif">{ter.nombre}</text>
        </g>
        <circle cx={tu.x} cy={tu.y} r="5" fill="#b3261e" stroke="#fff" strokeWidth="2" />
        <text x={tu.x - 8} y={tu.y + 22} textAnchor="end" fontSize="10.5" fontWeight="800" fill="#132a2c" fontFamily="Manrope, sans-serif">Tú · {tu.nombre}</text>
      </svg>
      <figcaption className="flex flex-wrap gap-x-4 gap-y-1 px-1 text-[12px] font-semibold text-gris">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-alerta" /> Tú</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-primario" /> Psicólogos recomendados</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-tinta" /> Tu terapeuta actual</span>
      </figcaption>
    </figure>
  );
}

export function TarjetaPsicologo({ p, n, seleccionado, onSeleccionar, onOtra, onAgendar }) {
  const [porque, setPorque] = useState(false);
  return (
    <li className={`aparece tarjeta p-4 md:p-5 flex flex-col gap-3 transition ${seleccionado ? 'ring-2 ring-primario/40' : ''}`} onMouseEnter={() => onSeleccionar?.(p.id)}>
      <div className="flex items-start gap-3">
        <div className="relative">
          <Avatar iniciales={p.iniciales} color={p.color} />
          <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-superficie bg-tinta text-[10px] font-extrabold text-white">{n}</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-bold">{p.nombre}</p>
          <p className="flex items-center gap-1 text-[13px] text-gris"><Icono nombre="location_on" className="text-[16px]" />{p.lugar} · {p.distancia}</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-extrabold leading-none text-primario">{p.compat}%</p>
          <p className="text-[11px] font-semibold text-gris">compatible</p>
        </div>
      </div>

      <div className="rounded-xl bg-primario-suave/60 px-3.5 py-2.5">
        <p className="etiqueta !text-primario-oscuro">En qué te puede ayudar</p>
        <p className="mt-0.5 text-[14px]">{p.ayuda}</p>
      </div>

      <div className="flex flex-wrap gap-1.5">{p.enfoques.map(e => <Chip key={e} className="!py-1 !text-[12px]">{e}</Chip>)}</div>

      <div>
        <button type="button" onClick={() => setPorque(v => !v)} aria-expanded={porque} className="flex items-center gap-1 text-[13px] font-bold text-primario">
          <Icono nombre="help" className="text-[17px]" /> ¿Por qué me lo recomiendan?
          <Icono nombre="expand_more" className={`text-[18px] transition-transform ${porque ? 'rotate-180' : ''}`} />
        </button>
        {porque && (
          <div className="aparece mt-2 rounded-xl border border-linea p-3">
            <ul className="list-disc pl-5 text-[13px] text-gris space-y-0.5">{p.razones.map(r => <li key={r}>{r}</li>)}</ul>
            {onOtra && <button type="button" onClick={() => onOtra(p.id)} className="mt-2 text-[13px] font-bold text-gris underline hover:text-tinta">No me convence: ver otra opción</button>}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-linea pt-3">
        <p className="text-[13px] text-gris">{p.modo} · <b className="text-tinta">${p.precio}</b>/sesión · Libre: {p.libre}</p>
        <button type="button" onClick={() => onAgendar?.(p)} className={n === 1 ? 'boton-primario' : 'boton-suave'}>
          <Icono nombre="videocam" className="text-[18px]" /> Llamada de 15 min
        </button>
      </div>
    </li>
  );
}
