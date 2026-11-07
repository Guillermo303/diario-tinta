import { useState } from 'react';
import { Avatar, Chip, Icono, fechaCorta, useAviso } from '../../components/ui';
import { ANIMOS } from '../../data/ejemplo';
import { ALERTAS, PACIENTES, PSICOLOGA, RESPUESTAS_RAPIDAS, SOLICITUDES } from '../../data/pro';

const hora = d => d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

function Semana({ animo }) {
  return (
    <div className="flex gap-1" aria-label="Ánimo de la semana">
      {animo.map((id, i) => {
        const a = ANIMOS.find(x => x.id === id);
        return <span key={i} title={a ? a.txt : 'Sin registro'} className={`flex h-7 w-7 items-center justify-center rounded-full text-[13px] ${a ? a.color : 'border border-dashed border-tenue/60'}`}>{a?.emoji}</span>;
      })}
    </div>
  );
}

export default function Pacientes() {
  const aviso = useAviso();
  const [solicitudes, setSolicitudes] = useState(SOLICITUDES);
  const [pacientes, setPacientes] = useState(PACIENTES);
  const [sel, setSel] = useState(PACIENTES[0].id);
  const [texto, setTexto] = useState('');
  const [verChat, setVerChat] = useState(false); // en móvil, abre la conversación
  const p = pacientes.find(x => x.id === sel);

  const responder = (sol, aceptar) => {
    setSolicitudes(s => s.filter(x => x.id !== sol.id));
    aviso(aceptar ? `Aceptaste a ${sol.nombre}: se agendó ${sol.cuando}` : `Le propusimos otro horario a ${sol.nombre}`);
  };
  const enviar = t => {
    const v = (t ?? texto).trim(); if (!v) return;
    setPacientes(ps => ps.map(x => (x.id === sel ? { ...x, mensajes: [...x.mensajes, { de: 'yo', texto: v, fecha: new Date() }] } : x)));
    setTexto('');
  };
  const abrir = id => { setSel(id); setVerChat(true); };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="etiqueta">Panel de psicólogos</span>
          <h1 className="text-[26px] md:text-[32px] font-extrabold leading-tight">Hola, {PSICOLOGA.corto}</h1>
          <p className="text-gris">Solo ves lo que cada paciente decidió compartir contigo.</p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          {[[pacientes.length, 'pacientes'], [solicitudes.length, 'solicitudes'], [ALERTAS.length, 'alertas']].map(([n, t]) => (
            <div key={t} className="tarjeta px-4 py-2"><p className="text-xl font-extrabold">{n}</p><p className="text-[11px] font-semibold text-gris">{t}</p></div>
          ))}
        </div>
      </header>

      {/* Alertas priorizadas por la IA */}
      <section className="flex flex-col gap-2" aria-labelledby="t-alertas">
        <h2 id="t-alertas" className="etiqueta flex items-center gap-1.5"><Icono nombre="notification_important" className="text-[16px] text-alerta" /> Alertas priorizadas por la IA</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ALERTAS.map(a => (
            <div key={a.id} className={`flex items-start gap-3 rounded-2xl border p-4 ${a.nivel === 'alta' ? 'border-alerta/30 bg-alerta-suave' : 'border-ambar/30 bg-ambar-suave'}`}>
              <span className={`mt-0.5 rounded-full px-2 py-0.5 text-[11px] font-extrabold uppercase text-white ${a.nivel === 'alta' ? 'bg-alerta' : 'bg-ambar'}`}>{a.nivel}</span>
              <div className="min-w-0 flex-1">
                <p className="font-bold">{a.paciente} <span className="font-normal text-gris">· {a.hace}</span></p>
                <p className="text-[14px]">{a.motivo}</p>
                <p className="mt-1 flex items-center gap-1 text-[12px] font-bold text-gris"><Icono nombre="timer" className="text-[15px]" />{a.limite}</p>
              </div>
              <button type="button" onClick={() => abrir(PACIENTES.find(x => x.nombre === a.paciente).id)} className="boton-borde !py-1.5 flex-shrink-0">Revisar</button>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Columna izquierda: solicitudes y pacientes */}
        <div className={`lg:col-span-5 flex flex-col gap-5 ${verChat ? 'hidden lg:flex' : ''}`}>
          <section className="flex flex-col gap-2" aria-labelledby="t-solicitudes">
            <h2 id="t-solicitudes" className="etiqueta">Solicitudes nuevas · por matchmaking</h2>
            {!solicitudes.length && <p className="text-[14px] italic text-tenue">No tienes solicitudes pendientes.</p>}
            {solicitudes.map(s => (
              <div key={s.id} className="aparece tarjeta flex flex-col gap-3 p-4">
                <div className="flex items-center gap-3">
                  <Avatar iniciales={s.iniciales} color={s.color} />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold">{s.nombre} <span className="font-normal text-gris">· {s.edad} años</span></p>
                    <p className="text-[13px] text-gris">{s.pide} · {s.cuando}</p>
                  </div>
                  <p className="text-lg font-extrabold text-primario">{s.compat}%</p>
                </div>
                <div className="flex flex-wrap gap-1.5">{s.temas.map(t => <Chip key={t} className="!py-1 !text-[12px]">{t}</Chip>)}</div>
                <p className="rounded-xl bg-suave p-2.5 text-[13px] text-gris">{s.nota}</p>
                <div className="flex gap-2">
                  <button type="button" onClick={() => responder(s, true)} className="boton-primario flex-1">Aceptar</button>
                  <button type="button" onClick={() => responder(s, false)} className="boton-borde flex-1">Proponer otro horario</button>
                </div>
              </div>
            ))}
          </section>

          <section className="flex flex-col gap-2" aria-labelledby="t-pacientes">
            <h2 id="t-pacientes" className="etiqueta">Tus pacientes</h2>
            <ul className="tarjeta divide-y divide-linea overflow-hidden">
              {pacientes.map(x => {
                const ult = x.mensajes[x.mensajes.length - 1];
                return (
                  <li key={x.id}>
                    <button type="button" onClick={() => abrir(x.id)} aria-current={sel === x.id}
                      className={`flex w-full items-center gap-3 p-3.5 text-left transition ${sel === x.id ? 'bg-primario-suave/60' : 'hover:bg-suave'}`}>
                      <Avatar iniciales={x.iniciales} color={x.color} tam="w-10 h-10 text-[13px]" />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2"><span className="font-bold">{x.nombre}</span><span className="text-[11px] text-tenue">{fechaCorta(ult.fecha)}</span></span>
                        <span className="block truncate text-[13px] text-gris">{ult.de === 'yo' ? 'Tú: ' : ''}{ult.texto}</span>
                      </span>
                      {ALERTAS.some(a => a.paciente === x.nombre && a.nivel === 'alta') && <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full bg-alerta" aria-label="Alerta alta" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        {/* Conversación */}
        <section className={`lg:col-span-7 flex flex-col gap-4 ${verChat ? '' : 'hidden lg:flex'}`} aria-label={`Conversación con ${p.nombre}`}>
          <button type="button" onClick={() => setVerChat(false)} className="lg:hidden flex items-center gap-1 self-start text-[14px] font-bold text-primario"><Icono nombre="arrow_back" className="text-[18px]" /> Pacientes</button>
          <div className="tarjeta flex flex-col overflow-hidden">
            <div className="flex flex-wrap items-center gap-3 border-b border-linea p-4">
              <Avatar iniciales={p.iniciales} color={p.color} />
              <div className="min-w-0 flex-1">
                <p className="font-bold">{p.nombre}</p>
                <p className="text-[13px] text-gris">{p.desde} · Próxima: {p.proxima}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => aviso(`Videollamada con ${p.nombre} (ejemplo)`)} className="boton-suave !px-3" aria-label="Videollamada"><Icono nombre="videocam" className="text-[20px]" /></button>
                <button type="button" onClick={() => aviso('Se activó el protocolo de crisis (ejemplo)')} className="boton !px-3 border border-alerta/30 bg-alerta-suave text-alerta" aria-label="Activar protocolo de crisis"><Icono nombre="emergency" lleno className="text-[20px]" /></button>
              </div>
            </div>
            <ol className="flex min-h-[16rem] max-h-[50vh] flex-col gap-3 overflow-y-auto p-4" aria-live="polite">
              {p.mensajes.map((m, i) => (
                <li key={i} className={`aparece flex max-w-[85%] flex-col ${m.de === 'yo' ? 'self-end items-end' : 'self-start items-start'}`}>
                  <p className={`rounded-2xl px-3.5 py-2 text-[14px] ${m.de === 'yo' ? 'rounded-br-md bg-primario text-white' : 'rounded-bl-md bg-suave'}`}>{m.texto}</p>
                  <span className="mt-0.5 px-1 text-[11px] text-tenue">{m.de === 'yo' ? 'Tú' : p.nombre.split(' ')[0]} · {fechaCorta(m.fecha)}, {hora(m.fecha)}</span>
                </li>
              ))}
            </ol>
            <div className="flex flex-wrap gap-1.5 px-4 pb-2">
              {RESPUESTAS_RAPIDAS.map(r => <button key={r} type="button" onClick={() => enviar(r)} className="rounded-full border border-linea px-3 py-1 text-[12px] font-semibold text-gris hover:bg-suave">{r}</button>)}
            </div>
            <form onSubmit={e => { e.preventDefault(); enviar(); }} className="flex items-center gap-2 border-t border-linea bg-suave/50 p-3">
              <label htmlFor="pro-texto" className="sr-only">Escribe a {p.nombre}</label>
              <input id="pro-texto" value={texto} onChange={e => setTexto(e.target.value)} placeholder={`Escribe a ${p.nombre.split(' ')[0]}…`} className="campo !rounded-full" />
              <button type="submit" disabled={!texto.trim()} aria-label="Enviar" className="boton-primario !h-11 !w-11 !p-0 flex-shrink-0"><Icono nombre="send" /></button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="tarjeta p-4 flex flex-col gap-2">
              <h3 className="etiqueta">Lo que te compartió</h3>
              <Semana animo={p.animo} />
              <ul className="mt-1 flex flex-col gap-1 text-[14px]">{p.compartido.map(c => <li key={c} className="flex items-center gap-1.5"><Icono nombre="description" className="text-[16px] text-primario" />{c}</li>)}</ul>
            </div>
            <div className="tarjeta p-4 flex flex-col gap-2">
              <h3 className="etiqueta flex items-center gap-1"><Icono nombre="auto_awesome" className="text-[15px] text-lila" /> Resumen de la IA</h3>
              <p className="text-[14px]">{p.resumen}</p>
              <p className="text-[11px] text-tenue">Compartido con su permiso. Es un apoyo; el criterio clínico es tuyo.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
