import React from 'react';
import Sidebar from '../Components/Sidebar';
import Header from '../Components/Header';
import { useNavigate } from 'react-router-dom';
import { useStudent } from '../context/StudentContext';

const CourseList = () => {
  const navigate = useNavigate();
  const studentData = useStudent();

  const courses = [
    { id: 1, name: 'Calculo 1'},
    { id: 2, name: 'Álgebra Lineal 1'},
    { id: 3, name: 'Estadística 1'}
  ];

  // Función para navegar con el nombre del curso
  const handleCourseSelect = (course) => {
    navigate(`/cursos/${course.id}`, { 
      state: { courseName: course.name }
    });
  };

  return (
    <div className="flex">
      <Sidebar Name={studentData.name} />
      <div className="ml-64 flex-1 w-full">
        <Header />
        <div className="p-8">
          <h1 className="text-3xl font-bold text-teal-600 border-b-2 border-teal-500 pb-2 mb-10">
            Asignación de Cursos
          </h1>

          {courses.map((course) => (
            <button
              key={course.id}
              onClick={() => handleCourseSelect(course)}
              className="block bg-gray-200 p-4 mb-4 w-full text-left rounded hover:bg-gray-300 transition-colors"
            >
              {course.name}
            </button>
          ))}

        </div>
      </div>
    </div>
  );
};

export default CourseList;