import React from 'react';
import Sidebar from '../Components/Sidebar';
import Header from '../Components/Header';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <div className="p-8">
          <h2 className="text-2xl font-semibold mb-4">Asignación de Cursos</h2>
          <div className="border p-6 rounded shadow bg-white">
            <p><strong>Carnet:</strong> 24678</p>
            <p><strong>Estudiante:</strong> JEREZ MELGAR, ALEJANDRO MANUEL</p>
            <p><strong>Carrera:</strong> 7010 - LICENCIATURA EN INGENIERÍA EN CIENCIA DE LA COMPUTACIÓN Y TECNOLOGÍAS DE LA INFORMACIÓN</p>
            <p><strong>Pensum:</strong> RENOVACIÓN CURRICULAR 2022</p>
            <p><strong>Prom. ciclo anterior:</strong> 90</p>
            <p><strong>Grado:</strong> 2</p>
            <p><strong>Carga máxima:</strong> Puede asignarse un máximo de 8 cursos</p>
          </div>
          <button
            onClick={() => navigate('/cursos')}
            className="bg-green-500 text-white px-6 py-3 mt-6 rounded text-lg"
          >
            Asignarse
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
