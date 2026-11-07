/** Sistema visual "Sereno": verde azulado clínico, mucho aire, tipografía sans. */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        fondo: '#f4f8f8',
        superficie: '#ffffff',
        suave: '#ecf3f3',
        linea: '#d8e4e4',
        tinta: '#132a2c',
        gris: '#56696b',
        tenue: '#8a9a9b',
        primario: { DEFAULT: '#1f6f6b', oscuro: '#175753', suave: '#dcefec' },
        azul: { DEFAULT: '#3b6c9e', suave: '#e2ecf6' },
        lila: { DEFAULT: '#6a5fa8', suave: '#ebe8f6' },
        ambar: { DEFAULT: '#9a6510', suave: '#fbefd9' },
        exito: { DEFAULT: '#2f7a4d', suave: '#e1f2e7' },
        alerta: { DEFAULT: '#b3261e', suave: '#fde8e6' },
      },
      fontFamily: {
        sans: ['Manrope', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
      borderRadius: { xl: '14px', '2xl': '20px' },
      boxShadow: {
        tarjeta: '0 1px 2px rgba(19,42,44,.04), 0 4px 16px rgba(19,42,44,.05)',
        flotante: '0 8px 30px rgba(19,42,44,.12)',
      },
    },
  },
  plugins: [],
};
