import React from 'react';
import Sidebar from '../Components/Sidebar';
import Header from '../Components/Header';
import Clase from '../Components/Text/Clase';
import Curtis from '../assets/curtis.png';

const teachers = ['Profesor 1', 'Profesor 2', 'Profesor 3'];

const TeacherSelection = () => {
  return (
    <div className="flex">
      <Sidebar Name="JEREZ MELGAR, ALEJANDRO MANUEL" />
      <div className="ml-64 flex-1 w-full">
        <Header />
        <div className="p-8">
          <Clase Class="Cálculo 1"/>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teachers.map((prof, index) => (
              <div
                key={index}
                className="bg-gray-100 p-6 text-center rounded-xl shadow hover:shadow-lg transition"
              >
                <img
                  src={Curtis}
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
