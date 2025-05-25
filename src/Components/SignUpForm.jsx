// @ Front-Profesor-Recommendation-System
// @ File Name : SignUpForm.jsx
// @ Date : 24/05/2025
// @ Author : Alejandro Manuel Jerez Melgar 24678

/**
 * Componente SignUpForm
 * 
 * Formulario reutilizable para el registro de nuevos usuarios del sistema.
 * Incluye validaciones y manejo de estados para todos los campos requeridos.
 * Actualizado para incluir campos de correo y contraseña.
 * Ahora soporta datos iniciales para modo edición.
 */

import React, { useState, useEffect } from 'react';

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
    handleInputChange,
    min,
    max
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
                    min={min}
                    max={max}
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

const SignUpForm = ({ 
    onSubmit, 
    isLoading = false, 
    error = '', 
    initialData = null, // Nuevos datos iniciales
    isEditMode = false  // Flag para identificar si estamos en modo edición
}) => {
    // ===== ESTADOS DEL FORMULARIO =====
    const [formData, setFormData] = useState({
        nombreCompleto: '',
        carnet: '',
        email: '',
        password: '',
        confirmPassword: '',
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

    // ===== EFECTO PARA CARGAR DATOS INICIALES =====
    useEffect(() => {
        if (initialData && isEditMode) {
            console.log('📝 Cargando datos iniciales para edición:', initialData);
            
            // Mapear los datos del estudiante al formato del formulario
            const mappedData = {
                nombreCompleto: initialData.nombreCompleto || initialData.nombre || '',
                carnet: initialData.carnet || '',
                email: initialData.email || '',
                password: '', // Las contraseñas no se pre-llenan por seguridad
                confirmPassword: '',
                carrera: initialData.carrera || '',
                pensum: initialData.pensum ? initialData.pensum.toString() : '',
                promedioAnterior: initialData.promedioAnterior ? initialData.promedioAnterior.toString() : 
                                 initialData.promedio ? initialData.promedio.toString() : '',
                grado: initialData.grado || '',
                cargaMaxima: initialData.cargaMaxima ? initialData.cargaMaxima.toString() : 
                            initialData.carga_maxima ? initialData.carga_maxima.toString() : '',
                estiloAprendizaje: initialData.estiloAprendizaje || initialData.estilo_aprendizaje || '',
                estiloClase: initialData.estiloClase || initialData.estilo_clase || '',
                cursosZonaMinima: initialData.cursosZonaMinima ? initialData.cursosZonaMinima.toString() : 
                                 initialData.cursos_zona_minima ? initialData.cursos_zona_minima.toString() : ''
            };

            setFormData(mappedData);
            console.log('✅ Datos iniciales cargados:', mappedData);
        }
    }, [initialData, isEditMode]);

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

        // Validar email
        if (!formData.email) {
            errors.email = 'El correo electrónico es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Por favor ingresa un correo electrónico válido';
        } else if (!formData.email.includes('@uvg.edu.gt')) {
            errors.email = 'Debe usar un correo institucional (@uvg.edu.gt)';
        }

        // Validar contraseña (solo en modo registro o si se está cambiando)
        if (!isEditMode || formData.password) {
            if (!formData.password) {
                errors.password = 'La contraseña es requerida';
            } else if (formData.password.length < 6) {
                errors.password = 'La contraseña debe tener al menos 6 caracteres';
            } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
                errors.password = 'La contraseña debe contener al menos una mayúscula, una minúscula y un número';
            }

            // Validar confirmación de contraseña
            if (!formData.confirmPassword) {
                errors.confirmPassword = 'Confirma tu contraseña';
            } else if (formData.password !== formData.confirmPassword) {
                errors.confirmPassword = 'Las contraseñas no coinciden';
            }
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

        // Transformar los datos para que coincidan con el backend
        const dataToSend = {
            nombre: formData.nombreCompleto, // Mapear nombreCompleto -> nombre
            carnet: formData.carnet,
            email: formData.email,
            carrera: formData.carrera,
            pensum: parseInt(formData.pensum),
            promedio: parseFloat(formData.promedioAnterior), // Mapear promedioAnterior -> promedio
            grado: formData.grado,
            carga_maxima: parseInt(formData.cargaMaxima), // Mapear cargaMaxima -> carga_maxima
            cursos_zona_minima: parseInt(formData.cursosZonaMinima), // Mapear cursosZonaMinima -> cursos_zona_minima
            estilo_aprendizaje: formData.estiloAprendizaje, // Mapear estiloAprendizaje -> estilo_aprendizaje
            estilo_clase: formData.estiloClase // Mapear estiloClase -> estilo_clase
        };

        // Solo incluir contraseña si estamos en modo registro o si se está cambiando
        if (!isEditMode || formData.password) {
            dataToSend.password = formData.password;
        }

        setValidationErrors({});
        onSubmit(dataToSend);
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

            {/* Información de Acceso */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
                <FormField
                    label="Correo Electrónico"
                    name="email"
                    type="email"
                    placeholder="12345@uvg.edu.gt"
                    formData={formData}
                    validationErrors={validationErrors}
                    handleInputChange={handleInputChange}
                />

                {/* Solo mostrar campos de contraseña en modo registro o si se quiere cambiar */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                        label={isEditMode ? "Nueva Contraseña (opcional)" : "Contraseña"}
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        required={!isEditMode}
                        formData={formData}
                        validationErrors={validationErrors}
                        handleInputChange={handleInputChange}
                    />

                    <FormField
                        label={isEditMode ? "Confirmar Nueva Contraseña" : "Confirmar Contraseña"}
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        required={!isEditMode || formData.password}
                        formData={formData}
                        validationErrors={validationErrors}
                        handleInputChange={handleInputChange}
                    />
                </div>
                
                {isEditMode && (
                    <p className="text-sm text-gray-600">
                        💡 Deja los campos de contraseña vacíos si no deseas cambiarla.
                    </p>
                )}
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
                    min="1"
                    max="7"
                    placeholder="6"
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
                    {isLoading ? 
                        (isEditMode ? 'Actualizando...' : 'Registrando...') : 
                        (isEditMode ? 'Actualizar Perfil' : 'Crear Cuenta')
                    }
                </button>
            </div>
        </form>
    );
};

export default SignUpForm;