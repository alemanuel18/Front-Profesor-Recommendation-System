import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Materias from './pages/Materias';
import Seleccion_Profesores from './pages/Seleccion_Profesores';
import { StudentProvider } from './context/StudentContext';

function App() {
  return (
    <StudentProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cursos" element={<Materias />} />
          <Route path="/cursos/:cursoId" element={<Seleccion_Profesores />} />
        </Routes>
      </Router>
    </StudentProvider>
  );
}

export default App;
