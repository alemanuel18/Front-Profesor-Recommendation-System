// @ Front-Profesor-Recommendation-System
// @ File Name : Seleccion_Profesores.jsx
// @ Date : 12/05/2025
// @ Author : Alejandro Manuel Jerez Melgar 24678
//

// Este archivo define la página de selección de profesores.
// Muestra una lista de todos los profesores disponibles para un curso seleccionado.
// Incluye tanto la visualización para estudiantes como para administradores según el rol del usuario.

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProfessor } from '../context/ProfessorContext';
import { useAuth } from '../context/AuthContext';
import Header from '../Components/Header';
import Clase from '../Components/Text/Clase';
import Card_Profesor from '../Components/Cards/Card_Profesor';
import Card_Profesor_Admin from '../Components/Cards/Card_Profesor_Admin';
import AdminSidebar from '../Components/Admin/AdminSidebar';
import Sidebar from '../Components/Sidebar';
import { useStudent } from '../context/StudentContext';

const Seleccion_Profesores = () => {
    const { cursoId } = useParams();
    const { professors, loading } = useProfessor();
    const { currentUser, isAdmin } = useAuth();
    const studentData = useStudent();
    const [courseName, setCourseName] = useState("");
    const [filteredProfessors, setFilteredProfessors] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    // Simular obtención del nombre del curso según ID
    useEffect(() => {
        // En una implementación real, esto vendría de una API
        const getCourseNameById = (id) => {
            const courses = {
                "1": "Cálculo 1",
                "2": "Álgebra Lineal 1",
                "3": "Estadística 1"
            };
            return courses[id] || "Curso no encontrado";
        };
        
        setCourseName(getCourseNameById(cursoId));
    }, [cursoId]);

    // Filtrar profesores por curso
    useEffect(() => {
        if (professors.length > 0 && courseName) {
            // Filtrar profesores que enseñan el curso seleccionado
            const filtered = professors.filter(professor => 
                professor.courses && professor.courses.includes(courseName)
            );
            setFilteredProfessors(filtered);
        }
    }, [professors, courseName]);

    // Filtrar profesores por término de búsqueda
    useEffect(() => {
        if (searchTerm.trim() !== "" && professors.length > 0) {
            const filtered = professors.filter(professor =>
                professor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (professor.specialties && professor.specialties.some(specialty => 
                    specialty.toLowerCase().includes(searchTerm.toLowerCase())
                ))
            );
            setFilteredProfessors(filtered);
        } else if (courseName) {
            // Si no hay término de búsqueda, volver a filtrar solo por curso
            const filtered = professors.filter(professor => 
                professor.courses && professor.courses.includes(courseName)
            );
            setFilteredProfessors(filtered);
        }
    }, [searchTerm, professors, courseName]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // Determinar qué componente lateral mostrar según el rol
    const SidebarComponent = isAdmin() ? (
        <AdminSidebar />
    ) : (
        <Sidebar Name={studentData.name} />
    );

    return (
        <div className="flex">
            {SidebarComponent}
            <div className="ml-64 flex-1 w-full">
                <Header />
                <div className="container mx-auto p-8">
                    <Clase id={cursoId} Class={courseName} />


                    {/* Barra de búsqueda */}
                    {/* Esto es solo por quieres agregarlo, si no da tiempo echatelo Marcelo ;) */}
                    <div className="mb-8">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                </svg>
                            </div>
                            <input 
                                type="search" 
                                className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-teal-500 focus:border-teal-500" 
                                placeholder="Buscar profesor por nombre o especialidad..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>


                    {/* Mostrar mensaje si no hay profesores */}
                    {filteredProfessors.length === 0 && (
                        <div className="text-center py-10">
                            <p className="text-gray-500">No se encontraron profesores que coincidan con los criterios de búsqueda.</p>
                        </div>
                    )}

                    {/* Grid de profesores */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProfessors.map((professor) => (
                            // Mostrar un componente diferente según el rol del usuario
                            isAdmin() ? (
                                <Card_Profesor_Admin
                                    key={professor.id}
                                    id={professor.id}
                                    name={professor.name}
                                    image={professor.image}
                                    department={professor.department}
                                    rating={professor.rating}
                                    specialties={professor.specialties}
                                />
                            ) : (
                                <Card_Profesor
                                    key={professor.id}
                                    id={professor.id}
                                    Name={professor.name}
                                    Image={professor.image}
                                />
                            )
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Seleccion_Profesores;