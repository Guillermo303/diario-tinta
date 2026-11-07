import { useState } from 'react';
import { Chip, Encabezado, Icono, useAviso } from '../components/ui';
import { MapaMexico, TarjetaPsicologo } from '../components/Psicologos';
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
    <div className="flex flex-col gap-6">
      <Encabezado etiqueta="Encuentra apoyo" titulo="Psicólogos para ti">
        Las recomendaciones cambian según cómo te sientes, de qué hablas y cómo te va con cada psicólogo. Tú eliges.
      </Encabezado>

      {bannerVisible && (
        <div role="status" className="aparece flex items-start gap-3 rounded-2xl border border-primario/25 bg-primario-suave/60 p-4">
          <Icono nombre="autorenew" className="mt-0.5 text-[22px] text-primario" />
          <div className="min-w-0 flex-1">
            <p className="font-bold">Tus recomendaciones cambiaron</p>
            <p className="text-[14px] text-gris">Esta semana hablaste más de <b className="text-tinta">sueño</b> y menos de pareja. Subimos a especialistas en insomnio y ansiedad nocturna.</p>
            <p className="mt-1 text-[12px] text-tenue">Actualizado hoy, 8:15 · Antes: 1. Andrés V. · 2. Laura M. · 3. Sofía G.</p>
          </div>
          <button type="button" onClick={() => setBannerVisible(false)} aria-label="Cerrar aviso" className="rounded-full p-1 text-gris hover:bg-white/60"><Icono nombre="close" className="text-[20px]" /></button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <aside className="lg:col-span-5 flex flex-col gap-4 lg:sticky lg:top-8">
          <section className="tarjeta p-4 flex flex-col gap-3" aria-labelledby="t-situacion">
            <h2 id="t-situacion" className="text-[14px] font-bold text-gris">Según tu diario de esta semana</h2>
            <div className="flex flex-wrap gap-1.5">{SITUACION.map(s => <Chip key={s.txt} icono={s.icono}>{s.txt}</Chip>)}</div>
          </section>
          <MapaMexico psicologos={lista} seleccionado={sel} onSeleccionar={setSel} />
          <section className="flex flex-col gap-2" aria-labelledby="t-otras">
            <h2 id="t-otras" className="etiqueta px-1">Otras ayudas para tu momento</h2>
            {OTRAS_AYUDAS.map(o => (
              <div key={o.titulo} className="tarjeta flex items-start gap-3 p-3.5">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-exito-suave text-exito"><Icono nombre={o.icono} /></span>
                <span><span className="block font-bold">{o.titulo}</span><span className="block text-[13px] text-gris">{o.detalle}</span></span>
              </div>
            ))}
          </section>
        </aside>

        <div className="lg:col-span-7 flex flex-col gap-4">
          <ol className="flex flex-col gap-4" aria-label="Psicólogos recomendados">
            {lista.map((p, i) => (
              <TarjetaPsicologo key={p.id} p={p} n={i + 1} seleccionado={sel === p.id} onSeleccionar={setSel} onOtra={otra}
                onAgendar={x => aviso(`Llamada con ${x.nombre} solicitada (ejemplo)`)} />
            ))}
          </ol>
          <p className="flex items-start gap-2 text-[13px] text-gris">
            <Icono nombre="verified_user" className="text-[18px] text-primario" />
            Ningún psicólogo puede pagar para aparecer más arriba ni ve tu diario hasta que tú lo decidas.
          </p>
        </div>
      </div>
    </div>
  );
}
