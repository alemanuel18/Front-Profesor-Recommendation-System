import React from 'react';
import Sidebar from '../Components/Sidebar';
import Header from '../Components/Header';
import { useNavigate } from 'react-router-dom';

const CourseList = () => {
  const navigate = useNavigate();

  const courses = ['Calculo 1', 'Fisica 1', 'Estadística 1'];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <div className="p-8">
          <h2 className="text-2xl font-semibold mb-4">Asignación de Cursos</h2>
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
