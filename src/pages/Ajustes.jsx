import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Encabezado, Icono, Interruptor, Segmentado, useAviso } from '../components/ui';
import { useApp } from '../estado';
import { CONTACTO_CONFIANZA, USUARIA } from '../data/ejemplo';

const Seccion = ({ icono, titulo, children }) => (
  <section className="tarjeta p-5" aria-label={titulo}>
    <h2 className="mb-1 flex items-center gap-2 text-lg font-extrabold"><Icono nombre={icono} className="text-primario" />{titulo}</h2>
    <div className="divide-y divide-linea">{children}</div>
  </section>
);

export default function Ajustes() {
  const aviso = useAviso();
  const { letra, setLetra } = useApp();
  const [a, setA] = useState({
    recordatorio: true, chispa: true,
    compartirDefault: false, pin: false, ocultarNotif: true, iaDiario: true, cierre: '15',
    avisoTerapeuta: true, avisoSesion: true, avisoRacha: false,
  });
  const cambiar = k => v => setA(x => ({ ...x, [k]: v }));

  return (
    <div className="flex flex-col gap-6">
      <Encabezado etiqueta="Ajustes" titulo="Tu espacio, a tu manera">
        Elige cómo escribes, qué compartes con tu terapeuta y cómo te avisamos. En este prototipo nada se guarda.
      </Encabezado>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <aside className="lg:col-span-4 flex flex-col gap-4 lg:sticky lg:top-8">
          <section className="tarjeta p-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <img src={USUARIA.foto} alt="" className="h-16 w-16 rounded-2xl object-cover" />
              <div>
                <p className="text-lg font-extrabold">{USUARIA.nombre}</p>
                <p className="flex items-center gap-1 text-[13px] text-gris"><Icono nombre="lock" className="text-[14px]" /> Perfil privado · solo tú</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[['14', 'días de racha'], ['3', 'páginas'], ['8', 'sesiones']].map(([n, t]) => (
                <div key={t} className="rounded-xl bg-suave py-2.5"><p className="text-xl font-extrabold">{n}</p><p className="text-[11px] font-semibold text-gris">{t}</p></div>
              ))}
            </div>
            <label className="flex flex-col gap-1">
              <span className="text-[13px] font-bold">¿Cómo quieres que te llamen?</span>
              <input defaultValue={USUARIA.nombre} className="campo" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[13px] font-bold">Frase de portada</span>
              <textarea rows="2" defaultValue={USUARIA.frase} className="campo resize-none" />
            </label>
          </section>
          <section className="tarjeta p-5 flex flex-col gap-2">
            <h2 className="flex items-center gap-2 font-extrabold"><Icono nombre="family_restroom" className="text-primario" /> Contacto de confianza</h2>
            <p className="text-[14px]"><b>{CONTACTO_CONFIANZA.nombre}</b></p>
            <p className="text-[13px] text-gris">Solo recibe un aviso si pulsas “Ayuda ahora” y eliges avisarle, o en una urgencia que aceptaste al registrarte.</p>
            <button type="button" onClick={() => aviso('Cambiar contacto (ejemplo)')} className="boton-borde self-start">Cambiar contacto</button>
          </section>
          <Link to="/pro" className="tarjeta flex items-center gap-3 p-5 hover:border-primario/30">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-azul-suave text-azul"><Icono nombre="medical_services" /></span>
            <span className="min-w-0 flex-1"><span className="block font-bold">¿Eres psicólogo?</span><span className="block text-[13px] text-gris">Abre el panel para atender pacientes y hablar con tu encargado.</span></span>
            <Icono nombre="arrow_forward" className="text-gris" />
          </Link>
        </aside>

        <div className="lg:col-span-8 flex flex-col gap-4">
          <Seccion icono="shield_lock" titulo="Privacidad y confidencialidad">
            <div className="py-3">
              <p className="rounded-xl bg-primario-suave/60 p-3 text-[14px]">Esta app no tiene perfiles públicos, amigos ni mensajes con otras personas. Solo tu terapeuta ve lo que tú decides compartir.</p>
            </div>
            <Interruptor id="a-compartir" activo={a.compartirDefault} onCambio={cambiar('compartirDefault')} etiqueta="Compartir con mi terapeuta por defecto" detalle="Si está apagado, cada página nueva empieza como “Solo yo”." />
            <Interruptor id="a-ia" activo={a.iaDiario} onCambio={cambiar('iaDiario')} etiqueta="Permitir que la IA lea mi diario" detalle="Sirve para detectar señales y mejorar tus recomendaciones. Puedes apagarlo cuando quieras." />
            <Interruptor id="a-pin" activo={a.pin} onCambio={cambiar('pin')} etiqueta="Pedir PIN al abrir" detalle="Protege tu diario si alguien más usa este dispositivo." />
            <Interruptor id="a-notif" activo={a.ocultarNotif} onCambio={cambiar('ocultarNotif')} etiqueta="Ocultar contenido en las notificaciones" detalle="Los avisos dirán “Tienes un mensaje” sin mostrar el texto." />
            <div className="flex flex-wrap items-center justify-between gap-3 py-3">
              <span><span className="block text-[15px] font-semibold">Cerrar sesión por inactividad</span><span className="block text-[13px] text-gris">Tiempo sin uso antes de pedir tu PIN otra vez.</span></span>
              <Segmentado etiqueta="Cierre por inactividad" valor={a.cierre} onCambio={cambiar('cierre')} opciones={[{ valor: '5', txt: '5 min' }, { valor: '15', txt: '15 min' }, { valor: 'nunca', txt: 'Nunca' }]} />
            </div>
          </Seccion>

          <Seccion icono="edit_note" titulo="Escritura">
            <Interruptor id="a-rec" activo={a.recordatorio} onCambio={cambiar('recordatorio')} etiqueta="Recordatorio diario a las 20:30" detalle="Una nota amable para no perder el hábito." />
            <Interruptor id="a-chispa" activo={a.chispa} onCambio={cambiar('chispa')} etiqueta="Chispa del día" detalle="Una pregunta de inspiración al escribir." />
          </Seccion>

          <Seccion icono="notifications" titulo="Avisos">
            <Interruptor id="a-ter" activo={a.avisoTerapeuta} onCambio={cambiar('avisoTerapeuta')} etiqueta="Mensajes de mi terapeuta" />
            <Interruptor id="a-ses" activo={a.avisoSesion} onCambio={cambiar('avisoSesion')} etiqueta="Recordatorio de sesión" detalle="Un día y una hora antes." />
            <Interruptor id="a-racha" activo={a.avisoRacha} onCambio={cambiar('avisoRacha')} etiqueta="Racha de escritura" />
          </Seccion>

          <Seccion icono="text_fields" titulo="Lectura">
            <div className="flex flex-wrap items-center justify-between gap-3 py-3">
              <span><span className="block text-[15px] font-semibold">Tamaño de letra</span><span className="block text-[13px] text-gris">Cambia el tamaño en toda la app.</span></span>
              <Segmentado etiqueta="Tamaño de letra" valor={letra} onCambio={setLetra} opciones={[{ valor: 'chica', txt: 'A−' }, { valor: 'normal', txt: 'A' }, { valor: 'grande', txt: 'A+' }]} />
            </div>
          </Seccion>

          <Seccion icono="folder" titulo="Tus datos">
            <div className="flex flex-wrap gap-2 py-3">
              <button type="button" onClick={() => aviso('Exportar mis datos (ejemplo)')} className="boton-borde"><Icono nombre="download" className="text-[18px]" /> Exportar mis datos</button>
              <button type="button" onClick={() => aviso('Borrar todo (ejemplo): en la app real pediría confirmación')} className="boton border border-alerta/30 text-alerta hover:bg-alerta-suave"><Icono nombre="delete" className="text-[18px]" /> Borrar todo</button>
              <Link to="/entrar" className="boton-borde"><Icono nombre="logout" className="text-[18px]" /> Cerrar sesión</Link>
            </div>
          </Seccion>
        </div>
      </div>
    </div>
  );
}
