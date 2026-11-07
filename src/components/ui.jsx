import { createContext, useCallback, useContext, useRef, useState } from 'react';

export const Icono = ({ nombre, lleno = false, className = '' }) => (
  <span aria-hidden="true" className={`icono ${lleno ? 'icono-lleno' : ''} ${className}`}>{nombre}</span>
);

export const Avatar = ({ iniciales, color = 'bg-primario', tam = 'w-11 h-11 text-sm' }) => (
  <span aria-hidden="true" className={`${tam} ${color} flex-shrink-0 rounded-full text-white font-bold flex items-center justify-center`}>
    {iniciales}
  </span>
);

export const Chip = ({ icono, children, className = '', onQuitar }) => (
  <span className={`inline-flex items-center gap-1.5 rounded-full bg-suave px-3 py-1.5 text-[13px] font-semibold text-tinta ${className}`}>
    {icono && <Icono nombre={icono} className="text-[17px] text-gris" />}
    {children}
    {onQuitar && (
      <button type="button" onClick={onQuitar} aria-label={`Quitar ${children}`} className="-mr-1 rounded-full p-0.5 text-tenue hover:bg-linea hover:text-tinta">
        <Icono nombre="close" className="text-[16px]" />
      </button>
    )}
  </span>
);

export function Interruptor({ id, activo, onCambio, etiqueta, detalle }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <label htmlFor={id} className="min-w-0 cursor-pointer">
        <span className="block text-[15px] font-semibold text-tinta">{etiqueta}</span>
        {detalle && <span className="block text-[13px] text-gris">{detalle}</span>}
      </label>
      <button
        id={id} type="button" role="switch" aria-checked={activo} onClick={() => onCambio(!activo)}
        className={`relative h-7 w-12 flex-shrink-0 rounded-full transition-colors ${activo ? 'bg-primario' : 'bg-linea'}`}
      >
        <span className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${activo ? 'translate-x-5' : ''}`} />
      </button>
    </div>
  );
}

export function Segmentado({ opciones, valor, onCambio, etiqueta }) {
  return (
    <div role="radiogroup" aria-label={etiqueta} className="inline-flex rounded-full bg-suave p-1">
      {opciones.map(o => (
        <button
          key={o.valor} type="button" role="radio" aria-checked={valor === o.valor} onClick={() => onCambio(o.valor)}
          className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition ${valor === o.valor ? 'bg-superficie text-primario-oscuro shadow-tarjeta' : 'text-gris hover:text-tinta'}`}
        >
          {o.txt}
        </button>
      ))}
    </div>
  );
}

export const Encabezado = ({ etiqueta, titulo, children }) => (
  <header className="flex flex-col gap-1">
    {etiqueta && <span className="etiqueta">{etiqueta}</span>}
    <h1 className="text-[26px] md:text-[32px] font-extrabold leading-tight">{titulo}</h1>
    {children && <p className="max-w-2xl text-gris">{children}</p>}
  </header>
);

// ---------- Avisos breves (toasts) ----------
const AvisoCtx = createContext(() => {});
export const useAviso = () => useContext(AvisoCtx);

export function ProveedorAvisos({ children }) {
  const [aviso, setAviso] = useState(null);
  const t = useRef();
  const mostrar = useCallback(texto => {
    setAviso(texto);
    clearTimeout(t.current);
    t.current = setTimeout(() => setAviso(null), 2600);
  }, []);
  return (
    <AvisoCtx.Provider value={mostrar}>
      {children}
      <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-24 md:bottom-8 z-[60] flex justify-center px-4">
        {aviso && <div className="aparece rounded-full bg-tinta px-4 py-2.5 text-sm font-semibold text-white shadow-flotante">{aviso}</div>}
      </div>
    </AvisoCtx.Provider>
  );
}

export const fechaCorta = d => d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
