import React from 'react';
import Sidebar from '../Components/Sidebar';
import Header from '../Components/Header';

const teachers = ['Profesor 1', 'Profesor 2', 'Profesor 3'];

const TeacherSelection = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <div className="p-8">
          <h2 className="text-2xl font-semibold mb-6">Asignación de Cursos - Calculo 1</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teachers.map((prof, index) => (
              <div
                key={index}
                className="bg-gray-100 p-6 text-center rounded-xl shadow hover:shadow-lg transition"
              >
                <img
                  src="https://via.placeholder.com/100"
                  alt={`Imagen de ${prof}`}
                  className="mx-auto rounded-full mb-4"
                />
                <p className="text-lg font-medium">{prof}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherSelection;
