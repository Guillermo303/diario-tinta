import { useEffect, useMemo, useState } from 'react';
import { Encabezado, Icono, Interruptor, Segmentado, fechaCorta, useAviso } from '../components/ui';
import Grabadora, { duracionTexto } from '../components/Grabadora';
import { useApp } from '../estado';
import { CHISPAS, ETIQUETAS } from '../data/ejemplo';
import { PERSONALIDADES, callar, detectarTemas, hablar, responder } from '../data/acompanante';

const FILTROS = [{ valor: 'todas', txt: 'Todas' }, { valor: 'privado', txt: 'Privadas' }, { valor: 'terapeuta', txt: 'Compartidas' }, { valor: 'voz', txt: 'De voz' }];

// Botón para escuchar la respuesta de la IA en voz alta
function BotonVoz({ texto, personalidad }) {
  const [sonando, setSonando] = useState(false);
  const aviso = useAviso();
  useEffect(() => () => callar(), []);
  const alternar = () => {
    if (sonando) { callar(); setSonando(false); return; }
    if (hablar(texto, personalidad, () => setSonando(false))) setSonando(true);
    else aviso('Tu navegador no puede leer en voz alta');
  };
  return (
    <button type="button" onClick={alternar} className={sonando ? 'boton-primario !py-1.5' : 'boton-suave !py-1.5'} aria-pressed={sonando}>
      <Icono nombre={sonando ? 'stop_circle' : 'volume_up'} className="text-[18px]" /> {sonando ? 'Detener' : 'Escuchar respuesta'}
    </button>
  );
}

function Respuesta({ r, onCerrar }) {
  const { setCrisisAbierta } = useApp();
  const p = PERSONALIDADES.find(x => x.id === r.personalidad);
  return (
    <section aria-live="polite" className={`aparece flex flex-col gap-3 rounded-2xl border p-4 ${r.crisis ? 'border-alerta/30 bg-alerta-suave' : 'border-linea bg-superficie shadow-tarjeta'}`}>
      <div className="flex items-center gap-2.5">
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${r.crisis ? 'bg-alerta text-white' : p.color}`}><Icono nombre={r.crisis ? 'emergency' : p.icono} className="text-[20px]" /></span>
        <span className="min-w-0 flex-1">
          <span className="block font-bold">{r.crisis ? 'Tu acompañante quiere que estés a salvo' : `Tu acompañante · ${p.nombre}`}</span>
          <span className="block text-[12px] text-tenue">Asistente de IA · no es una psicóloga · sobre {r.sobre.startsWith('tu nota') ? r.sobre : `“${r.sobre}”`}</span>
        </span>
        <button type="button" onClick={onCerrar} aria-label="Cerrar respuesta" className="rounded-full p-1 text-gris hover:bg-suave"><Icono nombre="close" className="text-[20px]" /></button>
      </div>
      <p className="text-[15px] leading-relaxed">{r.texto}</p>
      <div className="flex flex-wrap gap-2">
        <BotonVoz key={r.id} texto={r.texto} personalidad={r.personalidad} />
        {r.crisis && <button type="button" onClick={() => setCrisisAbierta(true)} className="boton bg-alerta text-white"><Icono nombre="call" lleno className="text-[18px]" /> Hablar con alguien ahora</button>}
      </div>
      {!!r.temas?.length && !r.crisis && (
        <p className="text-[12px] text-gris">Temas detectados: <b>{r.temas.join(', ')}</b>. Se usan para tus recomendaciones de psicólogos solo si lo permites en Ajustes.</p>
      )}
    </section>
  );
}

export default function Escribir() {
  const { paginas, agregarPagina } = useApp();
  const aviso = useAviso();
  const [modo, setModo] = useState('texto'); // texto | voz
  const [chispa, setChispa] = useState(0);
  const [titulo, setTitulo] = useState('');
  const [texto, setTexto] = useState('');
  const [audio, setAudio] = useState(null); // { url, duracion, transcripcion }
  const [etiquetas, setEtiquetas] = useState([]);
  const [priv, setPriv] = useState('privado');
  const [filtro, setFiltro] = useState('todas');
  const [personalidad, setPersonalidad] = useState('escucha');
  const [conIA, setConIA] = useState(true);
  const [enVoz, setEnVoz] = useState(true);
  const [respuesta, setRespuesta] = useState(null);

  const palabras = useMemo(() => (texto.trim() ? texto.trim().split(/\s+/).length : 0), [texto]);
  const visibles = paginas.filter(p => filtro === 'todas' || (filtro === 'voz' ? p.audio : p.priv === filtro));
  const compartidas = paginas.filter(p => p.priv === 'terapeuta').length;

  const alternar = e => setEtiquetas(es => (es.includes(e) ? es.filter(x => x !== e) : [...es, e]));
  const cambiarModo = m => { setModo(m); setAudio(null); };

  const guardar = ev => {
    ev.preventDefault();
    const contenido = (modo === 'voz' ? texto || audio?.transcripcion || '' : texto).trim();
    if (modo === 'voz' && !audio) return aviso('Graba tu nota de voz antes de guardar');
    if (modo === 'texto' && !contenido) return aviso('Escribe algo antes de guardar');

    const nota = {
      id: crypto.randomUUID(), titulo: titulo.trim() || (modo === 'voz' ? 'Nota de voz' : 'Sin título'),
      texto: contenido || 'Nota de voz sin transcripción', etiquetas, priv, fecha: new Date(),
      audio: modo === 'voz' ? audio : null,
    };
    if (conIA) {
      const r = responder(personalidad, contenido);
      const temas = detectarTemas(contenido);
      nota.respuesta = { ...r, personalidad, temas, id: nota.id, sobre: titulo.trim() || (modo === 'voz' ? 'tu nota de voz' : 'tu nota') };
      setRespuesta(nota.respuesta);
      if (enVoz) setTimeout(() => hablar(r.texto, personalidad), 300);
    } else setRespuesta(null);
    agregarPagina(nota);
    setTitulo(''); setTexto(''); setEtiquetas([]); setAudio(null);
    aviso(priv === 'terapeuta' ? 'Nota guardada y visible para tu terapeuta' : 'Nota guardada solo para ti');
  };

  return (
    <div className="flex flex-col gap-6">
      <Encabezado etiqueta="Libreta de pensamientos" titulo="¿Qué ronda tu mente hoy?">
        Escríbelo o dilo en voz alta. Si quieres, una IA te acompaña con el estilo que elijas y te responde con texto y voz.
      </Encabezado>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <form onSubmit={guardar} className="lg:col-span-7 flex flex-col gap-4">
          {/* Acompañante */}
          <section className="tarjeta flex flex-col gap-3 p-4" aria-labelledby="t-acomp">
            <div className="flex items-center justify-between gap-2">
              <h2 id="t-acomp" className="flex items-center gap-2 font-extrabold"><Icono nombre="graphic_eq" className="text-primario" /> Tu acompañante</h2>
              <span className="text-[12px] text-tenue">Es una IA, no una psicóloga</span>
            </div>
            <div role="radiogroup" aria-label="Personalidad del acompañante" className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PERSONALIDADES.map(x => {
                const on = x.id === personalidad;
                return (
                  <button key={x.id} type="button" role="radio" aria-checked={on} onClick={() => setPersonalidad(x.id)} disabled={!conIA}
                    className={`flex flex-col gap-1 rounded-xl border-2 p-2.5 text-left transition disabled:opacity-40 ${on ? 'border-primario bg-primario-suave/40' : 'border-transparent bg-suave hover:bg-linea/60'}`}>
                    <span className="flex items-center gap-2"><span className={`flex h-8 w-8 items-center justify-center rounded-lg ${x.color}`}><Icono nombre={x.icono} className="text-[18px]" /></span><span className="text-[14px] font-extrabold">{x.nombre}</span></span>
                    <span className="text-[12px] text-gris">“{x.cuando}”</span>
                  </button>
                );
              })}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 border-t border-linea">
              <Interruptor id="con-ia" activo={conIA} onCambio={setConIA} etiqueta="Responder a mis notas" />
              <Interruptor id="en-voz" activo={enVoz && conIA} onCambio={setEnVoz} etiqueta="Leer la respuesta en voz alta" />
            </div>
          </section>

          {respuesta && <Respuesta r={respuesta} onCerrar={() => { callar(); setRespuesta(null); }} />}

          <div className="flex items-start gap-3 rounded-2xl bg-ambar-suave p-4">
            <Icono nombre="lightbulb" className="text-[22px] text-ambar" />
            <div className="min-w-0 flex-1">
              <p className="etiqueta !text-ambar">Chispa del día</p>
              <p key={chispa} className="aparece mt-0.5 text-[17px] font-bold">{CHISPAS[chispa]}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button type="button" onClick={() => setChispa(c => (c + 1) % CHISPAS.length)} className="boton-borde !py-1.5"><Icono nombre="shuffle" className="text-[18px]" /> Otra chispa</button>
                <button type="button" onClick={() => setTitulo(CHISPAS[chispa])} className="boton !py-1.5 text-ambar hover:bg-white/50">Usar como título</button>
              </div>
            </div>
          </div>

          <Segmentado etiqueta="Tipo de nota" valor={modo} onCambio={cambiarModo}
            opciones={[{ valor: 'texto', txt: '✍️ Escribir' }, { valor: 'voz', txt: '🎙️ Nota de voz' }]} />

          <div className="tarjeta flex flex-col gap-3 p-5">
            <label htmlFor="titulo" className="sr-only">Título</label>
            <input id="titulo" value={titulo} onChange={e => setTitulo(e.target.value)} placeholder={modo === 'voz' ? 'Título de tu nota de voz (opcional)…' : 'Título de tu nota…'} className="w-full border-0 bg-transparent p-0 text-xl font-extrabold placeholder:text-tenue focus:outline-none focus:ring-0" />

            {modo === 'texto' ? (
              <>
                <label htmlFor="texto" className="sr-only">Tu nota</label>
                <textarea id="texto" rows="9" value={texto} onChange={e => setTexto(e.target.value)} placeholder="Escribe sin filtro. Nadie más lo verá si no quieres."
                  className="w-full resize-none border-0 bg-transparent p-0 text-[16px] leading-7 placeholder:text-tenue focus:outline-none focus:ring-0" />
                <div className="flex items-center justify-between border-t border-linea pt-3 text-[13px] text-gris">
                  <span>{palabras} palabras · meta 150</span>
                  <span className="h-1.5 w-28 overflow-hidden rounded-full bg-suave"><span className="block h-full rounded-full bg-primario transition-all" style={{ width: `${Math.min(100, (palabras / 150) * 100)}%` }} /></span>
                </div>
              </>
            ) : !audio ? (
              <Grabadora onError={aviso} onListo={a => { setAudio(a); setTexto(a.transcripcion); }} />
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 rounded-2xl bg-suave p-3">
                  <Icono nombre="graphic_eq" className="text-[24px] text-primario" />
                  <audio src={audio.url} controls className="h-10 min-w-0 flex-1" />
                  <span className="text-[13px] font-bold text-gris">{duracionTexto(audio.duracion)}</span>
                </div>
                <label htmlFor="transcripcion" className="text-[13px] font-bold">Lo que dijiste <span className="font-normal text-tenue">(puedes corregirlo)</span></label>
                <textarea id="transcripcion" rows="4" value={texto} onChange={e => setTexto(e.target.value)}
                  placeholder="Tu navegador no transcribió el audio. Si quieres, escribe aquí un resumen para que tu acompañante te responda mejor."
                  className="campo resize-none" />
                <button type="button" onClick={() => { setAudio(null); setTexto(''); }} className="self-start text-[13px] font-bold text-gris underline hover:text-tinta">Borrar y grabar de nuevo</button>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <span className="etiqueta">Etiquetas</span>
            <div className="flex flex-wrap gap-1.5">
              {ETIQUETAS.map(e => (
                <button key={e} type="button" aria-pressed={etiquetas.includes(e)} onClick={() => alternar(e)}
                  className={`rounded-full px-3 py-1.5 text-[13px] font-semibold transition ${etiquetas.includes(e) ? 'bg-primario text-white' : 'bg-suave text-tinta hover:bg-linea'}`}>#{e}</button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-col gap-1.5">
              <span className="etiqueta">¿Quién puede verla?</span>
              <Segmentado etiqueta="Privacidad" valor={priv} onCambio={setPriv} opciones={[{ valor: 'privado', txt: '🔒 Solo yo' }, { valor: 'terapeuta', txt: '🩺 Mi terapeuta' }]} />
            </div>
            <button type="submit" className="boton-primario !px-6 !py-3"><Icono nombre="check" className="text-[20px]" /> {modo === 'voz' ? 'Guardar nota de voz' : 'Guardar nota'}</button>
          </div>
          <p className="text-[12px] text-tenue">En este prototipo, tu audio se queda en este dispositivo y se borra al recargar.</p>
        </form>

        <section className="lg:col-span-5 flex flex-col gap-3" aria-labelledby="t-paginas">
          <div>
            <h2 id="t-paginas" className="text-lg font-extrabold">Tus notas</h2>
            <p className="text-[13px] text-gris">{paginas.length} {paginas.length === 1 ? 'nota' : 'notas'} · {compartidas} compartidas con tu terapeuta</p>
          </div>
          <div className="overflow-x-auto"><Segmentado etiqueta="Filtrar notas" valor={filtro} onCambio={setFiltro} opciones={FILTROS} /></div>
          <ul className="flex flex-col gap-2.5">
            {visibles.map(p => (
              <li key={p.id} className="aparece tarjeta flex flex-col gap-1.5 p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="flex items-center gap-1.5 font-bold">{p.audio && <Icono nombre="mic" lleno className="text-[18px] text-primario" />}{p.titulo}</p>
                  <span className="text-[12px] text-tenue">{fechaCorta(p.fecha)}</span>
                </div>
                {p.audio && <audio src={p.audio.url} controls className="h-9 w-full" />}
                <p className="line-clamp-2 text-[14px] text-gris">{p.texto}</p>
                {p.respuesta && !p.respuesta.crisis && (
                  <button type="button" onClick={() => setRespuesta(p.respuesta)} className="flex items-center gap-1 self-start text-[12px] font-bold text-primario hover:underline">
                    <Icono nombre="graphic_eq" className="text-[15px]" /> Respuesta de {PERSONALIDADES.find(x => x.id === p.respuesta.personalidad)?.nombre}
                  </button>
                )}
                <div className="flex flex-wrap items-center gap-1.5 text-[12px]">
                  <span className={`flex items-center gap-1 font-bold ${p.priv === 'terapeuta' ? 'text-primario' : 'text-tenue'}`}>
                    <Icono nombre={p.priv === 'terapeuta' ? 'psychology' : 'lock'} className="text-[15px]" />{p.priv === 'terapeuta' ? 'Con tu terapeuta' : 'Solo tú'}
                  </span>
                  {p.etiquetas.map(e => <span key={e} className="text-gris">#{e}</span>)}
                </div>
              </li>
            ))}
            {!visibles.length && <li className="text-[14px] italic text-tenue">No hay notas con este filtro.</li>}
          </ul>
        </section>
      </div>
    </div>
  );
}
