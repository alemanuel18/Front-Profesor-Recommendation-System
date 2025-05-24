// @ Front-Profesor-Recommendation-System
// @ File Name : SignUpForm.jsx
// @ Date : 24/05/2025
// @ Author : Alejandro Manuel Jerez Melgar 24678

/**
 * Componente SignUpForm
 * 
 * Formulario reutilizable para el registro de nuevos usuarios del sistema.
 * Incluye validaciones y manejo de estados para todos los campos requeridos.
 */

import React, { useState } from 'react';

// ===== COMPONENTE DE CAMPO CON ERROR (MOVIDO FUERA DEL RENDER) =====
const FormField = ({ 
    label, 
    name, 
    type = 'text', 
    required = true, 
    children, 
    placeholder = '',
    formData,
    validationErrors,
    handleInputChange
}) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium leading-6 text-gray-900">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="mt-2">
            {children || (
                <input
                    id={name}
                    name={name}
                    type={type}
                    value={formData[name]}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    className={`block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                        validationErrors[name] ? 'ring-red-300' : 'ring-gray-300'
                    } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6`}
                />
            )}
        </div>
        {validationErrors[name] && (
            <p className="mt-1 text-sm text-red-600">{validationErrors[name]}</p>
        )}
    </div>
);

const SignUpForm = ({ onSubmit, isLoading = false, error = '' }) => {
    // ===== ESTADOS DEL FORMULARIO =====
    const [formData, setFormData] = useState({
        nombreCompleto: '',
        carnet: '',
        carrera: '',
        pensum: '',
        promedioAnterior: '',
        grado: '',
        cargaMaxima: '',
        estiloAprendizaje: '',
        estiloClase: '',
        cursosZonaMinima: ''
    });

    const [validationErrors, setValidationErrors] = useState({});

    // ===== OPCIONES PARA SELECTS =====
    const estilosAprendizaje = [
        { value: 'practico', label: 'Práctico' },
        { value: 'teorico', label: 'Teórico' },
        { value: 'mixto', label: 'Mixto' }
    ];

    const estilosClase = [
        { value: 'con_tecnologia', label: 'Uso de herramientas tecnológicas' },
        { value: 'sin_tecnologia', label: 'Sin uso de herramientas tecnológicas' },
        { value: 'mixto', label: 'Mixto' }
    ];

    const carreras = [
        'Ingeniería en Ciencias de la Computación',
        'Ingeniería Industrial',
        'Ingeniería Civil',
        'Ingeniería Mecánica',
        'Ingeniería Electrónica',
        'Administración de Empresas',
        'Psicología',
        'Medicina',
        'Arquitectura',
        'Diseño Gráfico'
    ];

    const grados = [
        'Primer año',
        'Segundo año',
        'Tercer año',
        'Cuarto año',
        'Quinto año',
        'Sexto año'
    ];

    // ===== FUNCIONES DE VALIDACIÓN =====
    const validateForm = () => {
        const errors = {};

        // Validar nombre completo
        if (!formData.nombreCompleto.trim()) {
            errors.nombreCompleto = 'El nombre completo es requerido';
        } else if (formData.nombreCompleto.trim().length < 3) {
            errors.nombreCompleto = 'El nombre debe tener al menos 3 caracteres';
        }

        // Validar carnet (formato UVG típico: 5 dígitos + año)
        if (!formData.carnet) {
            errors.carnet = 'El carnet es requerido';
        } else if (!/^\d{5,7}$/.test(formData.carnet)) {
            errors.carnet = 'El carnet debe tener entre 5 y 7 dígitos';
        }

        // Validar carrera
        if (!formData.carrera) {
            errors.carrera = 'La carrera es requerida';
        }

        // Validar pensum
        if (!formData.pensum) {
            errors.pensum = 'El pensum es requerido';
        } else if (!/^\d{4}$/.test(formData.pensum)) {
            errors.pensum = 'El pensum debe ser un año válido (ej: 2020)';
        }

        // Validar promedio
        if (!formData.promedioAnterior) {
            errors.promedioAnterior = 'El promedio es requerido';
        } else {
            const promedio = parseFloat(formData.promedioAnterior);
            if (isNaN(promedio) || promedio < 0 || promedio > 100) {
                errors.promedioAnterior = 'El promedio debe estar entre 0 y 100';
            }
        }

        // Validar grado
        if (!formData.grado) {
            errors.grado = 'El grado es requerido';
        }

        // Validar carga máxima
        if (!formData.cargaMaxima) {
            errors.cargaMaxima = 'La carga máxima es requerida';
        } else {
            const carga = parseInt(formData.cargaMaxima);
            if (isNaN(carga) || carga < 1 || carga > 8) {
                errors.cargaMaxima = 'La carga máxima debe estar entre 1 y 8 cursos';
            }
        }

        // Validar estilos
        if (!formData.estiloAprendizaje) {
            errors.estiloAprendizaje = 'Selecciona tu estilo de aprendizaje';
        }

        if (!formData.estiloClase) {
            errors.estiloClase = 'Selecciona tu estilo de clase preferido';
        }

        // Validar cursos zona mínima
        if (!formData.cursosZonaMinima) {
            errors.cursosZonaMinima = 'Este campo es requerido';
        } else {
            const cursos = parseInt(formData.cursosZonaMinima);
            if (isNaN(cursos) || cursos < 0 || cursos > 6) {
                errors.cursosZonaMinima = 'Debe ser un número entre 0 y 6';
            }
        }

        return errors;
    };

    // ===== MANEJADORES DE EVENTOS =====
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Limpiar error específico al escribir
        if (validationErrors[name]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        setValidationErrors({});
        onSubmit(formData);
    };

    // ===== RENDERIZADO DEL COMPONENTE =====
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Mostrar mensaje de error general si existe */}
            {error && (
                <div className="p-3 text-sm text-red-600 bg-red-100 border border-red-200 rounded-md">
                    {error}
                </div>
            )}

            {/* Información Personal */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                    <FormField
                        label="Nombre Completo"
                        name="nombreCompleto"
                        placeholder="Juan Pérez García"
                        formData={formData}
                        validationErrors={validationErrors}
                        handleInputChange={handleInputChange}
                    />
                </div>

                <FormField
                    label="Carnet"
                    name="carnet"
                    placeholder="12345"
                    formData={formData}
                    validationErrors={validationErrors}
                    handleInputChange={handleInputChange}
                />

                <FormField
                    label="Pensum"
                    name="pensum"
                    placeholder="2024"
                    formData={formData}
                    validationErrors={validationErrors}
                    handleInputChange={handleInputChange}
                />
            </div>

            {/* Información Académica */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                    label="Carrera"
                    name="carrera"
                    formData={formData}
                    validationErrors={validationErrors}
                    handleInputChange={handleInputChange}
                >
                    <select
                        id="carrera"
                        name="carrera"
                        value={formData.carrera}
                        onChange={handleInputChange}
                        className={`block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                            validationErrors.carrera ? 'ring-red-300' : 'ring-gray-300'
                        } focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6`}
                    >
                        <option value="">Selecciona tu carrera</option>
                        {carreras.map(carrera => (
                            <option key={carrera} value={carrera}>{carrera}</option>
                        ))}
                    </select>
                </FormField>

                <FormField
                    label="Grado"
                    name="grado"
                    formData={formData}
                    validationErrors={validationErrors}
                    handleInputChange={handleInputChange}
                >
                    <select
                        id="grado"
                        name="grado"
                        value={formData.grado}
                        onChange={handleInputChange}
                        className={`block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                            validationErrors.grado ? 'ring-red-300' : 'ring-gray-300'
                        } focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6`}
                    >
                        <option value="">Selecciona tu grado</option>
                        {grados.map(grado => (
                            <option key={grado} value={grado}>{grado}</option>
                        ))}
                    </select>
                </FormField>
            </div>

            {/* Información Numérica */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <FormField
                    label="Promedio Ciclo Anterior"
                    name="promedioAnterior"
                    type="number"
                    placeholder="85.5"
                    formData={formData}
                    validationErrors={validationErrors}
                    handleInputChange={handleInputChange}
                />

                <FormField
                    label="Carga Máxima (cursos)"
                    name="cargaMaxima"
                    type="number"
                    placeholder="5"
                    formData={formData}
                    validationErrors={validationErrors}
                    handleInputChange={handleInputChange}
                />

                <FormField
                    label="Cursos con Zona Mínima"
                    name="cursosZonaMinima"
                    type="number"
                    placeholder="0"
                    formData={formData}
                    validationErrors={validationErrors}
                    handleInputChange={handleInputChange}
                />
            </div>

            {/* Preferencias de Aprendizaje */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                    label="Estilo de Aprendizaje"
                    name="estiloAprendizaje"
                    formData={formData}
                    validationErrors={validationErrors}
                    handleInputChange={handleInputChange}
                >
                    <select
                        id="estiloAprendizaje"
                        name="estiloAprendizaje"
                        value={formData.estiloAprendizaje}
                        onChange={handleInputChange}
                        className={`block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                            validationErrors.estiloAprendizaje ? 'ring-red-300' : 'ring-gray-300'
                        } focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6`}
                    >
                        <option value="">Selecciona tu estilo</option>
                        {estilosAprendizaje.map(estilo => (
                            <option key={estilo.value} value={estilo.value}>{estilo.label}</option>
                        ))}
                    </select>
                </FormField>

                <FormField
                    label="Estilo de Clase Preferido"
                    name="estiloClase"
                    formData={formData}
                    validationErrors={validationErrors}
                    handleInputChange={handleInputChange}
                >
                    <select
                        id="estiloClase"
                        name="estiloClase"
                        value={formData.estiloClase}
                        onChange={handleInputChange}
                        className={`block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                            validationErrors.estiloClase ? 'ring-red-300' : 'ring-gray-300'
                        } focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6`}
                    >
                        <option value="">Selecciona tu preferencia</option>
                        {estilosClase.map(estilo => (
                            <option key={estilo.value} value={estilo.value}>{estilo.label}</option>
                        ))}
                    </select>
                </FormField>
            </div>

            {/* Botón de envío */}
            <div className="pt-4">
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`flex w-full justify-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 transition-colors ${
                        isLoading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                >
                    {isLoading ? 'Registrando...' : 'Crear Cuenta'}
                </button>
            </div>
        </form>
    );
};

export default SignUpForm;