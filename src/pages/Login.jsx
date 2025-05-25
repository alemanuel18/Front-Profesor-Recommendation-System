// @ Front-Profesor-Recommendation-System
// @ File Name : Login.jsx
// @ Date : 24/05/2025
// @ Author : Alejandro Jerez, Marcelo Detlefsen

/**
 * Componente Login
 * 
 * Este archivo implementa la página de inicio de sesión del sistema.
 * Actualizado para conectarse con la API del backend y verificar el estado del sistema.
 * Incluye funcionalidad de registro de usuarios.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/apiService';
import SignUpForm from '../Components/SignUpForm';
import UVG from '../assets/uvg.png';

const Login = () => {
    // ===== ESTADOS DEL COMPONENTE =====
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [apiStatus, setApiStatus] = useState({ healthy: false, checking: true });
    const [isSignUpMode, setIsSignUpMode] = useState(false); // Nuevo estado para alternar entre login y signup

    // ===== HOOKS Y CONTEXTO =====
    const navigate = useNavigate();
    const { login } = useAuth();

    // ===== EFECTOS =====
    useEffect(() => {
        checkApiHealth();
    }, []);

    // ===== FUNCIONES =====

    /**
     * Verifica el estado de salud de la API
     */
    const checkApiHealth = async () => {
        try {
            console.log('🔍 Verificando estado de la API...');
            const response = await apiService.healthCheck();
            
            setApiStatus({
                healthy: response && response.success,
                checking: false,
                message: response?.message || 'API disponible'
            });
            
            console.log('✅ Estado de API verificado:', response);
            
        } catch (error) {
            console.warn('⚠️ API no disponible:', error.message);
            setApiStatus({
                healthy: false,
                checking: false,
                message: 'Sistema funcionando en modo local'
            });
        }
    };

    /**
     * Maneja el envío del formulario de inicio de sesión
     */
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            console.log('🔐 Intentando iniciar sesión...');
            
            // Validación básica
            if (!email || !password) {
                throw new Error('Por favor completa todos los campos');
            }

            // Validación de formato de email UVG
            if (!email.includes('@uvg.edu.gt') && !email.includes('@admin.uvg')) {
                throw new Error('Debe usar un correo institucional (@uvg.edu.gt)');
            }

            // Intentar autenticación
            const success = await login({ email, password });
            
            if (success) {
                console.log('✅ Inicio de sesión exitoso');
                navigate('/');
            } else {
                throw new Error('Credenciales inválidas');
            }
            
        } catch (err) {
            console.error('❌ Error en inicio de sesión:', err);
            setError(err.message || 'Error al iniciar sesión. Inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Maneja el envío del formulario de registro
     */
    const handleSignUpSubmit = async (formData) => {
        setIsLoading(true);
        setError('');

        try {
            console.log('📝 Intentando registrar usuario...');
            
            // Validación básica - ya no necesitamos validar confirmPassword aquí
            // porque SignUpForm ya lo hace internamente
            if (!formData.email || !formData.password) {
                throw new Error('Por favor completa todos los campos requeridos');
            }

            // Validación de formato de email UVG
            if (!formData.email.includes('@uvg.edu.gt')) {
                throw new Error('Debe usar un correo institucional (@uvg.edu.gt)');
            }

            console.log('Enviando datos:', formData); 
            
             // Llamar a la API para registrar
            const response = await apiService.createEstudiante(formData);
            
            if (response && response.success) {
                alert('✅ Registro exitoso! Ahora puedes iniciar sesión');
                setIsSignUpMode(false);
                // Usar el email del formData directamente
                setEmail(formData.email);
            } else {
                throw new Error(response?.message || '❌ Error en el registro');
            }
        } catch (error) {
            console.error('Error completo:', error); // Muestra el error completo
            setError(error.message || 'Error al registrar. Inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Maneja el inicio de sesión de demostración
     */
    const handleDemoLogin = async (userType) => {
        setIsLoading(true);
        setError('');

        const demoCredentials = {
            student: {
                email: 'estudiante@uvg.edu.gt',
                password: 'password123'
            },
            admin: {
                email: 'admin@uvg.edu.gt',
                password: 'admin123'
            }
        };

        try {
            const credentials = demoCredentials[userType];
            const success = await login(credentials);
            
            if (success) {
                navigate('/');
            } else {
                throw new Error('Error en credenciales de demostración');
            }
        } catch (err) {
            setError('Error al acceder con credenciales de demostración');
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Alterna entre modo login y signup
     */
    const toggleMode = () => {
        setIsSignUpMode(!isSignUpMode);
        setError('');
        setEmail('');
        setPassword('');
    };

    // ===== RENDERIZADO DEL COMPONENTE =====
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Panel izquierdo - Formulario de inicio de sesión/registro */}
            <div className="flex flex-col justify-center flex-1 px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                <div className={`w-full mx-auto ${isSignUpMode ? 'max-w-2xl' : 'max-w-sm lg:w-96'}`}>
                    {/* Logo de la UVG */}
                    <div className="flex justify-center mb-6">
                        <img 
                            src={UVG} 
                            alt="UVG Logo" 
                            className="h-24 filter invert-0 brightness-0 sepia saturate-100 hue-rotate-[150deg] contrast-100" 
                        />
                    </div>

                    {/* Encabezado y descripción */}
                    <div>
                        <h2 className="mt-6 text-2xl font-bold leading-9 tracking-tight text-center text-teal-600">
                            Sistema de Recomendación de Profesores
                        </h2>
                        <p className="mt-2 text-sm text-center text-gray-600">
                            {isSignUpMode ? 'Crea tu cuenta para acceder al sistema' : 'Inicia sesión para acceder al sistema'}
                        </p>
                    </div>

                    {/* Estado de la API */}
                    <div className="mt-6">
                        {apiStatus.checking ? (
                            <div className="flex items-center justify-center p-3 bg-gray-100 rounded-md">
                                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                                <span className="text-sm text-gray-600">Verificando sistema...</span>
                            </div>
                        ) : (
                            <div className={`p-3 rounded-md flex items-center ${
                                apiStatus.healthy 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-yellow-100 text-yellow-700'
                            }`}>
                                <div className="flex-shrink-0 mr-2">
                                    {apiStatus.healthy ? (
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                                <span className="text-xs">{apiStatus.message}</span>
                            </div>
                        )}
                    </div>

                    {/* Contenedor principal del formulario */}
                    <div className="mt-8">
                        {isSignUpMode ? (
                            // Formulario de registro
                            <SignUpForm
                                onSubmit={handleSignUpSubmit}
                                isLoading={isLoading}
                                error={error}
                            />
                        ) : (
                            // Formulario de inicio de sesión
                            <form onSubmit={handleLoginSubmit} className="space-y-6">
                                {/* Mostrar mensaje de error si existe */}
                                {error && (
                                    <div className="p-3 text-sm text-red-600 bg-red-100 border border-red-200 rounded-md">
                                        {error}
                                    </div>
                                )}

                                {/* Campo de correo electrónico */}
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

                                {/* Campo de contraseña */}
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

                                {/* Botón de envío */}
                                <div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`flex w-full justify-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 transition-colors ${
                                            isLoading ? 'opacity-70 cursor-not-allowed' : ''
                                        }`}
                                    >
                                        {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Botón para alternar entre login y signup */}
                        <div className="mt-6 text-center">
                            <button
                                type="button"
                                onClick={toggleMode}
                                className="text-sm text-teal-600 hover:text-teal-500 font-medium transition-colors"
                            >
                                {isSignUpMode 
                                    ? '¿Ya tienes cuenta? Inicia sesión' 
                                    : '¿No tienes cuenta? Regístrate aquí'
                                }
                            </button>
                        </div>

                        {/* Botones de demostración - Solo en modo login */}
                        {!isSignUpMode && (
                            <div className="mt-6 space-y-3">
                                <div className="text-center">
                                    <span className="text-xs text-gray-500 uppercase tracking-wide">
                                        Cuentas de demostración
                                    </span>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => handleDemoLogin('student')}
                                        disabled={isLoading}
                                        className="flex justify-center items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Estudiante
                                    </button>
                                    
                                    <button
                                        type="button"
                                        onClick={() => handleDemoLogin('admin')}
                                        disabled={isLoading}
                                        className="flex justify-center items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Administrador
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Panel derecho - Banner decorativo */}
            <div className="relative flex-1 hidden w-0 bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800 lg:block overflow-hidden">
                {/* Elementos de fondo animados */}
                <div className="absolute inset-0">
                    {/* Círculos flotantes de fondo */}
                    <div className="absolute top-10 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full animate-bounce" style={{animationDelay: '0s', animationDuration: '3s'}}></div>
                    <div className="absolute top-32 right-16 w-12 h-12 bg-white bg-opacity-5 rounded-full animate-bounce" style={{animationDelay: '1s', animationDuration: '4s'}}></div>
                    <div className="absolute bottom-20 left-16 w-16 h-16 bg-emerald-400 bg-opacity-20 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
                    <div className="absolute top-1/2 right-8 w-8 h-8 bg-teal-300 bg-opacity-15 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                    
                    {/* Líneas decorativas */}
                    <div className="absolute top-0 right-0 w-1 h-32 bg-gradient-to-b from-transparent via-white to-transparent opacity-20 animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="text-center text-white px-8">
                        {/* Título principal con animación */}
                        <div className="transform transition-all duration-1000 ease-out">
                            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white via-teal-100 to-emerald-200 bg-clip-text text-transparent animate-pulse">
                                {isSignUpMode ? '¡Únete a nosotros!' : 'El poder de los Grafos'}
                            </h1>
                            <p className="text-xl mb-8 text-teal-100 font-light tracking-wide">
                                
                            </p>
                        </div>

                        {/* Tarjeta principal con glassmorphism */}
                        <div className="max-w-lg mx-auto transform transition-all duration-500 hover:scale-105">
                            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20 shadow-2xl">
                                {/* Icono dinámico */}
                                <div className="flex justify-center mb-6">
                                    <div className="relative">
                                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-6 transition-transform duration-300">
                                            {isSignUpMode ? (
                                                <svg className="w-8 h-8 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                                </svg>
                                            ) : (
                                                <svg className="w-8 h-8 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                                </svg>
                                            )}
                                        </div>
                                        {/* Anillo pulsante alrededor del icono */}
                                        <div className="absolute inset-0 border-4 border-white border-opacity-30 rounded-2xl animate-ping"></div>
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold mb-6 text-teal-600">
                                    {isSignUpMode ? 'Beneficios del Sistema' : 'Características del Sistema'}
                                </h3>
                                
                                {/* Lista de características con animaciones escalonadas */}
                                <div className="space-y-4">
                                    {isSignUpMode ? (
                                        <>
                                            <div className="flex items-center text-left group transform transition-all duration-300 hover:translate-x-2" style={{animationDelay: '0.1s'}}>
                                                <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 bg-opacity-20 rounded-full flex items-center justify-center mr-4 group-hover:bg-opacity-40 transition-all duration-300">
                                                    <svg className="w-4 h-4 text-emerald-300" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <span className="text-teal-600 font-medium">Profesores adaptados a tu estilo</span>
                                            </div>
                                            <div className="flex items-center text-left group transform transition-all duration-300 hover:translate-x-2" style={{animationDelay: '0.2s'}}>
                                                <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 bg-opacity-20 rounded-full flex items-center justify-center mr-4 group-hover:bg-opacity-40 transition-all duration-300">
                                                    <svg className="w-4 h-4 text-emerald-300" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <span className="text-teal-600 font-medium">Optimización de tu carga académica</span>
                                            </div>
                                            <div className="flex items-center text-left group transform transition-all duration-300 hover:translate-x-2" style={{animationDelay: '0.3s'}}>
                                                <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 bg-opacity-20 rounded-full flex items-center justify-center mr-4 group-hover:bg-opacity-40 transition-all duration-300">
                                                    <svg className="w-4 h-4 text-emerald-300" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <span className="text-teal-600 font-medium">Mejores resultados académicos</span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex items-center text-left group transform transition-all duration-300 hover:translate-x-2" style={{animationDelay: '0.1s'}}>
                                                <div className="flex-shrink-0 w-8 h-8 bg-teal-400 bg-opacity-20 rounded-full flex items-center justify-center mr-4 group-hover:bg-opacity-40 transition-all duration-300">
                                                    <svg className="w-4 h-4 text-teal-300" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <span className="text-teal-600 font-medium">Recomendaciones personalizadas</span>
                                            </div>
                                            <div className="flex items-center text-left group transform transition-all duration-300 hover:translate-x-2" style={{animationDelay: '0.2s'}}>
                                                <div className="flex-shrink-0 w-8 h-8 bg-teal-400 bg-opacity-20 rounded-full flex items-center justify-center mr-4 group-hover:bg-opacity-40 transition-all duration-300">
                                                    <svg className="w-4 h-4 text-teal-300" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <span className="text-teal-600 font-medium">Análisis de compatibilidad</span>
                                            </div>
                                            <div className="flex items-center text-left group transform transition-all duration-300 hover:translate-x-2" style={{animationDelay: '0.3s'}}>
                                                <div className="flex-shrink-0 w-8 h-8 bg-teal-400 bg-opacity-20 rounded-full flex items-center justify-center mr-4 group-hover:bg-opacity-40 transition-all duration-300">
                                                    <svg className="w-4 h-4 text-teal-300" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <span className="text-teal-600 font-medium">Gestión administrativa</span>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Estadísticas o métricas animadas */}
                                <div className="mt-8 pt-6 border-t border-white border-opacity-20">
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div className="transform transition-all duration-300 hover:scale-110">
                                            <div className="text-2xl font-bold text-emerald-300">20+</div>
                                            <div className="text-xs text-teal-200 uppercase tracking-wide">Estudiantes</div>
                                        </div>
                                        <div className="transform transition-all duration-300 hover:scale-110">
                                            <div className="text-2xl font-bold text-teal-300">10+</div>
                                            <div className="text-xs text-teal-200 uppercase tracking-wide">Profesores</div>
                                        </div>
                                        <div className="transform transition-all duration-300 hover:scale-110">
                                            <div className="text-2xl font-bold text-emerald-300">95%</div>
                                            <div className="text-xs text-teal-200 uppercase tracking-wide">Satisfacción</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Texto adicional con efecto de escritura */}
                        <div className="mt-8">
                            <p className="text-teal-200 text-sm font-light italic animate-pulse">
                                "Conectando estudiantes con los mejores profesores"
                            </p>
                        </div>
                    </div>
                </div>

                {/* Overlay con patrón sutil */}
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'radial-gradient(circle at 25% 25%, white 2px, transparent 2px), radial-gradient(circle at 75% 75%, white 2px, transparent 2px)',
                    backgroundSize: '50px 50px'
                }}></div>
            </div>
        </div>
    );
};

export default Login;