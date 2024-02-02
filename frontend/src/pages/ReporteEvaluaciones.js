import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { Card, CardContent, Typography, Button, TextField } from '@mui/material';
import '../styles/ReporteEvaluaciones.css'; // Asegúrate de importar el archivo CSS

const ReporteEvaluaciones = () => {
  const email = localStorage.getItem('correo');

  const [alumno, setAlumno] = useState({
    codigo: '',
    nombre: '',
    apellido_pat: '',
    apellido_mat: '',
    telefono: '',
    email: '',
    isDelegado: false,
    nota_ec: 0,
    nota_ef: 0,
    nota_ep: 0,
    promedio: 0,
  });

  const [reclamo, setReclamo] = useState('');
  const [mostrarCajaReclamo, setMostrarCajaReclamo] = useState(false);

  useEffect(() => {
    const fetchAlumno = async () => {
      try {
        const response = await fetch(`${API_URL}/estudiantes/${email}`);
        const data = await response.json();
        setAlumno(data);
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    fetchAlumno();
  }, [email]);

  const handlePresentarReclamo = () => {
    setMostrarCajaReclamo(true);
  };

  const handleEnviarReclamo = async () => {
    try {
      // Realizar la solicitud POST al endpoint /reclamos
      const response = await fetch(`${API_URL}/reclamos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_asociado: email,
          descripcion: reclamo,
        }),
      });

      if (response.ok) {
        console.log('Reclamo enviado con éxito');
        // Puedes realizar acciones adicionales si es necesario, como mostrar un mensaje de éxito o redirigir al usuario
      } else {
        console.error('Error al enviar el reclamo:', response.status, response.statusText);
        // Puedes manejar el error de alguna manera, como mostrando un mensaje de error al usuario
      }
    } catch (error) {
      console.error('Error al enviar el reclamo:', error);
    }
  };

  return (
    <div className="contenedor-notas">
      <h1>Reporte de Evaluaciones</h1>
      <Card className="notas-card">
        <CardContent>
          <Typography variant="h6">Notas de {alumno.nombre} {alumno.apellido_pat}</Typography>
          <Typography>Código: {alumno.codigo}</Typography>
          <Typography>Nota de Evaluación Continua (EC): {alumno.nota_ec}</Typography>
          <Typography>Nota de Examen Final (EF): {alumno.nota_ef}</Typography>
          <Typography>Nota de Examen Parcial (EP): {alumno.nota_ep}</Typography>
          <Typography>Promedio: {alumno.promedio}</Typography>
          <Button variant="contained" color="primary" onClick={handlePresentarReclamo}>
            Presentar Reclamo
          </Button>
          {mostrarCajaReclamo && (
            <div className="reclamo-container">
              <TextField
                label="Descripción del Reclamo"
                multiline
                rows={4}
                value={reclamo}
                onChange={(e) => setReclamo(e.target.value)}
              />
              <Button variant="contained" color="primary" onClick={handleEnviarReclamo}>
                Enviar Reclamo
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReporteEvaluaciones;
