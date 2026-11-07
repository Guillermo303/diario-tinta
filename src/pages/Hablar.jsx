import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Chip, Encabezado, Icono, Interruptor } from '../components/ui';
import { useApp } from '../estado';
import { PERSONALIDADES, PSICOLOGOS, TEMAS_CHARLA } from '../data/ejemplo';

function Respiracion() {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-exito-suave px-3.5 py-2.5">
      <span className="relative flex h-12 w-12 items-center justify-center" aria-hidden="true">
        <span className="respira absolute inset-0 rounded-full bg-exito/25" />
        <span className="relative h-4 w-4 rounded-full bg-exito" />
      </span>
      <span><span className="block font-bold">Respiración 4 · 4 · 6</span><span className="block text-[13px] text-gris">Sigue el círculo: crece al inhalar, se queda, baja al exhalar</span></span>
    </div>
  );
}

export default function Hablar() {
  const { setCrisisAbierta } = useApp();
  const [modo, setModo] = useState('calma');
  const [extra, setExtra] = useState({}); // mensajes nuevos por personalidad
  const [texto, setTexto] = useState('');
  const [temas, setTemas] = useState(TEMAS_CHARLA);
  const [usar, setUsar] = useState(true);
  const fin = useRef(null);
  const p = PERSONALIDADES.find(x => x.id === modo);
  const charla = [...p.charla, ...(extra[modo] || [])];

  useEffect(() => { fin.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }, [charla.length]);

  const enviar = e => {
    e.preventDefault();
    const t = texto.trim(); if (!t) return;
    const riesgo = /(morir|matarme|no quiero vivir|hacerme daño|suicid)/i.test(t);
    const respuesta = riesgo
      ? { de: 'ia', texto: 'Lo que escribes me importa mucho. Voy a dejar a un lado mi personalidad: ahora mismo lo más importante es que hables con una persona.', crisis: true }
      : { de: 'ia', texto: p.respuesta };
    setExtra(x => ({ ...x, [modo]: [...(x[modo] || []), { de: 'yo', texto: t }, respuesta] }));
    setTexto('');
  };

  return (
    <div className="flex flex-col gap-6">
      <Encabezado etiqueta="Desahogo con IA" titulo="¿Quieres hablarlo?">
        Elige cómo quieres que te acompañe. Es una IA, no una psicóloga: si lo necesitas, te conecta con una persona.
      </Encabezado>

      <div className="flex items-start gap-2.5 rounded-2xl bg-azul-suave px-4 py-3 text-[14px]">
        <Icono nombre="tips_and_updates" className="text-[20px] text-azul" />
        <p>Son las 23:40 y hoy marcaste <b>ansiedad</b>: te sugerimos <b>Calma</b>. Puedes cambiarla cuando quieras.</p>
      </div>

      <div role="radiogroup" aria-label="Personalidad de la IA" className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {PERSONALIDADES.map(x => {
          const on = x.id === modo;
          return (
            <button key={x.id} type="button" role="radio" aria-checked={on} onClick={() => setModo(x.id)}
              className={`flex flex-col gap-2 rounded-2xl border-2 p-4 text-left transition ${on ? 'border-primario bg-superficie shadow-tarjeta' : 'border-transparent bg-superficie/60 hover:bg-superficie'}`}>
              <span className="flex items-center gap-2.5">
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${x.color}`}><Icono nombre={x.icono} /></span>
                <span className="font-extrabold">{x.nombre}</span>
                {x.id === 'calma' && <span className="ml-auto rounded-full bg-primario-suave px-2 py-0.5 text-[11px] font-bold text-primario-oscuro">Sugerida</span>}
              </span>
              <span className="text-[13px] font-semibold">“{x.cuando}”</span>
              <span className="text-[13px] text-gris">{x.como}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <section className="lg:col-span-8 tarjeta flex flex-col overflow-hidden" aria-label="Conversación con la IA">
          <div className="flex items-center justify-between gap-2 border-b border-linea px-5 py-3">
            <span className="flex items-center gap-2.5">
              <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${p.color}`}><Icono nombre={p.icono} className="text-[20px]" /></span>
              <span><span className="block font-bold">IA · modo {p.nombre}</span><span className="block text-[12px] text-tenue">Asistente de IA · no es una psicóloga</span></span>
            </span>
            <span className="flex items-center gap-1 text-[12px] font-semibold text-gris"><Icono nombre="encrypted" className="text-[16px] text-primario" /> Privada</span>
          </div>
          <ol className="flex max-h-[60vh] min-h-[22rem] flex-col gap-3 overflow-y-auto p-5" aria-live="polite">
            {charla.map((m, i) => (
              <li key={`${modo}-${i}`} className={`aparece flex max-w-[85%] flex-col gap-2 ${m.de === 'yo' ? 'self-end items-end' : 'self-start items-start'}`}>
                <p className={`rounded-2xl px-4 py-2.5 ${m.de === 'yo' ? 'rounded-br-md bg-primario text-white' : m.crisis ? 'rounded-bl-md border border-alerta/30 bg-alerta-suave' : 'rounded-bl-md bg-suave'}`}>{m.texto}</p>
                {m.ejercicio && <Respiracion />}
                {m.sugerencia && (
                  <div className="flex flex-wrap gap-2">
                    <Link to="/psicologos" className="boton-primario !py-1.5"><Icono nombre="event" className="text-[18px]" /> Ver a {PSICOLOGOS.find(x => x.id === m.sugerencia).nombre.split(' ').slice(1, 2)}</Link>
                    <span className="boton-borde !py-1.5">Seguir hablando</span>
                  </div>
                )}
                {m.crisis && (
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => setCrisisAbierta(true)} className="boton bg-alerta text-white"><Icono nombre="call" lleno className="text-[18px]" /> Hablar con alguien ahora</button>
                  </div>
                )}
              </li>
            ))}
            <li ref={fin} aria-hidden="true" />
          </ol>
          <form onSubmit={enviar} className="flex items-end gap-2 border-t border-linea bg-suave/50 p-3">
            <label htmlFor="ia-texto" className="sr-only">Escribe a la IA</label>
            <textarea id="ia-texto" rows="1" value={texto} onChange={e => setTexto(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) enviar(e); }}
              placeholder="Escribe lo que sientes…" className="campo resize-none !rounded-2xl" />
            <button type="submit" disabled={!texto.trim()} aria-label="Enviar" className="boton-primario !h-11 !w-11 !p-0 flex-shrink-0"><Icono nombre="send" /></button>
          </form>
        </section>

        <aside className="lg:col-span-4 flex flex-col gap-4">
          <section className="tarjeta p-5 flex flex-col gap-3" aria-labelledby="t-temas">
            <h2 id="t-temas" className="flex items-center gap-2 font-bold"><Icono nombre="sell" className="text-primario" /> Temas de esta charla</h2>
            <p className="text-[13px] text-gris">La IA detectó estos temas. Corrígelos antes de que se usen para tus recomendaciones.</p>
            <div className="flex flex-wrap gap-1.5">
              {temas.map(t => <Chip key={t} onQuitar={() => setTemas(ts => ts.filter(x => x !== t))}>{t}</Chip>)}
              {!temas.length && <span className="text-[13px] italic text-tenue">Sin temas: no se usará nada de esta charla.</span>}
            </div>
            <div className="border-t border-linea">
              <Interruptor id="usar-temas" activo={usar} onCambio={setUsar} etiqueta="Usar para mis recomendaciones" />
            </div>
            <p className="text-[12px] text-tenue">Tu psicóloga solo ve un resumen si tú lo compartes. Las charlas no se usan para entrenar a la IA.</p>
          </section>
          <section className="tarjeta p-5 flex flex-col gap-2" aria-labelledby="t-cambio">
            <h2 id="t-cambio" className="flex items-center gap-2 font-bold"><Icono nombre="autorenew" className="text-primario" /> Lo que cambió en tus opciones</h2>
            <p className="flex gap-2 text-[14px] text-gris"><Icono nombre="arrow_upward" className="text-[18px] text-exito" /> Laura Méndez subió al lugar 1 por “sueño”.</p>
            <p className="flex gap-2 text-[14px] text-gris"><Icono nombre="add" className="text-[18px] text-exito" /> Nuevo: taller “Dormir mejor”.</p>
            <Link to="/psicologos" className="mt-1 text-[14px] font-bold text-primario hover:underline">Ver psicólogos para ti →</Link>
          </section>
          <section className="rounded-2xl border border-alerta/25 bg-alerta-suave p-5" aria-labelledby="t-emergencia">
            <h2 id="t-emergencia" className="flex items-center gap-2 font-bold text-alerta"><Icono nombre="emergency" lleno /> Si es una emergencia</h2>
            <p className="mt-1 text-[14px]">Si escribes algo que indique riesgo, la IA deja su personalidad y te ofrece hablar de inmediato con una persona.</p>
            <button type="button" onClick={() => setCrisisAbierta(true)} className="boton mt-3 bg-alerta text-white">Ver líneas de ayuda</button>
          </section>
        </aside>
      </div>
    </div>
  );
}
