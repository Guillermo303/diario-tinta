import { useEffect, useRef, useState } from 'react';
import { Icono } from './ui';

const mmss = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

// Graba una nota de voz con el micrófono y, si el navegador lo permite, la transcribe en vivo.
// Todo se queda en el dispositivo: el audio vive como un enlace temporal (blob) en memoria.
export default function Grabadora({ onListo, onError }) {
  const [estado, setEstado] = useState('libre'); // libre | grabando
  const [segundos, setSegundos] = useState(0);
  const [nivel, setNivel] = useState(Array(24).fill(0.1));
  const [vivo, setVivo] = useState('');
  const r = useRef({});

  useEffect(() => () => detenerTodo(), []);

  function detenerTodo() {
    const x = r.current;
    clearInterval(x.reloj); cancelAnimationFrame(x.anim);
    try { x.reconocer?.stop(); } catch { /* ya detenido */ }
    x.stream?.getTracks().forEach(t => t.stop());
    x.ctx?.close?.();
  }

  async function empezar() {
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) return onError('Tu navegador no permite grabar audio. Prueba con Chrome o Edge.');
    let stream;
    try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); }
    catch { return onError('No pudimos usar el micrófono. Revisa el permiso del navegador e inténtalo otra vez.'); }
    const x = r.current = { stream, partes: [], texto: '' };

    x.grabador = new MediaRecorder(stream);
    x.grabador.ondataavailable = e => e.data.size && x.partes.push(e.data);
    x.grabador.onstop = () => {
      const blob = new Blob(x.partes, { type: x.grabador.mimeType || 'audio/webm' });
      onListo({ url: URL.createObjectURL(blob), duracion: Math.max(1, Math.round((Date.now() - x.inicio) / 1000)), transcripcion: x.texto.trim() });
      detenerTodo();
    };
    x.grabador.start(); x.inicio = Date.now();
    setEstado('grabando'); setSegundos(0); setVivo('');
    x.reloj = setInterval(() => setSegundos(Math.round((Date.now() - x.inicio) / 1000)), 250);

    // Barras de nivel del micrófono
    try {
      x.ctx = new AudioContext();
      const an = x.ctx.createAnalyser(); an.fftSize = 64;
      x.ctx.createMediaStreamSource(stream).connect(an);
      const datos = new Uint8Array(an.frequencyBinCount);
      const pinta = () => { an.getByteFrequencyData(datos); setNivel(Array.from(datos.slice(0, 24), v => Math.max(0.08, v / 255))); x.anim = requestAnimationFrame(pinta); };
      pinta();
    } catch { /* sin barras */ }

    // Transcripción en vivo (Chrome, Edge, Safari)
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) {
      const rec = new SR(); rec.lang = 'es-MX'; rec.continuous = true; rec.interimResults = true;
      rec.onresult = e => {
        let final = '', parcial = '';
        for (const res of e.results) (res.isFinal ? (final += res[0].transcript + ' ') : (parcial += res[0].transcript));
        x.texto = final; setVivo(final + parcial);
      };
      rec.onerror = () => {};
      try { rec.start(); x.reconocer = rec; } catch { /* ignorar */ }
    }
  }

  function terminar() {
    setEstado('libre');
    try { r.current.reconocer?.stop(); } catch { /* ya detenido */ }
    // Damos un instante para que llegue el último fragmento de texto
    setTimeout(() => r.current.grabador?.state === 'recording' && r.current.grabador.stop(), 350);
  }

  if (estado === 'grabando') {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-alerta-suave/60 p-6">
        <div className="flex h-14 items-end gap-1" aria-hidden="true">
          {nivel.map((v, i) => <span key={i} className="w-1.5 rounded-full bg-alerta transition-[height] duration-75" style={{ height: `${v * 100}%` }} />)}
        </div>
        <p className="flex items-center gap-2 text-[15px] font-bold text-alerta"><span className="h-2.5 w-2.5 animate-pulse rounded-full bg-alerta" /> Grabando · {mmss(segundos)}</p>
        {vivo && <p className="max-w-md text-center text-[14px] italic text-gris">“{vivo}”</p>}
        <button type="button" onClick={terminar} className="boton bg-alerta !px-6 !py-3 text-white hover:bg-[#9a1f18]"><Icono nombre="stop" lleno className="text-[22px]" /> Terminar</button>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-linea p-6 text-center">
      <button type="button" onClick={empezar} aria-label="Empezar a grabar"
        className="flex h-20 w-20 items-center justify-center rounded-full bg-primario text-white shadow-flotante transition hover:bg-primario-oscuro active:scale-95">
        <Icono nombre="mic" lleno className="text-[36px]" />
      </button>
      <p className="font-bold">Toca para grabar tu nota de voz</p>
      <p className="max-w-sm text-[13px] text-gris">Habla con calma, sin prisa. Si tu navegador lo permite, la escribimos por ti mientras hablas.</p>
    </div>
  );
}

export const duracionTexto = mmss;
