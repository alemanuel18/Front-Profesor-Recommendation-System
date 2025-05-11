// @ Front-Profesor-Recommendation-System
// @ File Name : ProfessorDetails.jsx
// @ Date : 11/05/2025
// @ Author : Alejandro Manuel Jerez Melgar 24678
//

// Este archivo representa la página de detalles del profesor.
// Solo es accesible para usuarios con rol de administrador.
// Muestra información detallada sobre un profesor específico.

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import { useProfessor } from '../context/ProfessorContext';
import AdminSidebar from '../Components/Admin/AdminSidebar';
import ProfessorDetailCard from '../Components/Cards/ProfessorDetailCard';
import { useAuth } from '../context/AuthContext';

const ProfessorDetails = () => {
  const { professorId } = useParams();
  const navigate = useNavigate();
  const { getProfessorById } = useProfessor();
  const { currentUser, isAdmin } = useAuth();
  const [professor, setProfessor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar que el usuario es admin
    if (!isAdmin()) {
      navigate('/');
      return;
    }
    
    // Cargar datos del profesor
    const fetchProfessor = () => {
      try {
        const professorData = getProfessorById(professorId);
        if (professorData) {
          setProfessor(professorData);
        } else {
          // Si no se encuentra el profesor, redirigir
          navigate('/admin/professors');
        }
      } catch (error) {
        console.error("Error al cargar datos del profesor:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessor();
  }, [professorId, getProfessorById, navigate, isAdmin]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!professor) {
    return (
      <div className="flex">
        <AdminSidebar />
        <div className="ml-64 flex-1 w-full">
          <Header />
          <div className="p-8">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-700">Profesor no encontrado</h2>
              <button 
                onClick={() => navigate('/admin/professors')}
                className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
              >
                Volver a la lista
              </button>
            </div>
          </div>
        </div>
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
            Detalles del Profesor
          </h1>
          
          <div className="flex justify-center">
            <ProfessorDetailCard professor={professor} />
          </div>
          
          <div className="flex justify-center mt-8">
            <button
              onClick={() => navigate('/admin/professors')}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
            >
              Volver a la lista
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessorDetails;