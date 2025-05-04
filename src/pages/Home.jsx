import React from 'react';
import Sidebar from '../Components/Sidebar';
import Header from '../Components/Header';
import Card_Estudiante from '../Components/Cards/Card_Estudiante';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="flex">
            <Sidebar Name="JEREZ MELGAR, ALEJANDRO MANUEL"/>
            <div className="ml-64 flex-1 w-full">
                <Header />
                <div className="p-8">
                    <h1 className="text-3xl font-bold text-teal-600 border-b-2 border-teal-500 pb-2 mb-10">
                        Asignación de Cursos
                    </h1>

                    <div className="flex justify-center mt-8">
                        <Card_Estudiante
                            Carne="2023-12345"
                            Name="JEREZ MELGAR, ALEJANDRO MANUEL"
                            Carrera="7010 - LICENCIATURA EN INGENIERÍA EN CIENCIA DE LA COMPUTACIÓN Y TECNOLOGÍAS DE LA INFORMACIÓN"
                            Pensum="RENOVACIÓN CURRICULAR 2022"
                            Promedio_Ciclo_Anterior="90"
                            Grado="2"
                            Carga_MAX="Puede asignarse un máximo de 8 cursos"
                        />
                    </div>

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

export default Dashboard;