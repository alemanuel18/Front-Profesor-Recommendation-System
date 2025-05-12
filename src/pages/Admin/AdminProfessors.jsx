// @ Front-Profesor-Recommendation-System
// @ File Name : AdminProfessors.jsx
// @ Date : 11/05/2025
// @ Author : Alejandro Manuel Jerez Melgar 24678
//

// Este archivo representa la página de administración de profesores.
// Muestra una lista de todos los profesores y permite ver detalles de cada uno.
// Solo es accesible para usuarios con rol de administrador.

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Components/Header';
import { useProfessor } from '../../context/ProfessorContext';
import AdminSidebar from '../../Components/Admin/AdminSidebar';
import { useAuth } from '../../context/AuthContext';

const AdminProfessors = () => {
  const navigate = useNavigate();
  const { professors, loading } = useProfessor();
  const { isAdmin } = useAuth();

  // Verificar que el usuario es admin
  useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  // Manejar la selección de un profesor para ver detalles
  const handleProfessorSelect = (professorId) => {
    navigate(`/admin/professors/${professorId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="ml-64 flex-1 w-full">
        <Header />
        <div className="p-8">
          <h1 className="text-3xl font-bold text-teal-600 border-b-2 border-teal-500 pb-2 mb-10">
            Administración de Profesores
          </h1>

          {/* Tabla de profesores */}
          <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th scope="col" className="py-3 px-6">ID</th>
                  <th scope="col" className="py-3 px-6">Nombre</th>
                  <th scope="col" className="py-3 px-6">Departamento</th>
                  <th scope="col" className="py-3 px-6">Especialidad</th>
                  <th scope="col" className="py-3 px-6">Calificación</th>
                  <th scope="col" className="py-3 px-6">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {professors.map((professor) => (
                  <tr key={professor.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="py-4 px-6">{professor.id}</td>
                    <td className="py-4 px-6 font-medium text-gray-900">
                      <div className="flex items-center">
                        <img 
                          className="w-10 h-10 rounded-full mr-3"
                          src={professor.image || "/api/placeholder/40/40"}
                          alt={`${professor.name} avatar`}
                        />
                        {professor.name}
                      </div>
                    </td>
                    <td className="py-4 px-6">{professor.department}</td>
                    <td className="py-4 px-6">
                      {professor.specialties && professor.specialties.length > 0 ? 
                        professor.specialties[0] + (professor.specialties.length > 1 ? '...' : '') : 
                        'N/A'}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="ml-1">{professor.rating}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleProfessorSelect(professor.id)}
                        className="font-medium text-teal-600 hover:underline"
                      >
                        Ver detalles
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfessors;