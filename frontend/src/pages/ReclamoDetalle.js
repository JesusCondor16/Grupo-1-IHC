import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API_URL } from '../config';
import '../styles/ReclamoDetalle.css';
import { Card, CardContent, Typography, Button, TextField } from '@mui/material';

const ReclamoDetalle = () => {
  const { id } = useParams();
  const [reclamo, setReclamo] = useState(null);
  const [mostrarCajaRespuesta, setMostrarCajaRespuesta] = useState(false);
  const [respuesta, setRespuesta] = useState('');

  useEffect(() => {
    const fetchReclamo = async () => {
      try {
        const response = await fetch(`${API_URL}/reclamos/${id}`);
        const data = await response.json();
        setReclamo(data);
        // Si el reclamo está resuelto, muestra la respuesta
        if (data.isResuelto) {
          setMostrarCajaRespuesta(true);
          setRespuesta(data.respuesta);
        }
      } catch (error) {
        console.error('Error fetching reclamo data:', error);
      }
    };

    fetchReclamo();
  }, [id]);

  const handleResolverReclamo = () => {
    setMostrarCajaRespuesta(true);
  };

  const handleEnviarRespuesta = async () => {
    try {
      if (reclamo.isResuelto) {
        console.log('No se puede enviar respuesta. El reclamo ya está resuelto.');
        return;
      }

      const response = await fetch(`${API_URL}/reclamos/resolver/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          respuesta: respuesta,
        }),
      });

      if (response.ok) {
        console.log('Reclamo resuelto con éxito');
        // Actualiza el estado para mostrar la respuesta después de resolver el reclamo
        setRespuesta(respuesta);
      } else {
        console.error('Error al resolver el reclamo:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error al resolver el reclamo:', error);
    }
  };

  if (!reclamo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="contenedor-reclamo-detalle">
      <h1>Detalles del Reclamo</h1>
      <Card className="reclamo-card">
        <CardContent>
          <Typography variant="h6">Reclamo ID: {reclamo._id}</Typography>
          <Typography>Email asociado: {reclamo.email_asociado}</Typography>
          <Typography>Estado: {reclamo.isResuelto ? 'Resuelto' : 'No resuelto'}</Typography>
          <Typography>Descripción: {reclamo.descripcion}</Typography>
          {!reclamo.isResuelto && (
            <Button variant="contained" color="primary" onClick={handleResolverReclamo}>
              Resolver Reclamo
            </Button>
          )}
          {mostrarCajaRespuesta && (
            <div className="reclamo-container">
              {reclamo.isResuelto && (
                <Typography variant="h6">Respuesta: {respuesta}</Typography>
              )}
              {!reclamo.isResuelto && (
                <TextField
                  label="Respuesta"
                  multiline
                  rows={4}
                  value={respuesta}
                  onChange={(e) => setRespuesta(e.target.value)}
                />
              )}
              {!reclamo.isResuelto && (
                <Button variant="contained" color="primary" onClick={handleEnviarRespuesta}>
                  Enviar Respuesta
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReclamoDetalle;
