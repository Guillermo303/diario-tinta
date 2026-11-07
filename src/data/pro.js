// Datos de ejemplo de la vista de psicólogos. Personas inventadas.
import { haceDias } from './ejemplo';

const horas = n => new Date(Date.now() - n * 36e5);

export const PSICOLOGA = {
  nombre: 'Psic. Laura Méndez', corto: 'Laura', iniciales: 'LM', ciudad: 'Torreón, Coah.',
  cedula: '12345678', tarifa: 550, calificacion: 4.9,
};

export const SOLICITUDES = [
  {
    id: 's1', nombre: 'Ana Lucía', iniciales: 'AL', color: 'bg-azul', compat: 96, edad: 29,
    pide: 'Llamada de orientación de 15 min', cuando: 'Mañana, 18:00', temas: ['Sueño', 'Estrés laboral', 'Ansiedad nocturna'],
    nota: 'La app te recomendó porque mencionó el sueño 5 veces esta semana. Compartió 2 notas y su semana de ánimo.',
  },
  {
    id: 's2', nombre: 'Jorge P.', iniciales: 'JP', color: 'bg-ambar', compat: 89, edad: 41,
    pide: 'Primera sesión completa', cuando: 'Jue 13 nov, 19:00', temas: ['Duelo', 'Cansancio'],
    nota: 'Prefiere presencial. No ha compartido notas todavía.',
  },
];

export const ALERTAS = [
  { id: 'a1', paciente: 'Valeria R.', nivel: 'alta', motivo: 'Ánimo bajo 5 días seguidos y una frase de riesgo en su charla con la IA.', hace: 'hace 25 min', limite: 'Revisar antes de 1 h 35 min' },
  { id: 'a2', paciente: 'Daniel C.', nivel: 'media', motivo: 'Dejó de escribir 6 días después de una racha diaria.', hace: 'hace 3 h', limite: 'Revisar hoy' },
];

export const PACIENTES = [
  {
    id: 'p1', nombre: 'Valeria R.', iniciales: 'VR', color: 'bg-lila', desde: 'Paciente desde agosto', proxima: 'Hoy, 20:00 · Videollamada',
    animo: ['tristeza', 'tristeza', 'cansancio', 'tristeza', 'ansiedad', 'tristeza', 'tristeza'],
    compartido: ['Semana de ánimo', 'Nota: "No le encuentro sentido"', 'Resumen de su charla con la IA'],
    resumen: 'Habla de aislamiento y cansancio. En su charla de anoche dijo que "no tiene caso seguir así". La IA le mostró las líneas de crisis y le ofreció hablar contigo.',
    mensajes: [
      { de: 'ella', texto: 'Hola Laura, anoche fue muy difícil. No sé si pueda esperar a la sesión.', fecha: horas(1) },
    ],
  },
  {
    id: 'p2', nombre: 'Daniel C.', iniciales: 'DC', color: 'bg-exito', desde: 'Paciente desde junio', proxima: 'Lun 10 nov, 17:00 · Presencial',
    animo: ['calma', 'alegria', 'calma', 'cansancio', null, null, null],
    compartido: ['Semana de ánimo'],
    resumen: 'Venía escribiendo a diario sobre su nuevo trabajo; lleva 6 días sin registrar nada.',
    mensajes: [
      { de: 'yo', texto: 'Hola Daniel, ¿cómo te fue con la tarea de las caminatas?', fecha: haceDias(5) },
      { de: 'ella', texto: '¡Bien! Llevo 3 días seguidos.', fecha: haceDias(5) },
    ],
  },
  {
    id: 'p3', nombre: 'Sofía T.', iniciales: 'ST', color: 'bg-azul', desde: 'Paciente desde octubre', proxima: 'Mié 12 nov, 18:00 · En línea',
    animo: ['ansiedad', 'calma', 'calma', 'alegria', 'calma', 'alegria', 'calma'],
    compartido: ['Semana de ánimo', 'Nota: "Primera noche que duermo bien"'],
    resumen: 'Mejora sostenida esta semana. Practica la respiración con la IA en modo Calma antes de dormir.',
    mensajes: [
      { de: 'ella', texto: 'Por fin dormí 7 horas. Gracias por el ejercicio.', fecha: haceDias(1) },
      { de: 'yo', texto: '¡Qué gusto! Anótalo en tu diario para verlo el miércoles.', fecha: haceDias(1) },
    ],
  },
];

export const RESPUESTAS_RAPIDAS = ['¿Cómo te sientes ahora?', 'Te llamo en 10 minutos.', 'Hagamos juntos la respiración 4·4·6.'];

// ---------- Encargado ----------
export const ENCARGADO = {
  nombre: 'Lic. Jorge Salinas', iniciales: 'JS', puesto: 'Coordinador de la red en La Laguna',
  horario: 'Responde lun–sáb, 8:00–20:00', telefono: '871 000 0000',
};

export const MENSAJES_ENCARGADO = [
  { de: 'el', texto: '¡Bienvenida a la red, Laura! Ya quedó verificada tu cédula. Solo falta tu seguro de responsabilidad profesional para activar las guardias nocturnas.', fecha: haceDias(9) },
  { de: 'yo', texto: 'Gracias, Jorge. Lo subo esta semana. ¿El primer pago llega el 15?', fecha: haceDias(8) },
  { de: 'el', texto: 'Sí: pagamos los días 15 y 30 por transferencia. Te dejo el detalle en la pestaña de Pagos.', fecha: haceDias(8) },
];

export const CONTRATACION = [
  { txt: 'Cédula profesional verificada', hecho: true },
  { txt: 'Identificación oficial', hecho: true },
  { txt: 'Constancia de situación fiscal (RFC)', hecho: true },
  { txt: 'Contrato de colaboración firmado', hecho: true },
  { txt: 'Capacitación: protocolo de crisis (2 h)', hecho: true },
  { txt: 'Capacitación: la plataforma y uso ético de la IA (1 h)', hecho: true },
  { txt: 'Seguro de responsabilidad profesional', hecho: false },
];

export const CONDICIONES = [
  { icono: 'videocam', titulo: '$90 por llamada de 15 min', detalle: 'Llamadas de orientación que la app te asigna o que tú aceptas.' },
  { icono: 'percent', titulo: '15 % por sesión agendada', detalle: 'Tú fijas tu tarifa y conservas el 85 %. Sin cuota de entrada.' },
  { icono: 'balance', titulo: 'Sin pagar por aparecer', detalle: 'El orden de las recomendaciones depende solo de la compatibilidad.' },
  { icono: 'event_repeat', titulo: 'Pagos los días 15 y 30', detalle: 'Por transferencia bancaria, con estado de cuenta y factura.' },
];

export const PAGOS = {
  periodo: '1 – 15 de noviembre',
  proximo: { fecha: '15 nov', monto: 2895 },
  movimientos: [
    { concepto: 'Llamadas de orientación (42 × $90)', monto: 3780, tipo: 'abono' },
    { concepto: 'Bono por guardia nocturna (1)', monto: 600, tipo: 'abono' },
    { concepto: 'Comisión 15 % de 18 sesiones agendadas ($9,900 que cobraste)', monto: -1485, tipo: 'cargo' },
  ],
  sesionesCobradas: 9900,
  historial: [
    { fecha: '31 oct', monto: 2310, estado: 'Pagado' },
    { fecha: '15 oct', monto: 1980, estado: 'Pagado' },
    { fecha: '30 sep', monto: 1240, estado: 'Pagado' },
  ],
  cuenta: 'CLABE •••• 4821',
};

export const OFERTAS = [
  { id: 'o1', icono: 'nights_stay', titulo: 'Guardias nocturnas de revisión de alertas', detalle: 'Lun y jue, 22:00–02:00 · en línea', pago: '$180 por hora', lugares: '2 lugares', requisito: 'Requiere seguro de responsabilidad profesional' },
  { id: 'o2', icono: 'factory', titulo: 'Empresa de autopartes en Torreón (NOM-035)', detalle: '120 empleados · 8 h por semana · presencial', pago: '$350 por hora', lugares: '1 lugar' },
  { id: 'o3', icono: 'bedtime', titulo: 'Taller grupal “Dormir mejor”', detalle: '4 sesiones de 90 min · en línea', pago: '$2,400 por taller', lugares: '1 lugar' },
  { id: 'o4', icono: 'school', titulo: 'Supervisión de pasantes en servicio social', detalle: '4 pasantes · 3 h por semana', pago: '$3,000 al mes', lugares: '1 lugar' },
];
