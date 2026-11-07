import { useState } from 'react';
import { Encabezado, Icono, useAviso } from '../components/ui';
import { MapaMexico, Resena } from '../components/Psicologos';
import { ALTERNATIVOS, OTRAS_AYUDAS, PSICOLOGOS, SITUACION } from '../data/ejemplo';

export default function PsicologosPage() {
  const aviso = useAviso();
  const [lista, setLista] = useState(PSICOLOGOS);
  const [reserva, setReserva] = useState(ALTERNATIVOS);
  const [sel, setSel] = useState(PSICOLOGOS[0].id);
  const [bannerVisible, setBannerVisible] = useState(true);

  const otra = id => {
    if (!reserva.length) return aviso('Ya viste todas las opciones de tu zona');
    const [nuevo, ...resto] = reserva;
    setLista(l => l.map(p => (p.id === id ? nuevo : p)));
    setReserva(resto);
    setSel(nuevo.id);
    aviso(`Te mostramos a ${nuevo.nombre}`);
  };

  return (
    <div className="flex flex-col gap-5">
      <Encabezado etiqueta="Encuentra apoyo" titulo="Psicólogos para ti">
        Te recomendamos psicólogos cerca de ti según cómo te has sentido. Tú eliges.
      </Encabezado>

      {/* Aviso y situación en una sola franja */}
      <div className="flex flex-wrap items-center gap-2 text-[13px]">
        <span className="font-bold text-gris">Según tu diario de esta semana:</span>
        {SITUACION.map(s => (
          <span key={s.txt} className="inline-flex items-center gap-1 rounded-full bg-suave px-2.5 py-1 font-semibold"><Icono nombre={s.icono} className="text-[15px] text-gris" />{s.txt}</span>
        ))}
        {bannerVisible && (
          <span role="status" className="aparece inline-flex items-center gap-1.5 rounded-full bg-primario-suave px-2.5 py-1 font-semibold text-primario-oscuro">
            <Icono nombre="autorenew" className="text-[15px]" /> Actualizado hoy: subimos especialistas en sueño
            <button type="button" onClick={() => setBannerVisible(false)} aria-label="Cerrar aviso" className="rounded-full hover:bg-white/60"><Icono nombre="close" className="text-[15px]" /></button>
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Mapa grande */}
        <div className="lg:col-span-7 lg:sticky lg:top-8">
          <MapaMexico psicologos={lista} seleccionado={sel} onSeleccionar={setSel} />
        </div>

        {/* Reseñas compactas */}
        <section className="lg:col-span-5 flex flex-col gap-3" aria-labelledby="t-resenas">
          <div className="flex items-end justify-between gap-2">
            <h2 id="t-resenas" className="text-lg font-extrabold">Reseñas</h2>
            <span className="text-[12px] text-tenue">De pacientes verificados</span>
          </div>
          <ol className="flex flex-col gap-2.5" aria-label="Psicólogos recomendados">
            {lista.map((p, i) => (
              <Resena key={p.id} p={p} n={i + 1} seleccionado={sel === p.id} onSeleccionar={setSel} onOtra={otra}
                onAgendar={x => aviso(`Llamada de 15 min con ${x.nombre} solicitada (ejemplo)`)} />
            ))}
          </ol>
          <p className="flex items-start gap-1.5 text-[12px] text-gris">
            <Icono nombre="verified_user" className="text-[16px] text-primario" />
            Toca un nombre para ver más. Nadie paga por aparecer más arriba.
          </p>

          <div className="mt-1 flex flex-col gap-1.5">
            <h3 className="etiqueta">Otras ayudas</h3>
            {OTRAS_AYUDAS.map(o => (
              <div key={o.titulo} className="flex items-center gap-2.5 rounded-xl bg-suave/70 px-3 py-2 text-[13px]">
                <Icono nombre={o.icono} className="text-[18px] text-exito" />
                <span className="min-w-0"><b>{o.titulo}</b> <span className="text-gris">· {o.detalle}</span></span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
