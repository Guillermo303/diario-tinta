import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './index.css';
import { ProveedorApp } from './estado';
import { ProveedorAvisos } from './components/ui';
import Layout from './components/Layout';
import Hoy from './pages/Hoy';
import PsicologosPage from './pages/PsicologosPage';
import Hablar from './pages/Hablar';
import Escribir from './pages/Escribir';
import Ajustes from './pages/Ajustes';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ProveedorApp>
        <ProveedorAvisos>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Hoy />} />
              <Route path="psicologos" element={<PsicologosPage />} />
              <Route path="hablar" element={<Hablar />} />
              <Route path="escribir" element={<Escribir />} />
              <Route path="ajustes" element={<Ajustes />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </ProveedorAvisos>
      </ProveedorApp>
    </BrowserRouter>
  </StrictMode>
);
