import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './index.css';
import { ProveedorApp } from './estado';
import { ProveedorAvisos } from './components/ui';
import Layout from './components/Layout';
import Hoy from './pages/Hoy';
import PsicologosPage from './pages/PsicologosPage';
import Escribir from './pages/Escribir';
import Ajustes from './pages/Ajustes';
import Pacientes from './pages/pro/Pacientes';
import Encargado from './pages/pro/Encargado';
import Acceso from './pages/Acceso';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ProveedorApp>
        <ProveedorAvisos>
          <Routes>
            <Route index element={<Navigate to="/entrar" replace />} />
            <Route element={<Layout />}>
              <Route path="hoy" element={<Hoy />} />
              <Route path="psicologos" element={<PsicologosPage />} />
              <Route path="escribir" element={<Escribir />} />
              <Route path="ajustes" element={<Ajustes />} />
            </Route>
            <Route path="pro" element={<Layout pro />}>
              <Route index element={<Pacientes />} />
              <Route path="encargado" element={<Encargado />} />
            </Route>
            <Route path="hablar" element={<Navigate to="/hoy" replace />} />
            <Route path="entrar" element={<Acceso modo="entrar" />} />
            <Route path="registro" element={<Acceso modo="registro" />} />
            <Route path="*" element={<Navigate to="/entrar" replace />} />
          </Routes>
        </ProveedorAvisos>
      </ProveedorApp>
    </BrowserRouter>
  </StrictMode>
);
