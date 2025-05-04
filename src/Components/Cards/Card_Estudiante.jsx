import React from 'react';

const Card_Estudiante = ({ Carne, Name, Carrera, Pensum, Promedio_Ciclo_Anterior, Grado, Carga_MAX }) => (
    <div className="w-full max-w-4xl p-8 bg-gray-100 border border-gray-200 rounded-lg mb-6">
        <div className="space-y-3">
            <p><strong className="font-bold">Carnet: </strong>{Carne}</p>
            <p><strong className="font-bold">Estudiante: </strong>{Name}</p>
            <p><strong className="font-bold">Carrera: </strong>{Carrera}</p>
            <p><strong className="font-bold">Pensum: </strong> {Pensum}</p>
            <p><strong className="font-bold">Prom. ciclo anterior: </strong>{Promedio_Ciclo_Anterior}</p>
            <p><strong className="font-bold">Grado: </strong>{Grado}</p>
            <p><strong className="font-bold">Carga máxima: </strong>{Carga_MAX}</p>
        </div>
    </div>
);

export default Card_Estudiante;