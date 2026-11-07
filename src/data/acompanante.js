// Acompañante de IA para Escribir. En el prototipo las respuestas se arman en el navegador
// a partir de plantillas; en la app real las daría un modelo de IA con estas mismas reglas.

export const PERSONALIDADES = [
  { id: 'escucha', nombre: 'Escucha', icono: 'hearing', color: 'bg-azul-suave text-azul', cuando: 'Solo quiero sacarlo', como: 'Valida y pregunta poco. No da consejos.', voz: { rate: 0.95, pitch: 1 } },
  { id: 'compania', nombre: 'Compañía', icono: 'favorite', color: 'bg-alerta-suave text-alerta', cuando: 'Me siento solo', como: 'Cálida y conversadora.', voz: { rate: 1, pitch: 1.1 } },
  { id: 'orden', nombre: 'Orden', icono: 'format_list_bulleted', color: 'bg-ambar-suave text-ambar', cuando: 'Tengo todo revuelto', como: 'Separa qué pasó, qué sentiste y qué puedes hacer.', voz: { rate: 1.03, pitch: 1 } },
  { id: 'calma', nombre: 'Calma', icono: 'air', color: 'bg-exito-suave text-exito', cuando: 'Estoy ansioso', como: 'Respiración y ejercicios para aterrizar.', voz: { rate: 0.85, pitch: 0.92 } },
];

const TEMAS = [
  { id: 'sueño', re: /dorm|sueño|insomn|desvel|noche/i, txt: 'el sueño' },
  { id: 'trabajo', re: /trabaj|jefe|junta|oficina|chamba|empleo/i, txt: 'el trabajo' },
  { id: 'soledad', re: /sol[oa]\b|soledad|nadie|aislad/i, txt: 'sentirte solo' },
  { id: 'familia', re: /mam[aá]|pap[aá]|famil|herman|hij/i, txt: 'tu familia' },
  { id: 'pareja', re: /pareja|novi[oa]|espos[oa]|ruptura|terminamos/i, txt: 'tu pareja' },
];
const RIESGO = /(morir|matarme|no quiero vivir|hacerme daño|suicid|desaparecer para siempre|no tiene caso seguir)/i;

export const detectarTemas = texto => TEMAS.filter(t => t.re.test(texto)).map(t => t.id);

export function responder(personalidad, texto) {
  if (RIESGO.test(texto)) {
    return {
      crisis: true,
      texto: 'Lo que escribiste me importa mucho. Voy a dejar a un lado mi estilo: ahora lo más importante es que hables con una persona. Puedes llamar a la Línea de la Vida, 800 911 2000, o al 911. ¿Quieres que te muestre cómo pedir ayuda ahora?',
    };
  }
  const tema = TEMAS.find(t => t.re.test(texto));
  const sobre = tema ? ` sobre ${tema.txt}` : '';
  const R = {
    escucha: `Te leo. Gracias por contarme esto${sobre}. No tienes que tenerlo resuelto; lo que sientes tiene sentido. Si quieres, sigue: aquí estoy.`,
    compania: `Qué bueno que lo sacaste. Me quedo contigo un rato. Lo que cuentas${sobre} suena pesado de cargar a solas. ¿Hay alguien con quien te gustaría hablarlo esta semana?`,
    orden: `Vamos por partes. Qué pasó: lo que describes${sobre}. Qué sentiste: ponle un nombre, aunque sea aproximado. Qué puedes hacer: elige un paso pequeño para mañana. ¿Cuál sería?`,
    calma: `Gracias por escribirlo${sobre}. Antes de seguir, respiremos juntos: inhala 4 segundos, sostén 4 y exhala 6. Repite tres veces. Luego nota cinco cosas que puedas ver a tu alrededor.`,
  };
  return { crisis: false, texto: R[personalidad] ?? R.escucha, tema: tema?.id };
}

// ---------- Voz de la IA (síntesis del navegador) ----------
export function hablar(texto, personalidad, alTerminar) {
  const ss = window.speechSynthesis;
  if (!ss) return false;
  ss.cancel();
  const u = new SpeechSynthesisUtterance(texto);
  const voces = ss.getVoices();
  u.voice = voces.find(v => v.lang === 'es-MX') || voces.find(v => v.lang?.startsWith('es')) || null;
  u.lang = u.voice?.lang || 'es-MX';
  const p = PERSONALIDADES.find(x => x.id === personalidad)?.voz ?? {};
  u.rate = p.rate ?? 1; u.pitch = p.pitch ?? 1;
  u.onend = u.onerror = () => alTerminar?.();
  ss.speak(u);
  return true;
}
export const callar = () => window.speechSynthesis?.cancel();
