import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import '../styles/AgregarAlumno.css';  // Agrega esta línea para importar los estilos

const AgregarAlumno = () => {
  const [nuevoAlumno, setNuevoAlumno] = useState({
    codigo: '',
    nombre: '',
    apellido_pat: '',
    apellido_mat: '',
    telefono: '',
    email: '',
    password: '',
    isDelegado: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoAlumno({
      ...nuevoAlumno,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Asigna el código al campo de contraseña antes de enviar la solicitud
      setNuevoAlumno((prevAlumno) => ({
        ...prevAlumno,
        password: prevAlumno.codigo,
      }));
  
      // Realiza la petición para agregar el nuevo alumno
      const response = await axios.post(`${API_URL}/estudiantes`, nuevoAlumno);
      console.log('Alumno agregado:', response.data);
  
      // Limpia el formulario después de agregar el alumno (opcional)
      setNuevoAlumno({
        codigo: '',
        nombre: '',
        apellido_pat: '',
        apellido_mat: '',
        telefono: '',
        email: '',
        password: '',
        isDelegado: false,
      });
    } catch (error) {
      console.error('Error al agregar el alumno:', error);
    }
  };  

  return (
    <div className='contenedor-form'>
      <h1>Agregar Nuevo Alumno</h1>
      <form onSubmit={handleSubmit}>        
        <label htmlFor="codigo">Código:</label>
        <input
            type="text"
            id="codigo"
            name="codigo"
            value={nuevoAlumno.codigo}
            onChange={handleInputChange} autoComplete="off"
        />

        <label htmlFor="nombre">Nombre:</label>
        <input
            type="text"
            id="nombre"
            name="nombre"
            value={nuevoAlumno.nombre}
            onChange={handleInputChange} autoComplete="off"
        />

        <label htmlFor="apellido_pat">Apellido Paterno:</label>
        <input
            type="text"
            id="apellido_pat"
            name="apellido_pat"
            value={nuevoAlumno.apellido_pat}
            onChange={handleInputChange} autoComplete="off"
        />

        <label htmlFor="apellido_mat">Apellido Materno:</label>
        <input
            type="text"
            id="apellido_mat"
            name="apellido_mat"
            value={nuevoAlumno.apellido_mat}
            onChange={handleInputChange} autoComplete="off"
        />

        <label htmlFor="telefono">Teléfono:</label>
        <input
            type="text"
            id="telefono"
            name="telefono"
            value={nuevoAlumno.telefono}
            onChange={handleInputChange} autoComplete="off"
        />

        <label htmlFor="email">Correo Electrónico:</label>
        <input
            type="email"
            id="email"
            name="email"
            value={nuevoAlumno.email}
            onChange={handleInputChange} autoComplete="off"
        />
        <button type="submit">Agregar Alumno</button>
        </form>
    </div>
  );
};

export default AgregarAlumno;
