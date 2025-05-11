// @ Front-Profesor-Recommendation-System
// @ File Name : Login.jsx
// @ Date : 11/05/2025
// @ Author : Alejandro Manuel Jerez Melgar 24678
//

// Este archivo representa la página de inicio de sesión.
// Permite a los usuarios autenticarse para acceder al sistema.

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UVG from '../assets/uvg.png';

const Login = () => {
    // Estado para los campos del formulario
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Intentar iniciar sesión
            await login({ email, password });
            // Redirigir a la página principal en caso de éxito
            navigate('/');
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <div className="flex flex-col justify-center flex-1 px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                <div className="w-full max-w-sm mx-auto lg:w-96">
                    <div className="flex justify-center mb-6">
                        <img src={UVG} alt="UVG Logo" className="h-24 filter invert-0 brightness-0 sepia saturate-100 hue-rotate-[150deg] contrast-100" />
                    </div>

                    <div>
                        <h2 className="mt-6 text-2xl font-bold leading-9 tracking-tight text-center text-teal-600">
                            Sistema de Recomendación de Profesores
                        </h2>
                        <p className="mt-2 text-sm text-center text-gray-600">
                            Inicia sesión para acceder al sistema
                        </p>
                    </div>

                    <div className="mt-10">
                        <div>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && (
                                    <div className="p-3 text-sm text-red-600 bg-red-100 border border-red-200 rounded-md">
                                        {error}
                                    </div>
                                )}

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                        Correo Electrónico
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                                            placeholder="estudiante@uvg.edu.gt"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                        Contraseña
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoComplete="current-password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`flex w-full justify-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    >
                                        {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                                    </button>
                                </div>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
            <div className="relative flex-1 hidden w-0 bg-teal-600 lg:block">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                        <h1 className="text-4xl font-bold">Sistema de Asignación</h1>
                        <p className="mt-4 text-xl">Universidad del Valle de Guatemala</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;