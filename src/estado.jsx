import { createContext, useContext, useState } from 'react';
import { MENSAJES_TERAPEUTA, PAGINAS, SEMANA } from './data/ejemplo';

// Estado compartido del prototipo: vive en memoria y se reinicia al recargar.
const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

export function ProveedorApp({ children }) {
  const [paginas, setPaginas] = useState(PAGINAS);
  const [mensajes, setMensajes] = useState(MENSAJES_TERAPEUTA);
  const [animoHoy, setAnimoHoy] = useState(null); // { animo, nota, compartido }
  const [crisisAbierta, setCrisisAbierta] = useState(false);
  const [letra, setLetra] = useState('normal');

  const valor = {
    paginas, agregarPagina: p => setPaginas(ps => [p, ...ps]),
    mensajes, enviarATerapeuta: texto => setMensajes(ms => [...ms.map(m => ({ ...m, nuevo: false })), { de: 'yo', texto, fecha: new Date() }]),
    semana: SEMANA, animoHoy, setAnimoHoy,
    crisisAbierta, setCrisisAbierta,
    letra, setLetra,
  };
  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}
