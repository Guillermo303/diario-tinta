import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Icono, useAviso } from '../components/ui';

const ROLES = [
  { id: 'usuario', titulo: 'Busco apoyo', detalle: 'Quiero un espacio privado para desahogarme y encontrar ayuda.', icono: 'spa' },
  { id: 'psicologo', titulo: 'Soy psicólogo', detalle: 'Quiero unirme a la red y acompañar a personas de mi zona.', icono: 'medical_services' },
];
const ESPECIALIDADES = ['Depresión', 'Ansiedad', 'Duelo', 'Estrés laboral', 'Sueño', 'Pareja', 'Adolescentes', 'Adicciones'];
const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Campo({ id, etiqueta, error, ayuda, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-[13px] font-bold">{etiqueta}</label>
      {children}
      {error ? <p id={`${id}-error`} className="flex items-center gap-1 text-[12px] font-semibold text-alerta"><Icono nombre="error" className="text-[15px]" />{error}</p>
        : ayuda && <p className="text-[12px] text-tenue">{ayuda}</p>}
    </div>
  );
}

export default function Acceso({ modo }) {
  const navegar = useNavigate();
  const aviso = useAviso();
  const [params, setParams] = useSearchParams();
  const rol = params.get('rol') === 'psicologo' ? 'psicologo' : 'usuario';
  const registro = modo === 'registro';
  const pro = rol === 'psicologo';

  const [d, setD] = useState({ nombre: '', correo: '', telefono: '', clave: '', cedula: '', anos: '', ciudad: 'Torreón, Coah.', experiencia: '', especialidades: [], cv: null, privacidad: false, salud: false });
  const [errores, setErrores] = useState({});
  const [verClave, setVerClave] = useState(false);
  const set = k => e => setD(x => ({ ...x, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  const elegirRol = r => { setParams(r === 'psicologo' ? { rol: r } : {}); setErrores({}); };
  const alternarEsp = e => setD(x => ({ ...x, especialidades: x.especialidades.includes(e) ? x.especialidades.filter(y => y !== e) : [...x.especialidades, e] }));

  const validar = () => {
    const e = {};
    if (!CORREO.test(d.correo.trim())) e.correo = 'Escribe un correo válido, por ejemplo nombre@correo.com';
    if (d.clave.length < 8) e.clave = 'Usa al menos 8 caracteres';
    if (registro) {
      if (d.nombre.trim().length < 2) e.nombre = 'Escribe tu nombre';
      if (d.telefono.replace(/\D/g, '').length !== 10) e.telefono = 'El teléfono debe tener 10 dígitos';
      if (!d.privacidad) e.privacidad = 'Necesitas aceptar el aviso de privacidad';
      if (!pro && !d.salud) e.salud = 'Necesitamos tu permiso para guardar datos de salud';
      if (pro) {
        if (!/^\d{7,8}$/.test(d.cedula.trim())) e.cedula = 'La cédula profesional tiene 7 u 8 dígitos';
        if (!d.anos) e.anos = 'Indica tus años de experiencia';
        if (!d.especialidades.length) e.especialidades = 'Elige al menos una especialidad';
        if (d.experiencia.trim().length < 30 && !d.cv) e.experiencia = 'Cuéntanos tu experiencia (30 caracteres o más) o sube tu CV';
        if (d.cv && d.cv.size > 5 * 1024 * 1024) e.cv = 'El archivo pesa más de 5 MB';
      }
    }
    return e;
  };

  const enviar = ev => {
    ev.preventDefault();
    const e = validar(); setErrores(e);
    if (Object.keys(e).length) { document.getElementById(Object.keys(e)[0])?.focus(); return; }
    if (registro && pro) { aviso('Solicitud enviada: tu encargado revisará tus datos'); navegar('/pro/encargado'); }
    else if (registro) { aviso(`¡Bienvenida, ${d.nombre.trim().split(' ')[0]}! Empieza tu mes gratis`); navegar('/hoy'); }
    else { aviso('Sesión iniciada (ejemplo)'); navegar(pro ? '/pro' : '/hoy'); }
  };

  const err = k => errores[k] ? { 'aria-invalid': true, 'aria-describedby': `${k}-error` } : {};
  const cls = k => `campo ${errores[k] ? '!border-alerta focus:!ring-alerta/20' : ''}`;

  return (
    <div className="min-h-screen bg-fondo lg:grid lg:grid-cols-2">
      {/* Panel de marca */}
      <aside className="relative hidden lg:flex lg:sticky lg:top-0 lg:h-screen flex-col justify-between overflow-hidden bg-primario p-12 text-white">
        <span className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15"><Icono nombre="spa" className="text-[22px]" /></span>
          <span className="text-lg font-extrabold">Diario &amp; Tinta</span>
        </span>
        <div className="flex flex-col gap-4">
          <h1 className="text-[40px] font-extrabold leading-tight">El puente entre escribir “no estoy bien” y hablar con alguien que puede ayudar.</h1>
          <ul className="flex flex-col gap-2 text-white/85">
            <li className="flex items-center gap-2"><Icono nombre="lock" className="text-[20px]" /> Tu diario es privado; tú decides qué compartir.</li>
            <li className="flex items-center gap-2"><Icono nombre="forum" className="text-[20px]" /> Una IA para desahogarte cuando lo necesites.</li>
            <li className="flex items-center gap-2"><Icono nombre="person_search" className="text-[20px]" /> Psicólogos compatibles cerca de ti.</li>
          </ul>
        </div>
        <p className="text-[13px] text-white/70">¿En crisis? Línea de la Vida 800 911 2000 · 911. Gratis, las 24 horas.</p>
        <span aria-hidden="true" className="pointer-events-none absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-white/10" />
        <span aria-hidden="true" className="pointer-events-none absolute right-24 bottom-40 h-24 w-24 rounded-full bg-white/10" />
      </aside>

      {/* Formulario */}
      <main className="flex justify-center px-4 py-8 md:py-12">
        <div className="flex w-full max-w-lg flex-col gap-6">
          <span className="flex items-center gap-2.5 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primario text-white"><Icono nombre="spa" className="text-[20px]" /></span>
            <span className="text-[15px] font-extrabold">Diario &amp; Tinta</span>
          </span>

          <div className="flex flex-col gap-1">
            <h2 className="text-[28px] font-extrabold leading-tight">{registro ? 'Crea tu cuenta' : 'Qué bueno verte de nuevo'}</h2>
            <p className="text-gris">{registro ? (pro ? 'Tu solicitud la revisa un encargado de la red antes de activarte.' : 'Tu primer mes es gratis. Puedes cancelar cuando quieras.') : 'Entra para continuar con tu diario.'}</p>
          </div>

          <div role="radiogroup" aria-label="Tipo de cuenta" className="grid grid-cols-2 gap-3">
            {ROLES.map(r => {
              const on = rol === r.id;
              return (
                <button key={r.id} type="button" role="radio" aria-checked={on} onClick={() => elegirRol(r.id)}
                  className={`flex flex-col gap-1.5 rounded-2xl border-2 p-4 text-left transition ${on ? 'border-primario bg-superficie shadow-tarjeta' : 'border-linea bg-superficie/60 hover:bg-superficie'}`}>
                  <span className="flex items-center justify-between">
                    <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${on ? 'bg-primario text-white' : 'bg-suave text-gris'}`}><Icono nombre={r.icono} /></span>
                    <Icono nombre={on ? 'radio_button_checked' : 'radio_button_unchecked'} className={on ? 'text-primario' : 'text-tenue'} />
                  </span>
                  <span className="font-extrabold">{r.titulo}</span>
                  <span className="text-[12px] leading-snug text-gris">{r.detalle}</span>
                </button>
              );
            })}
          </div>

          <form onSubmit={enviar} noValidate className="flex flex-col gap-4">
            {registro && (
              <Campo id="nombre" etiqueta={pro ? 'Nombre completo (como aparece en tu cédula)' : '¿Cómo te llamas?'} error={errores.nombre} ayuda={!pro && 'Puede ser solo tu nombre o un apodo.'}>
                <input id="nombre" value={d.nombre} onChange={set('nombre')} autoComplete="name" className={cls('nombre')} {...err('nombre')} />
              </Campo>
            )}
            <Campo id="correo" etiqueta="Correo electrónico" error={errores.correo}>
              <input id="correo" type="email" value={d.correo} onChange={set('correo')} autoComplete="email" placeholder="nombre@correo.com" className={cls('correo')} {...err('correo')} />
            </Campo>
            {registro && (
              <Campo id="telefono" etiqueta="Número de teléfono" error={errores.telefono} ayuda={pro ? 'Tu encargado te contactará a este número.' : 'Solo para recuperar tu cuenta o avisarte de una sesión. Nunca se comparte.'}>
                <div className="flex gap-2">
                  <span className="campo !w-auto flex-shrink-0 text-gris">🇲🇽 +52</span>
                  <input id="telefono" type="tel" inputMode="numeric" value={d.telefono} onChange={set('telefono')} autoComplete="tel-national" placeholder="871 123 4567" className={cls('telefono')} {...err('telefono')} />
                </div>
              </Campo>
            )}
            <Campo id="clave" etiqueta="Contraseña" error={errores.clave} ayuda={registro && 'Al menos 8 caracteres.'}>
              <div className="relative">
                <input id="clave" type={verClave ? 'text' : 'password'} value={d.clave} onChange={set('clave')} autoComplete={registro ? 'new-password' : 'current-password'} className={`${cls('clave')} pr-11`} {...err('clave')} />
                <button type="button" onClick={() => setVerClave(v => !v)} aria-label={verClave ? 'Ocultar contraseña' : 'Mostrar contraseña'} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-gris hover:bg-suave">
                  <Icono nombre={verClave ? 'visibility_off' : 'visibility'} className="text-[20px]" />
                </button>
              </div>
            </Campo>

            {registro && pro && (
              <fieldset className="tarjeta flex flex-col gap-4 p-5">
                <legend className="sr-only">Experiencia profesional</legend>
                <p className="flex items-center gap-2 font-extrabold"><Icono nombre="badge" className="text-primario" /> Tu experiencia</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Campo id="cedula" etiqueta="Cédula profesional" error={errores.cedula}>
                    <input id="cedula" inputMode="numeric" value={d.cedula} onChange={set('cedula')} placeholder="12345678" className={cls('cedula')} {...err('cedula')} />
                  </Campo>
                  <Campo id="anos" etiqueta="Años de experiencia" error={errores.anos}>
                    <select id="anos" value={d.anos} onChange={set('anos')} className={cls('anos')} {...err('anos')}>
                      <option value="">Elige…</option>
                      <option>Menos de 2</option><option>2 a 5</option><option>5 a 10</option><option>Más de 10</option>
                    </select>
                  </Campo>
                </div>
                <Campo id="ciudad" etiqueta="Ciudad donde atiendes">
                  <input id="ciudad" value={d.ciudad} onChange={set('ciudad')} className="campo" />
                </Campo>
                <div className="flex flex-col gap-1.5">
                  <span id="especialidades" tabIndex={-1} className="text-[13px] font-bold">Especialidades</span>
                  <div className="flex flex-wrap gap-1.5" role="group" aria-labelledby="especialidades">
                    {ESPECIALIDADES.map(e => (
                      <button key={e} type="button" aria-pressed={d.especialidades.includes(e)} onClick={() => alternarEsp(e)}
                        className={`rounded-full px-3 py-1.5 text-[13px] font-semibold transition ${d.especialidades.includes(e) ? 'bg-primario text-white' : 'bg-suave text-tinta hover:bg-linea'}`}>{e}</button>
                    ))}
                  </div>
                  {errores.especialidades && <p className="text-[12px] font-semibold text-alerta">{errores.especialidades}</p>}
                </div>
                <Campo id="experiencia" etiqueta="Cuéntanos tu experiencia" error={errores.experiencia} ayuda="Enfoque terapéutico, dónde has trabajado, con qué poblaciones.">
                  <textarea id="experiencia" rows="4" value={d.experiencia} onChange={set('experiencia')} placeholder="Ej.: 6 años en terapia cognitivo-conductual con adultos; consulta privada en Torreón y voluntariado en…" className={`${cls('experiencia')} resize-none`} {...err('experiencia')} />
                </Campo>
                <Campo id="cv" etiqueta="CV (opcional si escribiste tu experiencia)" error={errores.cv}>
                  <label htmlFor="cv" className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed p-4 transition hover:bg-suave ${errores.cv ? 'border-alerta' : 'border-linea'}`}>
                    <Icono nombre={d.cv ? 'description' : 'upload_file'} className="text-[28px] text-primario" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-bold">{d.cv ? d.cv.name : 'Sube tu CV'}</span>
                      <span className="block text-[12px] text-gris">{d.cv ? `${(d.cv.size / 1024).toFixed(0)} KB · se queda en tu dispositivo en este prototipo` : 'PDF o Word, máximo 5 MB'}</span>
                    </span>
                    {d.cv && <button type="button" onClick={e => { e.preventDefault(); setD(x => ({ ...x, cv: null })); }} className="text-[13px] font-bold text-gris underline">Quitar</button>}
                  </label>
                  <input id="cv" type="file" accept=".pdf,.doc,.docx" className="sr-only" onChange={e => setD(x => ({ ...x, cv: e.target.files?.[0] ?? null }))} />
                </Campo>
              </fieldset>
            )}

            {registro && (
              <div className="flex flex-col gap-2.5">
                <label className="flex items-start gap-2.5 text-[14px]">
                  <input id="privacidad" type="checkbox" checked={d.privacidad} onChange={set('privacidad')} className="mt-0.5 h-4 w-4 accent-primario" />
                  <span>Acepto el <span className="font-bold text-primario underline">aviso de privacidad</span> y los términos de uso.</span>
                </label>
                {errores.privacidad && <p className="text-[12px] font-semibold text-alerta">{errores.privacidad}</p>}
                {!pro && (
                  <>
                    <label className="flex items-start gap-2.5 text-[14px]">
                      <input id="salud" type="checkbox" checked={d.salud} onChange={set('salud')} className="mt-0.5 h-4 w-4 accent-primario" />
                      <span>Autorizo guardar mis registros de ánimo y diario, que son <b>datos sensibles de salud</b>, solo para darme este servicio.</span>
                    </label>
                    {errores.salud && <p className="text-[12px] font-semibold text-alerta">{errores.salud}</p>}
                  </>
                )}
              </div>
            )}

            {!registro && (
              <div className="flex justify-end -mt-1">
                <button type="button" onClick={() => aviso('Te enviaríamos un enlace a tu correo (ejemplo)')} className="text-[13px] font-bold text-primario hover:underline">¿Olvidaste tu contraseña?</button>
              </div>
            )}

            <button type="submit" className="boton-primario !py-3 text-[15px]">
              {registro ? (pro ? 'Enviar solicitud' : 'Crear cuenta y empezar mi mes gratis') : 'Entrar'}
            </button>
          </form>

          <p className="text-center text-[14px] text-gris">
            {registro ? '¿Ya tienes cuenta? ' : '¿Todavía no tienes cuenta? '}
            <Link to={`${registro ? '/entrar' : '/registro'}${pro ? '?rol=psicologo' : ''}`} className="font-bold text-primario hover:underline">{registro ? 'Inicia sesión' : 'Regístrate'}</Link>
          </p>
          <p className="lg:hidden text-center text-[13px] font-semibold text-alerta">¿En crisis? Línea de la Vida <a href="tel:8009112000" className="underline">800 911 2000</a> · <a href="tel:911" className="underline">911</a></p>
          <p className="text-center text-[12px] text-tenue">Prototipo: no se guarda ni se envía ningún dato.</p>
        </div>
      </main>
    </div>
  );
}
