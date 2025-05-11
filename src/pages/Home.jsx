import React from 'react';
import Sidebar from '../Components/Sidebar';
import Header from '../Components/Header';
import Card_Estudiante from '../Components/Cards/Card_Estudiante';
import { useNavigate } from 'react-router-dom';
import { useStudent } from '../context/StudentContext';

const Home = () => {
    const navigate = useNavigate();
    const studentData = useStudent();
    
    return (
        <div className="flex">
            <Sidebar Name={studentData.name}/>
            <div className="ml-64 flex-1 w-full">
                <Header />
                <div className="p-8">
                    <h1 className="text-3xl font-bold text-teal-600 border-b-2 border-teal-500 pb-2 mb-10">
                        Asignación de Cursos
                    </h1>

                    <div className="flex justify-center mt-8">
                        <Card_Estudiante
                            id={studentData.id}
                            Carne={studentData.carne}
                            Name={studentData.name}
                            Carrera={studentData.carrera}
                            Pensum={studentData.pensum}
                            Promedio_Ciclo_Anterior={studentData.promedioCicloAnterior}
                            Grado={studentData.grado}
                            Carga_MAX={studentData.cargaMaxima}
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

export default Home;