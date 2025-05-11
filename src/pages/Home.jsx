// @ Front-Profesor-Recommendation-System
// @ File Name : Home.jsx
// @ Date : 11/05/2025
// @ Author : Alejandro Manuel Jerez Melgar 24678
//

// Este archivo representa la página principal del sistema de recomendación de profesores.
// Contiene la estructura principal de la interfaz de usuario para la asignación de cursos.
// Incluye componentes como Sidebar, Header y Card_Estudiante para mostrar información del estudiante.

import React from 'react';
import Sidebar from '../Components/Sidebar';
import Header from '../Components/Header';
import Card_Estudiante from '../Components/Cards/Card_Estudiante';
import { useNavigate } from 'react-router-dom';
import { useStudent } from '../context/StudentContext';

const Home = () => {
    // Hook para navegar entre rutas
    const navigate = useNavigate();

    // Obtiene los datos del estudiante desde el contexto global
    const studentData = useStudent();
    
    return (
        <div className="flex">
            {/* Sidebar muestra el nombre del estudiante */}
            <Sidebar Name={studentData.name}/>
            <div className="ml-64 flex-1 w-full">
                {/* Header muestra el encabezado de la página */}
                <Header />
                <div className="p-8">
                    {/* Título principal de la página */}
                    <h1 className="text-3xl font-bold text-teal-600 border-b-2 border-teal-500 pb-2 mb-10">
                        Asignación de Cursos
                    </h1>

                    {/* Tarjeta que muestra información detallada del estudiante */}
                    <div className="flex justify-center mt-8">
                        <Card_Estudiante
                            id={studentData.id} // ID del estudiante
                            Carne={studentData.carne} // Carnet del estudiante
                            Name={studentData.name} // Nombre completo del estudiante
                            Carrera={studentData.carrera} // Carrera del estudiante
                            Pensum={studentData.pensum} // Pensum del estudiante
                            Promedio_Ciclo_Anterior={studentData.promedioCicloAnterior} // Promedio del ciclo anterior
                            Grado={studentData.grado} // Grado actual del estudiante
                            Carga_MAX={studentData.cargaMaxima} // Carga máxima permitida
                        />
                    </div>

                    {/* Botón para navegar a la página de cursos */}
                    <div className="flex justify-center">
                        <button
                            onClick={() => navigate('/cursos')}
                            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors duration-300"
                        >
                            Asignarse
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;