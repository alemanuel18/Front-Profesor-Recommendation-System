import React from 'react';
import Sidebar from '../Components/Sidebar';
import Header from '../Components/Header';
import Clase from '../Components/Text/Clase';
import Curtis from '../assets/curtis.png';
import Card_Profesor from '../Components/Cards/Card_Profesor';

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
            {teachers.map((teacher, index) => (
              <Card_Profesor
                key={index}
                Name={teacher}
                Image={Curtis}
                Asignar="Asignar"
                Ver="Ver"
              />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default TeacherSelection;
