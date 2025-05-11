import React from 'react';
import PropTypes from 'prop-types';

const Clase = ({ id, Class }) => (
    <h1 className="text-3xl font-bold text-teal-600 border-b-2 border-teal-500 pb-2 mb-10">
        Asignación de Cursos - {Class}
    </h1>
);

//Validación de propiedades
Clase.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    Class: PropTypes.string.isRequired
};

export default Clase;