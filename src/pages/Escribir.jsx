import { useMemo, useState } from 'react';
import { Encabezado, Icono, Segmentado, fechaCorta, useAviso } from '../components/ui';
import { useApp } from '../estado';
import { CHISPAS, ETIQUETAS } from '../data/ejemplo';

const FILTROS = [{ valor: 'todas', txt: 'Todas' }, { valor: 'privado', txt: 'Privadas' }, { valor: 'terapeuta', txt: 'Compartidas' }];

export default function Escribir() {
  const { paginas, agregarPagina } = useApp();
  const aviso = useAviso();
  const [chispa, setChispa] = useState(0);
  const [titulo, setTitulo] = useState('');
  const [texto, setTexto] = useState('');
  const [etiquetas, setEtiquetas] = useState([]);
  const [priv, setPriv] = useState('privado');
  const [filtro, setFiltro] = useState('todas');
  const palabras = useMemo(() => (texto.trim() ? texto.trim().split(/\s+/).length : 0), [texto]);
  const visibles = paginas.filter(p => filtro === 'todas' || p.priv === filtro);
  const compartidas = paginas.filter(p => p.priv === 'terapeuta').length;

  const alternar = e => setEtiquetas(es => (es.includes(e) ? es.filter(x => x !== e) : [...es, e]));
  const guardar = ev => {
    ev.preventDefault();
    if (!texto.trim()) return aviso('Escribe algo antes de guardar');
    agregarPagina({ id: crypto.randomUUID(), titulo: titulo.trim() || 'Sin título', texto: texto.trim(), etiquetas, priv, fecha: new Date() });
    setTitulo(''); setTexto(''); setEtiquetas([]);
    aviso(priv === 'terapeuta' ? 'Página guardada y visible para tu terapeuta' : 'Página guardada solo para ti');
  };

  return (
    <div className="flex flex-col gap-6">
      <Encabezado etiqueta="Libreta de pensamientos" titulo="¿Qué ronda tu mente hoy?">
        Un rincón sin prisa para ideas, gratitudes y lo que no quieres olvidar.
      </Encabezado>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <form onSubmit={guardar} className="lg:col-span-7 flex flex-col gap-4">
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

          <div className="tarjeta flex flex-col gap-3 p-5">
            <label htmlFor="titulo" className="sr-only">Título</label>
            <input id="titulo" value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Título de tu página…" className="w-full border-0 bg-transparent p-0 text-xl font-extrabold placeholder:text-tenue focus:outline-none focus:ring-0" />
            <label htmlFor="texto" className="sr-only">Tu página</label>
            <textarea id="texto" rows="9" value={texto} onChange={e => setTexto(e.target.value)} placeholder="Escribe sin filtro. Nadie más lo verá si no quieres."
              className="w-full resize-none border-0 bg-transparent p-0 text-[16px] leading-7 placeholder:text-tenue focus:outline-none focus:ring-0" />
            <div className="flex items-center justify-between border-t border-linea pt-3 text-[13px] text-gris">
              <span>{palabras} palabras · meta 150</span>
              <span className="h-1.5 w-28 overflow-hidden rounded-full bg-suave"><span className="block h-full rounded-full bg-primario transition-all" style={{ width: `${Math.min(100, (palabras / 150) * 100)}%` }} /></span>
            </div>
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
            <button type="submit" className="boton-primario !px-6 !py-3"><Icono nombre="check" className="text-[20px]" /> Guardar página</button>
          </div>
        </form>

        <section className="lg:col-span-5 flex flex-col gap-3" aria-labelledby="t-paginas">
          <div className="flex items-end justify-between gap-2">
            <div>
              <h2 id="t-paginas" className="text-lg font-extrabold">Tus notas</h2>
              <p className="text-[13px] text-gris">{paginas.length} {paginas.length === 1 ? "nota" : "notas"} · {compartidas} compartidas con tu terapeuta</p>
            </div>
          </div>
          <Segmentado etiqueta="Filtrar páginas" valor={filtro} onCambio={setFiltro} opciones={FILTROS} />
          <ul className="flex flex-col gap-2.5">
            {visibles.map(p => (
              <li key={p.id} className="aparece tarjeta flex flex-col gap-1.5 p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold">{p.titulo}</p>
                  <span className="text-[12px] text-tenue">{fechaCorta(p.fecha)}</span>
                </div>
                <p className="line-clamp-2 text-[14px] text-gris">{p.texto}</p>
                <div className="flex flex-wrap items-center gap-1.5 text-[12px]">
                  <span className={`flex items-center gap-1 font-bold ${p.priv === 'terapeuta' ? 'text-primario' : 'text-tenue'}`}>
                    <Icono nombre={p.priv === 'terapeuta' ? 'psychology' : 'lock'} className="text-[15px]" />{p.priv === 'terapeuta' ? 'Con tu terapeuta' : 'Solo tú'}
                  </span>
                  {p.etiquetas.map(e => <span key={e} className="text-gris">#{e}</span>)}
                </div>
              </li>
            ))}
            {!visibles.length && <li className="text-[14px] italic text-tenue">No hay páginas con este filtro.</li>}
          </ul>
        </section>
      </div>
    </div>
  );
}
