import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../estado';
import { Avatar, Chip, Icono, fechaCorta, useAviso } from '../components/ui';
import { ANIMOS, PSICOLOGOS, SITUACION, TERAPEUTA, USUARIA } from '../data/ejemplo';

const saludo = () => { const h = new Date().getHours(); return h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches'; };

function Animo() {
  const { semana, animoHoy, setAnimoHoy } = useApp();
  const aviso = useAviso();
  const [elegido, setElegido] = useState(animoHoy?.animo ?? null);
  const [nota, setNota] = useState(animoHoy?.nota ?? '');
  const [compartir, setCompartir] = useState(animoHoy?.compartido ?? false);
  const dias = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
  const registros = [...semana, animoHoy?.animo ?? null];

  const guardar = () => {
    if (!elegido) return aviso('Elige primero cómo te sientes');
    setAnimoHoy({ animo: elegido, nota, compartido: compartir });
    aviso(compartir ? 'Guardado y visible para tu terapeuta' : 'Guardado solo para ti');
  };

  return (
    <section className="tarjeta p-5 flex flex-col gap-4" aria-labelledby="t-animo">
      <div className="flex items-center justify-between gap-2">
        <h2 id="t-animo" className="text-lg font-extrabold">¿Cómo te sientes hoy?</h2>
        <span className="flex items-center gap-1 text-[12px] font-semibold text-gris"><Icono nombre="lock" className="text-[14px]" /> Solo para ti</span>
      </div>
      <div role="radiogroup" aria-label="Estado de ánimo" className="grid grid-cols-5 gap-2">
        {ANIMOS.map(a => {
          const on = elegido === a.id;
          return (
            <button key={a.id} type="button" role="radio" aria-checked={on} onClick={() => setElegido(a.id)}
              className={`flex flex-col items-center gap-1 rounded-2xl border-2 py-2.5 transition ${on ? 'border-primario bg-primario-suave/50' : 'border-transparent bg-suave hover:bg-linea/60'}`}>
              <span className={`flex h-10 w-10 items-center justify-center rounded-full text-xl ${a.color}`}>{a.emoji}</span>
              <span className="text-[11px] font-bold">{a.txt}</span>
            </button>
          );
        })}
      </div>
      <label className="flex flex-col gap-1">
        <span className="sr-only">Nota opcional</span>
        <textarea rows="2" value={nota} onChange={e => setNota(e.target.value)} maxLength={280} placeholder="¿Quieres anotar algo más? (opcional)" className="campo resize-none" />
      </label>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex cursor-pointer items-center gap-2 text-[14px] font-semibold text-gris">
          <input type="checkbox" checked={compartir} onChange={e => setCompartir(e.target.checked)} className="h-4 w-4 rounded border-linea text-primario accent-primario" />
          Compartir con mi terapeuta
        </label>
        <button type="button" onClick={guardar} className="boton-primario">Guardar</button>
      </div>
      <div className="rounded-2xl bg-suave/70 p-3">
        <div className="mb-2 flex items-center justify-between px-1">
          <span className="text-[13px] font-bold">Tu semana</span>
          <span className="text-[12px] text-gris">Últimos 7 días</span>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {registros.map((id, i) => {
            const d = new Date(); d.setDate(d.getDate() - (6 - i));
            const a = ANIMOS.find(x => x.id === id);
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="text-[11px] font-bold text-gris">{dias[d.getDay()]}</span>
                <span title={a ? a.txt : 'Sin registro'} className={`flex h-9 w-9 items-center justify-center rounded-full text-base ${a ? a.color : 'border border-dashed border-tenue/60'} ${i === 6 ? 'ring-2 ring-primario/30' : ''}`}>{a?.emoji}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Terapeuta() {
  const { mensajes, enviarATerapeuta } = useApp();
  const aviso = useAviso();
  const [texto, setTexto] = useState('');
  const ultimos = mensajes.slice(-2);
  const enviar = e => { e.preventDefault(); if (!texto.trim()) return; enviarATerapeuta(texto.trim()); setTexto(''); aviso('Mensaje enviado a Elena (ejemplo)'); };
  return (
    <section className="tarjeta p-5 flex flex-col gap-3" aria-labelledby="t-terapeuta">
      <div className="flex items-center gap-3">
        <Avatar iniciales={TERAPEUTA.iniciales} color="bg-tinta" />
        <div className="min-w-0 flex-1">
          <h2 id="t-terapeuta" className="etiqueta">Tú y tu terapeuta</h2>
          <p className="font-bold">{TERAPEUTA.nombre}</p>
        </div>
        <div className="text-right">
          <p className="text-[12px] text-gris">Próxima sesión</p>
          <p className="text-[13px] font-bold text-primario">Jue 13 nov · {TERAPEUTA.sesion.hora}</p>
        </div>
      </div>
      <ol className="flex flex-col gap-2" aria-label="Últimos mensajes">
        {ultimos.map((m, i) => (
          <li key={i} className={`aparece flex flex-col max-w-[88%] ${m.de === 'yo' ? 'self-end items-end' : 'self-start items-start'}`}>
            <p className={`rounded-2xl px-3.5 py-2 text-[14px] ${m.de === 'yo' ? 'rounded-br-md bg-primario text-white' : 'rounded-bl-md bg-suave'}`}>{m.texto}</p>
            <span className="mt-0.5 flex items-center gap-1 px-1 text-[11px] text-tenue">
              {m.nuevo && <span className="h-1.5 w-1.5 rounded-full bg-alerta" />}{m.de === 'yo' ? 'Tú' : 'Elena'} · {fechaCorta(m.fecha)}
            </span>
          </li>
        ))}
      </ol>
      <form onSubmit={enviar} className="flex items-center gap-2">
        <label htmlFor="t-respuesta" className="sr-only">Responder a Elena</label>
        <input id="t-respuesta" value={texto} onChange={e => setTexto(e.target.value)} placeholder="Responder a Elena…" className="campo !rounded-full !py-2" />
        <button type="submit" disabled={!texto.trim()} aria-label="Enviar" className="boton-primario !h-10 !w-10 !p-0 flex-shrink-0"><Icono nombre="send" className="text-[18px]" /></button>
      </form>
    </section>
  );
}

function Recientes() {
  const { paginas } = useApp();
  return (
    <section className="flex flex-col gap-2" aria-labelledby="t-recientes">
      <div className="flex items-center justify-between px-1">
        <h2 id="t-recientes" className="etiqueta">Tus últimas notas</h2>
        <Link to="/escribir" className="text-[13px] font-bold text-primario hover:underline">Ver todas</Link>
      </div>
      <ul className="flex flex-col gap-2">
        {paginas.slice(0, 3).map(p => (
          <li key={p.id}>
            <Link to="/escribir" className="tarjeta flex items-start gap-3 p-3.5 hover:border-primario/30">
              <Icono nombre={p.priv === 'terapeuta' ? 'psychology' : 'lock'} className={`mt-0.5 text-[20px] ${p.priv === 'terapeuta' ? 'text-primario' : 'text-tenue'}`} />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-bold">{p.titulo || 'Sin título'}</span>
                <span className="block truncate text-[13px] text-gris">{p.texto}</span>
              </span>
              <span className="text-[12px] text-tenue">{fechaCorta(p.fecha)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function PsicologosResumen() {
  const p = PSICOLOGOS[0];
  return (
    <section className="tarjeta p-5 flex flex-col gap-4" aria-labelledby="t-para-ti">
      <div className="flex items-center justify-between gap-2">
        <h2 id="t-para-ti" className="text-lg font-extrabold">Psicólogos para ti</h2>
        <span className="flex items-center gap-1 rounded-full bg-primario-suave px-2.5 py-1 text-[12px] font-bold text-primario-oscuro"><Icono nombre="autorenew" className="text-[15px]" /> Actualizado hoy</span>
      </div>
      <div>
        <p className="mb-2 text-[13px] font-semibold text-gris">Según tu diario de esta semana</p>
        <div className="flex flex-wrap gap-1.5">{SITUACION.map(s => <Chip key={s.txt} icono={s.icono}>{s.txt}</Chip>)}</div>
      </div>
      <div className="rounded-2xl border border-linea p-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Avatar iniciales={p.iniciales} color={p.color} />
          <div className="min-w-0 flex-1">
            <p className="font-bold">{p.nombre}</p>
            <p className="text-[13px] text-gris">{p.lugar} · {p.distancia}</p>
          </div>
          <p className="text-xl font-extrabold text-primario">{p.compat}%</p>
        </div>
        <p className="text-[14px] text-gris">{p.ayuda}</p>
      </div>
      <ul className="flex flex-col gap-1.5">
        {PSICOLOGOS.slice(1).map(o => (
          <li key={o.id} className="flex items-center gap-3 text-[14px]">
            <Avatar iniciales={o.iniciales} color={o.color} tam="w-8 h-8 text-[11px]" />
            <span className="flex-1 truncate"><b>{o.nombre}</b> <span className="text-gris">· {o.lugar}</span></span>
            <span className="font-bold text-gris">{o.compat}%</span>
          </li>
        ))}
      </ul>
      <Link to="/psicologos" className="boton-suave self-start">Ver mapa y opciones <Icono nombre="arrow_forward" className="text-[18px]" /></Link>
    </section>
  );
}

export default function Hoy() {
  const fecha = new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <span className="etiqueta capitalize">{fecha}</span>
        <h1 className="text-[26px] md:text-[32px] font-extrabold leading-tight">{saludo()}, {USUARIA.nombre}</h1>
        <p className="text-gris">Este es tu espacio. Nadie más lo ve, salvo lo que tú decidas compartir.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="flex flex-col gap-5">
          <Animo />
          <Terapeuta />
        </div>
        <div className="flex flex-col gap-5">
          <PsicologosResumen />
          <Link to="/escribir" className="tarjeta flex items-center gap-4 p-5 hover:border-primario/30">
            <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-azul-suave text-azul"><Icono nombre="edit_note" className="text-[26px]" /></span>
            <span className="min-w-0 flex-1">
              <span className="block font-extrabold">Escribir una nota</span>
              <span className="block text-[14px] text-gris">Escríbela o grábala con tu voz; tu acompañante te responde.</span>
            </span>
            <Icono nombre="arrow_forward" className="text-gris" />
          </Link>
          <Recientes />
        </div>
      </div>
    </div>
  );
}
