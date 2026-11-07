import { useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Icono } from './ui';
import { useApp } from '../estado';
import { CONTACTO_CONFIANZA, LINEAS_CRISIS, USUARIA } from '../data/ejemplo';
import { PSICOLOGA } from '../data/pro';
import { useAviso } from './ui';

const NAV_USUARIA = [
  { a: '/', txt: 'Hoy', icono: 'today' },
  { a: '/psicologos', txt: 'Psicólogos', icono: 'person_search' },
  { a: '/hablar', txt: 'Hablar', icono: 'forum' },
  { a: '/escribir', txt: 'Escribir', icono: 'edit_note' },
];
const NAV_PRO = [
  { a: '/pro', txt: 'Pacientes', icono: 'groups' },
  { a: '/pro/encargado', txt: 'Encargado', icono: 'support_agent' },
];

const Marca = ({ pro }) => (
  <span className="flex items-center gap-2.5">
    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primario text-white"><Icono nombre="spa" className="text-[20px]" /></span>
    <span className="flex flex-col leading-tight">
      <span className="text-[15px] font-extrabold">Diario &amp; Tinta</span>
      <span className="flex items-center gap-1 whitespace-nowrap text-[11px] font-semibold text-gris">{pro ? <><Icono nombre="medical_services" className="text-[12px]" /> Panel de psicólogos</> : <><Icono nombre="lock" className="text-[12px]" /> Privado y confidencial</>}</span>
    </span>
  </span>
);

function BotonAyuda({ compacto }) {
  const { setCrisisAbierta } = useApp();
  return (
    <button type="button" onClick={() => setCrisisAbierta(true)}
      className={`boton whitespace-nowrap border border-alerta/30 bg-alerta-suave text-alerta hover:bg-[#fbd9d5] ${compacto ? 'px-3 py-1.5 text-[13px]' : 'w-full'}`}>
      <Icono nombre="emergency" lleno className="text-[18px]" /> {compacto ? 'Ayuda' : 'Ayuda ahora'}
    </button>
  );
}

function HojaCrisis() {
  const { crisisAbierta, setCrisisAbierta } = useApp();
  const aviso = useAviso();
  useEffect(() => {
    if (!crisisAbierta) return;
    const esc = e => e.key === 'Escape' && setCrisisAbierta(false);
    addEventListener('keydown', esc);
    return () => removeEventListener('keydown', esc);
  }, [crisisAbierta, setCrisisAbierta]);
  if (!crisisAbierta) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-center bg-tinta/40 p-0 md:p-6" onClick={() => setCrisisAbierta(false)}>
      <div role="dialog" aria-modal="true" aria-labelledby="t-crisis" onClick={e => e.stopPropagation()}
        className="aparece w-full md:max-w-md rounded-t-3xl md:rounded-3xl bg-superficie p-6 pb-8 shadow-flotante">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="t-crisis" className="text-xl font-extrabold">No estás solo</h2>
            <p className="text-gris">Si estás en peligro o piensas en hacerte daño, habla ahora con alguien.</p>
          </div>
          <button type="button" onClick={() => setCrisisAbierta(false)} aria-label="Cerrar" className="rounded-full p-1.5 hover:bg-suave"><Icono nombre="close" /></button>
        </div>
        <div className="mt-5 flex flex-col gap-2.5">
          {LINEAS_CRISIS.map(l => (
            <a key={l.tel} href={`tel:${l.tel}`} className="flex items-center gap-3 rounded-2xl border border-alerta/25 bg-alerta-suave p-4 hover:bg-[#fbd9d5]">
              <Icono nombre="call" lleno className="text-[24px] text-alerta" />
              <span className="flex-1">
                <span className="block font-bold">{l.nombre} · {l.numero}</span>
                <span className="block text-[13px] text-gris">{l.detalle}</span>
              </span>
            </a>
          ))}
          <button type="button" onClick={() => { aviso(`En la app real se avisaría a ${CONTACTO_CONFIANZA.nombre}`); setCrisisAbierta(false); }}
            className="flex items-center gap-3 rounded-2xl border border-linea p-4 text-left hover:bg-suave">
            <Icono nombre="family_restroom" className="text-[24px] text-primario" />
            <span className="flex-1">
              <span className="block font-bold">Avisar a {CONTACTO_CONFIANZA.nombre}</span>
              <span className="block text-[13px] text-gris">Tu contacto de confianza recibe un mensaje para que te llame</span>
            </span>
          </button>
        </div>
        <p className="mt-4 text-[12px] text-tenue">Esta ayuda es siempre gratuita, aunque tu suscripción haya vencido.</p>
      </div>
    </div>
  );
}

export default function Layout({ pro = false }) {
  const NAV = pro ? NAV_PRO : NAV_USUARIA;
  const { pathname } = useLocation();
  const { letra } = useApp();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  useEffect(() => { document.documentElement.style.fontSize = { chica: '14px', normal: '16px', grande: '18px' }[letra]; }, [letra]);

  return (
    <div className="min-h-screen md:flex">
      {/* Lateral (escritorio) */}
      <aside className="hidden md:flex md:w-64 lg:w-72 flex-shrink-0 flex-col gap-8 border-r border-linea bg-superficie px-5 py-6 sticky top-0 h-screen">
        <Marca pro={pro} />
        <nav aria-label="Principal" className="flex flex-col gap-1">
          {NAV.map(n => (
            <NavLink key={n.a} to={n.a} end
              className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-semibold transition ${isActive ? 'bg-primario-suave text-primario-oscuro' : 'text-gris hover:bg-suave hover:text-tinta'}`}>
              {({ isActive }) => <><Icono nombre={n.icono} lleno={isActive} className="text-[22px]" />{n.txt}</>}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-3">
          {pro ? (
            <>
              <div className="flex items-center gap-3 rounded-xl p-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primario text-sm font-bold text-white">{PSICOLOGA.iniciales}</span>
                <span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold">{PSICOLOGA.nombre}</span><span className="block text-[12px] text-gris">★ {PSICOLOGA.calificacion} · {PSICOLOGA.ciudad}</span></span>
              </div>
              <NavLink to="/" className="boton-borde w-full"><Icono nombre="swap_horiz" className="text-[18px]" /> Vista de usuaria</NavLink>
              <NavLink to="/entrar?rol=psicologo" className="text-center text-[12px] font-semibold text-gris hover:text-primario">Cerrar sesión</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/ajustes" className={({ isActive }) => `flex items-center gap-3 rounded-xl p-2 transition ${isActive ? 'bg-primario-suave' : 'hover:bg-suave'}`}>
                <img src={USUARIA.foto} alt="" className="h-10 w-10 rounded-full object-cover" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold">{USUARIA.nombre}</span>
                  <span className="block text-[12px] text-gris">Ajustes y privacidad</span>
                </span>
                <Icono nombre="settings" className="text-gris" />
              </NavLink>
              <BotonAyuda />
              <div className="flex justify-center gap-3 text-[12px] font-semibold text-gris">
                <NavLink to="/pro" className="hover:text-primario">¿Eres psicólogo?</NavLink>
                <span aria-hidden="true">·</span>
                <NavLink to="/entrar" className="hover:text-primario">Cerrar sesión</NavLink>
              </div>
            </>
          )}
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        {/* Barra superior (móvil) */}
        <header className="md:hidden sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-linea bg-fondo/90 px-4 py-3 backdrop-blur">
          <Marca pro={pro} />
          {pro ? (
            <NavLink to="/" className="boton-borde !px-3 !py-1.5 text-[13px]"><Icono nombre="swap_horiz" className="text-[18px]" /> Usuaria</NavLink>
          ) : (
            <div className="flex items-center gap-2">
              <BotonAyuda compacto />
              <NavLink to="/ajustes" aria-label="Ajustes"><img src={USUARIA.foto} alt="" className="h-9 w-9 rounded-full object-cover" /></NavLink>
            </div>
          )}
        </header>

        <main className="mx-auto w-full max-w-[1120px] px-4 md:px-8 pt-5 md:pt-10 pb-28 md:pb-12">
          <Outlet />
        </main>
      </div>

      {/* Navegación inferior (móvil) */}
      <nav aria-label="Principal" className="md:hidden fixed inset-x-0 bottom-0 z-40 border-t border-linea bg-superficie/95 backdrop-blur" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className={`grid ${pro ? 'grid-cols-2' : 'grid-cols-4'}`}>
          {NAV.map(n => (
            <NavLink key={n.a} to={n.a} end className={({ isActive }) => `flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-bold ${isActive ? 'text-primario' : 'text-tenue'}`}>
              {({ isActive }) => <>
                <span className={`flex h-7 w-14 items-center justify-center rounded-full ${isActive ? 'bg-primario-suave' : ''}`}><Icono nombre={n.icono} lleno={isActive} className="text-[22px]" /></span>
                {n.txt}
              </>}
            </NavLink>
          ))}
        </div>
      </nav>
      <HojaCrisis />
    </div>
  );
}
