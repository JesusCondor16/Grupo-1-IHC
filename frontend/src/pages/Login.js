import React from "react";
import { Link } from "react-router-dom";
import logo from "../img/logo.png";

export default function Login() {
  return (
    <div className="fondo-pantalla">
      <div className="contenedor-principal">
        <h1>Seguimiento de notas y reclamos</h1>
      </div>

      <div className="contenedor-horizontal">
        <div className="contenedor-profesor">
          <div className="titulo-profesores">
            <h2>Profesores</h2>
            <Link to="/login-profesor">
              <button className="titulo-profesores-button">
                Iniciar Sesión
              </button>
            </Link>
          </div>
        </div>

        <div className="contenedor-estudiante">
          <div className="titulo-estudiante">
            <h2>Estudiantes</h2>
            <Link to="/login-estudiante">
              <button className="titulo-estudiante-button">
                Iniciar Sesión
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
