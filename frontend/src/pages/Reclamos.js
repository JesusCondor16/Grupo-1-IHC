import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';
import '../styles/Reclamo.css';
import { Button, Card, CardContent, Typography } from '@mui/material';

const Reclamos = () => {
  const [reclamos, setReclamos] = useState([]);

  useEffect(() => {
    const fetchReclamos = async () => {
      try {
        const response = await fetch(`${API_URL}/reclamos`);
        const data = await response.json();
        setReclamos(data);
      } catch (error) {
        console.error('Error fetching reclamos data:', error);
      }
    };

    fetchReclamos();
  }, []);

  const getColorByEstado = (isResuelto) => {
    return isResuelto ? 'green' : 'red';
  };

  return (
    <div className="contenedor-reclamos">
      <h1>Reclamos</h1>
      {reclamos.map((reclamo) => (
        <Card key={reclamo._id} className="reclamo-card">
          <CardContent>
            <Typography variant="h6">Reclamo ID: {reclamo._id}</Typography>
            <Typography>Email asociado: {reclamo.email_asociado}</Typography>
            <Typography style={{ color: getColorByEstado(reclamo.isResuelto) }}>
              Estado: {reclamo.isResuelto ? 'Resuelto' : 'No resuelto'}
            </Typography>
            <Link to={`/Reclamos/${reclamo._id}`}>
              <Button variant="contained" color="primary">
                Ver Detalles
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Reclamos;
