import React from 'react';
const Card_Profesor = ({ 
    id,
    Name, 
    Image
}) => (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="flex justify-end px-4 pt-4">
        </div>
        <div className="flex flex-col items-center pb-10">
            <img 
                className="w-24 h-24 mb-3 rounded-full shadow-lg" 
                src={Image || "/api/placeholder/100/100"} 
                alt={`${Name} profile`} 
            />
            <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{Name}</h5>
            <div className="flex mt-4 md:mt-6">
                <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Asignarse
                </button>
            </div>
        </div>
    </div>
);


// Validación de propiedades
Card_Profesor.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    Name: PropTypes.string.isRequired,
    Image: PropTypes.string,
};

export default Card_Profesor;