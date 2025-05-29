// @ Front-Profesor-Recommendation-System
// @ File Name : TimesCourseModal.jsx
// @ Date : 27/05/2025
// @ Author : Marcelo Detlefsen

/**
 * Componente TimesCourseModal
 * 
 * Modal que pregunta al usuario cuántas veces ha cursado un curso específico.
 * Se utiliza antes de navegar a la página de recomendaciones de profesores.
 */

import React, { useState } from 'react';

const TimesCourseModal = ({ isOpen, onClose, onConfirm, course }) => {
  const [times, setTimes] = useState(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">
          ¿Cuántas veces has cursado {course.nombre} ({course.codigo})?
        </h3>
        
        <div className="mb-6">
          <label htmlFor="times" className="block text-sm font-medium text-gray-700 mb-2">
            Número de veces cursado (0-5)
          </label>
          <input
            type="number"
            id="times"
            min="0"
            max="5"
            value={times}
            onChange={(e) => setTimes(Math.min(5, Math.max(0, parseInt(e.target.value) || 0)))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(times)}
            className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimesCourseModal;