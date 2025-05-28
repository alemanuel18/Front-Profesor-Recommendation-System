# 🎓 Front-End del Sistema de Recomendación de Profesores
https://github.com/alemanuel18/Front-Profesor-Recommendation-System.git

Este proyecto corresponde al **frontend** de un sistema de recomendación de profesores universitarios, desarrollado con React y conectado a su respectivo backend utilizando FastAPI. Permite a los estudiantes recibir sugerencias personalizadas de profesores con base en criterios como experiencia, calificaciones y áreas de especialidad.

## 🧠 Características del Proyecto

- Interfaz intuitiva para estudiantes.
- Visualización clara de los profesores recomendados.
- Comunicación fluida con el backend basado en grados y relaciones.
- Uso de rutas protegidas y autenticación.

## Instalar node.js

Es necesario instalar node.js para poder ver/modificar/correr el proyecto.

1. Ir a la pagina de node.js: https://nodejs.org/en 
2. Descargar node.js
3. Instalar node.js siguiendo los pasos que indica.
4. luego de la instalación verificar que esta se realizase de manera exitosa. Abriendo el CMD como administrador y correr el siguiente comando. 

```bash
node -v
```

## Correr el proyecto

1. Se instala npm para poder ejecutar el proyecto
```bash
npm install
```

2. Se ejecuta el programa
```bash
npm run dev
```

## 🧱 Modelo de Datos
Este frontend interactúa con un backend que modela entidades como:

- Estudiante 👨‍🎓
- Profesor 👨‍🏫
- Curso 📚
- Relaciones entre estudiantes, profesores y cursos.

Las recomendaciones se basan en los grados y características de estos nodos en la base de datos.

## 🤖 Algoritmo de Recomendación
El sistema utiliza un algoritmo basado en grafos y pesos personalizados para:

- Evaluar compatibilidad estudiante-profesor.
- Sugerir al estudiante los profesores con mayor afinidad según sus preferencias y rendimiento académico.
- Consultar relaciones desde la base de datos Neo4j mediante una API.
