// Datos de ejemplo del prototipo. Nada de esto se guarda ni se envía a un servidor.
const DIA = 864e5;
const hoy = new Date();
export const haceDias = n => new Date(hoy.getTime() - n * DIA);

export const USUARIA = {
  nombre: 'Ana Lucía',
  frase: 'Coleccionista de tardes lluviosas y cartas sin prisa.',
  ciudad: 'Torreón, Coah.',
  foto: '/img/foto-02.jpg',
};

export const ANIMOS = [
  { id: 'calma', txt: 'Calma', emoji: '🌿', color: 'bg-exito-suave', tono: 'text-exito' },
  { id: 'alegria', txt: 'Alegría', emoji: '☀️', color: 'bg-ambar-suave', tono: 'text-ambar' },
  { id: 'cansancio', txt: 'Cansancio', emoji: '🌙', color: 'bg-suave', tono: 'text-gris' },
  { id: 'tristeza', txt: 'Tristeza', emoji: '🌧️', color: 'bg-azul-suave', tono: 'text-azul' },
  { id: 'ansiedad', txt: 'Ansiedad', emoji: '🌀', color: 'bg-lila-suave', tono: 'text-lila' },
];

// Últimos 6 días (el 7.º es hoy y lo registra la persona).
export const SEMANA = ['alegria', 'cansancio', 'ansiedad', 'cansancio', 'ansiedad', 'calma'];

export const TERAPEUTA = {
  nombre: 'Psic. Elena Ruiz',
  iniciales: 'ER',
  enfoque: 'Psicoterapia cognitivo-conductual',
  horario: 'Responde lun–vie, 9:00–19:00',
  ciudad: 'cdmx',
  sesion: { dia: 'Jueves 13 de noviembre', hora: '17:00', modo: 'Videollamada · 50 min' },
};

export const MENSAJES_TERAPEUTA = [
  { de: 'ella', texto: 'Hola, recuerda que puedes usar este espacio entre sesiones. Respondo en horario laboral; no es un canal de emergencias.', fecha: haceDias(6) },
  { de: 'yo', texto: 'Gracias. Esta semana probé escribir antes de dormir, como acordamos. Me ayudó a ordenar lo del trabajo.', fecha: haceDias(4) },
  { de: 'ella', texto: 'Qué bueno que lo intentaste. Si quieres, comparte una de esas notas y la revisamos el jueves.', fecha: haceDias(4), nuevo: true },
];

export const PAGINAS = [
  { id: 'p1', titulo: 'Tercera noche sin dormir', texto: 'Le doy vueltas a la junta de mañana. Siento que todo me sale mal en el trabajo aunque sé que no es cierto.', etiquetas: ['sueño', 'trabajo'], priv: 'terapeuta', fecha: haceDias(1) },
  { id: 'p2', titulo: 'El tren de las 6', texto: 'Hoy pensé que llego tarde a mis propias ideas, pero llego. Quiero hablar de esto en la próxima sesión.', etiquetas: ['ideas', 'terapia'], priv: 'privado', fecha: haceDias(3) },
  { id: 'p3', titulo: 'Caminata después del trabajo', texto: 'Caminé por la alameda al atardecer. Por primera vez en días no pensé en pendientes.', etiquetas: ['gratitud'], priv: 'terapeuta', fecha: haceDias(6) },
];

export const ETIQUETAS = ['sueño', 'trabajo', 'familia', 'pareja', 'gratitud', 'ideas', 'terapia'];

export const CHISPAS = [
  '¿Qué pequeño detalle de hoy merece quedarse en papel?',
  '¿Qué te quitó energía hoy y qué te la devolvió?',
  'Si tu cansancio hablara, ¿qué te pediría?',
  'Escribe tres cosas que sí hiciste hoy, aunque parezcan pequeñas.',
  '¿Con quién te gustaría hablar esta semana y por qué?',
];

export const SITUACION = [
  { icono: 'bedtime', txt: 'Duermes poco' },
  { icono: 'work', txt: 'Estrés por el trabajo' },
  { icono: 'cyclone', txt: 'Ansiedad por la noche' },
];

export const PSICOLOGOS = [
  {
    id: 'lm', estrellas: 4.9, resenas: 38, resena: { texto: 'Me ayudó a volver a dormir sin pastillas. Explica todo con calma.', autor: 'Paciente de 27 años' }, iniciales: 'LM', nombre: 'Psic. Laura Méndez', ciudad: 'torreon', lugar: 'Torreón, Coah.', distancia: 'a 3 km', modo: 'Presencial y en línea',
    compat: 96, precio: 550, libre: 'Mañana, 18:00', color: 'bg-primario',
    ayuda: 'Trabaja la autocrítica y el cansancio que registraste esta semana, y te ayuda a recuperar una rutina de sueño.',
    enfoques: ['Depresión', 'Cognitivo-conductual', 'Sueño'],
    razones: ['Mencionaste el sueño 5 veces esta semana.', 'Registraste cansancio y ansiedad; trabaja ambos.', 'Está a 3 km y tiene horario después del trabajo.'],
  },
  {
    id: 'av', estrellas: 4.8, resenas: 52, resena: { texto: 'Práctico y directo; por fin aprendí a decir que no en el trabajo.', autor: 'Paciente de 31 años' }, iniciales: 'AV', nombre: 'Psic. Andrés Villarreal', ciudad: 'gomez', lugar: 'Gómez Palacio, Dgo.', distancia: 'a 9 km', modo: 'Presencial',
    compat: 91, precio: 500, libre: 'Lun 10 nov, 17:00', color: 'bg-azul',
    ayuda: 'Se especializa en estrés y agotamiento laboral, el tema que más aparece en tus notas. Te ayuda a poner límites.',
    enfoques: ['Estrés laboral', 'Ansiedad', 'Aceptación y compromiso'],
    razones: ['El trabajo sigue siendo tu tema principal.', 'Calificaste con 5/5 tu llamada con él.', 'Bajó al lugar 2 porque esta semana pesó más el sueño.'],
  },
  {
    id: 'sg', estrellas: 4.7, resenas: 24, resena: { texto: 'Las sesiones en línea me quedan perfectas de noche.', autor: 'Paciente de 22 años' }, iniciales: 'SG', nombre: 'Mtra. Sofía Garza', ciudad: 'monterrey', lugar: 'Monterrey, N.L.', distancia: 'en línea', modo: 'Solo en línea',
    compat: 87, precio: 600, libre: 'Hoy, 20:30', color: 'bg-lila',
    ayuda: 'Usa mindfulness para la ansiedad nocturna y los pensamientos que no te dejan dormir. Sesiones desde casa.',
    enfoques: ['Ansiedad', 'Mindfulness', 'Insomnio'],
    razones: ['Escribes casi siempre después de las 23:00.', 'Marcaste que te acomoda la modalidad en línea.', 'Tiene espacio hoy por la noche.'],
  },
];

// Opciones de reemplazo cuando la persona pide "ver otra opción".
export const ALTERNATIVOS = [
  {
    id: 'dO', estrellas: 4.6, resenas: 17, resena: { texto: 'Sesiones cortas con tareas claras para la semana.', autor: 'Paciente de 25 años' }, iniciales: 'DO', nombre: 'Psic. Daniel Ortega', ciudad: 'saltillo', lugar: 'Saltillo, Coah.', distancia: 'en línea', modo: 'En línea',
    compat: 84, precio: 480, libre: 'Mié 12 nov, 19:00', color: 'bg-ambar',
    ayuda: 'Acompaña a adultos jóvenes con ansiedad y presión laboral, con sesiones breves y tareas concretas.',
    enfoques: ['Ansiedad', 'Adultos jóvenes', 'Breve'],
    razones: ['Prefieres sesiones cortas y prácticas.', 'Atiende en tu horario disponible.', 'Precio dentro de tu presupuesto.'],
  },
  {
    id: 'mr', estrellas: 4.8, resenas: 29, resena: { texto: 'Dejé de ser tan dura conmigo misma.', autor: 'Paciente de 33 años' }, iniciales: 'MR', nombre: 'Psic. Mariana Robles', ciudad: 'guadalajara', lugar: 'Guadalajara, Jal.', distancia: 'en línea', modo: 'En línea',
    compat: 82, precio: 520, libre: 'Vie 14 nov, 9:00', color: 'bg-exito',
    ayuda: 'Terapia centrada en la compasión para la autocrítica y el agotamiento.',
    enfoques: ['Autocrítica', 'Compasión', 'Agotamiento'],
    razones: ['Hablas seguido de exigirte demasiado.', 'Tiene horario por la mañana.', 'Buenas calificaciones en casos parecidos al tuyo.'],
  },
];

export const OTRAS_AYUDAS = [
  { icono: 'bedtime', titulo: 'Taller "Dormir mejor"', detalle: '4 sesiones en grupo · en línea · $150' },
  { icono: 'groups', titulo: 'Grupo de apoyo, Torreón', detalle: 'Martes 19:00 · gratuito · con becarios de psicología' },
];


export const LINEAS_CRISIS = [
  { nombre: 'Línea de la Vida', numero: '800 911 2000', tel: '8009112000', detalle: 'Gratuita, 24 horas, todo México' },
  { nombre: 'Emergencias', numero: '911', tel: '911', detalle: 'Si tu vida corre peligro ahora' },
];

export const CONTACTO_CONFIANZA = { nombre: 'Mamá (Rosa)', relacion: 'Contacto de confianza' };
