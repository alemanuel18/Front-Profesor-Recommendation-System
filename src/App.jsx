import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Marerias from './pages/Materias';
import Seleccion_Profesores from './pages/Seleccion_Profesores';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cursos" element={<Marerias />} />
        <Route path="/cursos/:cursoId" element={<Seleccion_Profesores />} />
      </Routes>
    </Router>
  );
}

export default App;
