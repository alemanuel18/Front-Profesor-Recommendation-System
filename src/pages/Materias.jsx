import React from 'react';
import Sidebar from '../Components/Sidebar';
import Header from '../Components/Header';
import { useNavigate } from 'react-router-dom';

const CourseList = () => {
  const navigate = useNavigate();

  const courses = ['Calculo 1', 'Álgebra Lineal 1', 'Estadística 1'];

  return (
    <div className="flex">
      <Sidebar Name="JEREZ MELGAR, ALEJANDRO MANUEL" />
      <div className="ml-64 flex-1 w-full">
        <Header />
        <div className="p-8">
          <h1 className="text-3xl font-bold text-teal-600 border-b-2 border-teal-500 pb-2 mb-10">
            Asignación de Cursos
          </h1>

          {courses.map((course, index) => (
            <button
              key={index}
              onClick={() => navigate(`/cursos/${index}`)}
              className="block bg-gray-200 p-4 mb-4 w-full text-left rounded"
            >
              {course}
            </button>
          ))}

        </div>
      </div>
    </div>
  );
};

export default CourseList;
