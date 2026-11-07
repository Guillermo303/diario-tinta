import { useState } from 'react';
import { Avatar, Encabezado, Icono, Segmentado, fechaCorta, useAviso } from '../../components/ui';
import { CONDICIONES, CONTRATACION, ENCARGADO, MENSAJES_ENCARGADO, OFERTAS, PAGOS } from '../../data/pro';

const mxn = n => (n < 0 ? '−' : '') + '$' + Math.abs(n).toLocaleString('es-MX');

function Contratacion() {
  const hechos = CONTRATACION.filter(c => c.hecho).length;
  return (
    <div className="flex flex-col gap-4">
      <div className="tarjeta p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-extrabold">Tu alta en la red</h3>
          <span className="text-[13px] font-bold text-primario">{hechos} de {CONTRATACION.length}</span>
        </div>
        <span className="h-2 overflow-hidden rounded-full bg-suave"><span className="block h-full rounded-full bg-primario" style={{ width: `${(hechos / CONTRATACION.length) * 100}%` }} /></span>
        <ul className="flex flex-col gap-2">
          {CONTRATACION.map(c => (
            <li key={c.txt} className="flex items-center gap-2.5 text-[14px]">
              <Icono nombre={c.hecho ? 'check_circle' : 'radio_button_unchecked'} lleno={c.hecho} className={`text-[20px] ${c.hecho ? 'text-exito' : 'text-tenue'}`} />
              <span className={c.hecho ? '' : 'font-bold'}>{c.txt}</span>
              {!c.hecho && <span className="ml-auto rounded-full bg-ambar-suave px-2 py-0.5 text-[11px] font-bold text-ambar">Pendiente</span>}
            </li>
          ))}
        </ul>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CONDICIONES.map(c => (
          <div key={c.titulo} className="tarjeta flex items-start gap-3 p-4">
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primario-suave text-primario"><Icono nombre={c.icono} /></span>
            <span><span className="block font-bold">{c.titulo}</span><span className="block text-[13px] text-gris">{c.detalle}</span></span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Pagos() {
  const aviso = useAviso();
  const total = PAGOS.movimientos.reduce((a, m) => a + m.monto, 0);
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-2xl bg-primario p-5 text-white">
          <p className="text-[13px] font-semibold text-white/80">Próximo depósito · {PAGOS.proximo.fecha}</p>
          <p className="text-[32px] font-extrabold leading-tight">{mxn(PAGOS.proximo.monto)}</p>
          <p className="text-[13px] text-white/80">A tu {PAGOS.cuenta}</p>
        </div>
        <div className="tarjeta p-5">
          <p className="text-[13px] font-semibold text-gris">Tus ingresos por la red en la quincena</p>
          <p className="text-[32px] font-extrabold leading-tight">{mxn(PAGOS.sesionesCobradas + total)}</p>
          <p className="text-[13px] text-gris">Sesiones que cobraste + depósito de la app</p>
        </div>
      </div>
      <div className="tarjeta overflow-hidden">
        <div className="flex items-center justify-between border-b border-linea px-5 py-3">
          <h3 className="font-extrabold">Estado de cuenta · {PAGOS.periodo}</h3>
          <button type="button" onClick={() => aviso('Descargar estado de cuenta (ejemplo)')} className="text-[13px] font-bold text-primario hover:underline">Descargar</button>
        </div>
        <ul className="divide-y divide-linea">
          {PAGOS.movimientos.map(m => (
            <li key={m.concepto} className="flex items-center justify-between gap-3 px-5 py-3 text-[14px]">
              <span>{m.concepto}</span>
              <span className={`font-bold tabular-nums ${m.monto < 0 ? 'text-alerta' : 'text-exito'}`}>{mxn(m.monto)}</span>
            </li>
          ))}
          <li className="flex items-center justify-between gap-3 bg-suave/60 px-5 py-3 font-extrabold"><span>Depósito</span><span className="tabular-nums">{mxn(total)}</span></li>
        </ul>
      </div>
      <div className="tarjeta p-5">
        <h3 className="mb-2 font-extrabold">Pagos anteriores</h3>
        <ul className="flex flex-col gap-2">
          {PAGOS.historial.map(h => (
            <li key={h.fecha} className="flex items-center justify-between text-[14px]">
              <span>{h.fecha}</span>
              <span className="flex items-center gap-3"><span className="tabular-nums font-bold">{mxn(h.monto)}</span><span className="rounded-full bg-exito-suave px-2 py-0.5 text-[11px] font-bold text-exito">{h.estado}</span></span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[12px] text-tenue">La comisión se descuenta de lo que la app te paga por llamadas. Las retenciones fiscales dependen de tu régimen; tu encargado te orienta.</p>
      </div>
    </div>
  );
}

function Ofertas() {
  const aviso = useAviso();
  const [interes, setInteres] = useState([]);
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {OFERTAS.map(o => {
        const on = interes.includes(o.id);
        return (
          <li key={o.id} className="tarjeta flex flex-col gap-3 p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-azul-suave text-azul"><Icono nombre={o.icono} /></span>
              <div className="min-w-0"><p className="font-bold">{o.titulo}</p><p className="text-[13px] text-gris">{o.detalle}</p></div>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[13px]">
              <span className="rounded-full bg-exito-suave px-2.5 py-1 font-bold text-exito">{o.pago}</span>
              <span className="text-gris">{o.lugares}</span>
            </div>
            {o.requisito && <p className="flex items-center gap-1 text-[12px] text-ambar"><Icono nombre="info" className="text-[15px]" />{o.requisito}</p>}
            <button type="button" onClick={() => { setInteres(x => (on ? x.filter(i => i !== o.id) : [...x, o.id])); if (!on) aviso('Tu encargado te contactará sobre esta oferta'); }}
              className={`mt-auto ${on ? 'boton-suave' : 'boton-primario'}`}>
              <Icono nombre={on ? 'check' : 'waving_hand'} className="text-[18px]" /> {on ? 'Interés enviado' : 'Me interesa'}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export default function Encargado() {
  const [pestana, setPestana] = useState('pagos');
  const [mensajes, setMensajes] = useState(MENSAJES_ENCARGADO);
  const [texto, setTexto] = useState('');
  const enviar = e => {
    e.preventDefault(); const v = texto.trim(); if (!v) return;
    setMensajes(m => [...m, { de: 'yo', texto: v, fecha: new Date() }, { de: 'el', texto: 'Recibido, te respondo en breve. 🙌', fecha: new Date(), auto: true }]);
    setTexto('');
  };

  return (
    <div className="flex flex-col gap-6">
      <Encabezado etiqueta="Tu encargado" titulo="Contratación, pagos y ofertas">
        Una persona de la red te acompaña desde tu alta y mientras trabajas: dudas, pagos y nuevas oportunidades.
      </Encabezado>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <aside className="order-2 lg:order-none lg:col-span-4 flex flex-col gap-4 lg:sticky lg:top-8">
          <section className="tarjeta flex flex-col overflow-hidden" aria-label="Chat con tu encargado">
            <div className="flex items-center gap-3 border-b border-linea p-4">
              <Avatar iniciales={ENCARGADO.iniciales} color="bg-tinta" />
              <div className="min-w-0 flex-1">
                <p className="font-bold">{ENCARGADO.nombre}</p>
                <p className="text-[12px] text-gris">{ENCARGADO.puesto}</p>
                <p className="flex items-center gap-1 text-[12px] text-exito"><span className="h-1.5 w-1.5 rounded-full bg-exito" /> {ENCARGADO.horario}</p>
              </div>
            </div>
            <ol className="flex max-h-80 flex-col gap-2.5 overflow-y-auto p-4" aria-live="polite">
              {mensajes.map((m, i) => (
                <li key={i} className={`aparece flex max-w-[90%] flex-col ${m.de === 'yo' ? 'self-end items-end' : 'self-start items-start'}`}>
                  <p className={`rounded-2xl px-3.5 py-2 text-[14px] ${m.de === 'yo' ? 'rounded-br-md bg-primario text-white' : 'rounded-bl-md bg-suave'}`}>{m.texto}</p>
                  <span className="mt-0.5 px-1 text-[11px] text-tenue">{m.de === 'yo' ? 'Tú' : 'Jorge'} · {fechaCorta(m.fecha)}</span>
                </li>
              ))}
            </ol>
            <form onSubmit={enviar} className="flex items-center gap-2 border-t border-linea bg-suave/50 p-3">
              <label htmlFor="enc-texto" className="sr-only">Escribe a tu encargado</label>
              <input id="enc-texto" value={texto} onChange={e => setTexto(e.target.value)} placeholder="Pregunta sobre pagos, contrato…" className="campo !rounded-full !py-2" />
              <button type="submit" disabled={!texto.trim()} aria-label="Enviar" className="boton-primario !h-10 !w-10 !p-0 flex-shrink-0"><Icono nombre="send" className="text-[18px]" /></button>
            </form>
          </section>
          <a href={`tel:${ENCARGADO.telefono.replace(/\s/g, '')}`} className="boton-borde"><Icono nombre="call" className="text-[18px]" /> Llamar a {ENCARGADO.nombre.split(' ')[1]} · {ENCARGADO.telefono}</a>
        </aside>

        <div className="lg:col-span-8 flex flex-col gap-4">
          <Segmentado etiqueta="Sección" valor={pestana} onCambio={setPestana}
            opciones={[{ valor: 'contratacion', txt: 'Contratación' }, { valor: 'pagos', txt: 'Pagos' }, { valor: 'ofertas', txt: `Ofertas (${OFERTAS.length})` }]} />
          {pestana === 'contratacion' && <Contratacion />}
          {pestana === 'pagos' && <Pagos />}
          {pestana === 'ofertas' && <Ofertas />}
        </div>
      </div>
    </div>
  );
}
