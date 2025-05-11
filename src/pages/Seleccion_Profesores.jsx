import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Sidebar from '../Components/Sidebar';
import Header from '../Components/Header';
import Clase from '../Components/Text/Clase';
import Card_Profesor from '../Components/Cards/Card_Profesor';
import { useStudent } from '../context/StudentContext';

const TeacherSelection = () => {
  // Obtener el parámetro de la URL (courseId)
  const { cursoId } = useParams();
  
  // Obtener el estado de navegación que contiene el nombre del curso
  const location = useLocation();
  const courseName = location.state?.courseName || "Curso no especificado";
  
  // Obtener datos del estudiante del contexto
  const studentData = useStudent();
  
  // Array de profesores para este curso (en un caso real podría filtrarse basado en el cursoId)
  const teachers = [
    { id: 1, name: 'Dr. Roberto García' },
    { id: 2, name: 'Mtra. Laura Fernández' },
    { id: 3, name: 'Ing. Carlos Mendoza' }
  ];

  return (
    <div className="flex">
      <Sidebar Name={studentData.name} />
      <div className="ml-64 flex-1 w-full">
        <Header />
        <div className="p-8">
          <Clase 
            id={cursoId} 
            Class={courseName}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teachers.map((teacher) => (
              <Card_Profesor
                key={teacher.id}
                id={teacher.id}
                Name={teacher.name}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherSelection;