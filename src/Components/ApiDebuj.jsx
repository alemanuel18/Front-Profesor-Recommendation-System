import React, { useState } from 'react';
import apiService from '../services/apiService';

const ApiDebug = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const addResult = (test, status, message, data = null) => {
    setResults(prev => [...prev, {
      id: Date.now(),
      test,
      status,
      message,
      data,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const clearResults = () => {
    setResults([]);
  };

  const testBasicConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const text = await response.text();
      addResult('Conexión Básica', 'success', `Respuesta: ${response.status}`, text);
    } catch (error) {
      addResult('Conexión Básica', 'error', error.message);
    }
    setLoading(false);
  };

  const testHealthCheck = async () => {
    setLoading(true);
    try {
      const result = await apiService.healthCheck();
      addResult('Health Check', 'success', 'API funcionando', result);
    } catch (error) {
      addResult('Health Check', 'error', error.message);
    }
    setLoading(false);
  };

  const testGetEstudiante = async () => {
    setLoading(true);
    try {
      const result = await apiService.getEstudiante('JEREZ MELGAR, ALEJANDRO MANUEL');
      addResult('Get Estudiante', 'success', 'Estudiante obtenido', result);
    } catch (error) {
      addResult('Get Estudiante', 'error', error.message);
    }
    setLoading(false);
  };

  const testGetRecomendaciones = async () => {
    setLoading(true);
    try {
      const result = await apiService.getRecomendaciones('JEREZ MELGAR, ALEJANDRO MANUEL', 3);
      addResult('Get Recomendaciones', 'success', 'Recomendaciones obtenidas', result);
    } catch (error) {
      addResult('Get Recomendaciones', 'error', error.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Debug API Connection</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <button
          onClick={testBasicConnection}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Test Conexión
        </button>
        
        <button
          onClick={testHealthCheck}
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Health Check
        </button>
        
        <button
          onClick={testGetEstudiante}
          disabled={loading}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Get Estudiante
        </button>
        
        <button
          onClick={testGetRecomendaciones}
          disabled={loading}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Get Recomendaciones
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={clearResults}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Limpiar Resultados
        </button>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {results.map((result) => (
          <div
            key={result.id}
            className={`p-4 rounded-lg border-l-4 ${
              result.status === 'success'
                ? 'bg-green-50 border-green-500'
                : 'bg-red-50 border-red-500'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-800">{result.test}</h3>
              <span className="text-sm text-gray-500">{result.timestamp}</span>
            </div>
            
            <p className={`mb-2 ${
              result.status === 'success' ? 'text-green-700' : 'text-red-700'
            }`}>
              {result.message}
            </p>
            
            {result.data && (
              <details className="mt-2">
                <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                  Ver datos completos
                </summary>
                <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ))}
        
        {results.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No hay resultados aún. Ejecuta una prueba para comenzar.
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiDebug;