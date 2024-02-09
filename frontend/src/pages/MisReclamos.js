// MisReclamos.js

import React, { useState, useEffect } from "react";
import { API_URL } from "../config";
import "../styles/MisReclamos.css"; // Importa el archivo CSS si es necesario
import { Card, CardContent, Typography } from "@mui/material";

const MisReclamos = () => {
  const email = localStorage.getItem("correo");
  const [reclamos, setReclamos] = useState([]);

  useEffect(() => {
    const fetchReclamos = async () => {
      try {
        const response = await fetch(`${API_URL}/reclamos/email/${email}`);
        const data = await response.json();
        setReclamos(data);
      } catch (error) {
        console.error("Error fetching reclamos data:", error);
      }
    };

    fetchReclamos();
  }, [email]);

  return (
    <div className="contenedor-mis-reclamos">
      <h1 className="titulo-mis-reclamos">Mis Reclamos</h1>
      {reclamos.map((reclamo) => (
        <Card key={reclamo._id} className="reclamo-card">
          <CardContent>
            <Typography variant="h6">
              Estado del Reclamo:{" "}
              {reclamo.isResuelto ? "Resuelto" : "No resuelto"}
            </Typography>
            <Typography>Descripción: {reclamo.descripcion}</Typography>
            <Typography>
              Respuesta del Profesor: {reclamo.respuesta || "Sin respuesta"}
            </Typography>
            <Typography>Fecha de emisión: {reclamo.fecha_emision}</Typography>
            <Typography>Fecha de respuesta: {reclamo.fecha_rpta}</Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MisReclamos;
