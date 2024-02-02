import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Sidebar from "./components/Sidebar";
import EstudianteMain from "./pages/EstudianteMain.js";
import MainProfesor from "./pages/MainProfesor.js";
import { Helmet } from "react-helmet";
import Login from "./pages/Login.js";
import LoginEst from "./pages/EstLogin.js";
import LoginProf from "./pages/ProfLogin.js";
import Editar from "./pages/Editar.js";
import ReporteEvaluaciones from "./pages/ReporteEvaluaciones.js";
import Reclamos from "./pages/Reclamos.js";
import Asignaturas from "./pages/Asignaturas.js";
import ReclamoDetalle from "./pages/ReclamoDetalle.js";
import MisReclamos from "./pages/MisReclamos.js";
import AgregarAlumno from "./pages/AgregarAlumno.js";

function App() {
  return (
    <div className="App">
      <Router>
        <Helmet>
          <title>Sistema Evaluaciones</title>
        </Helmet>
        <Sidebar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login-profesor" element={<LoginProf />} />
          <Route path="/login-estudiante" element={<LoginEst />} />            
          <Route path="/EstudianteMain" element={<EstudianteMain />} />
          <Route path="/ProfesorMain" element={<MainProfesor />} />
          <Route path="/Editar" element={<Editar />} />
          <Route path="/ReporteEvaluaciones" element={<ReporteEvaluaciones />} />          
          <Route path="/Asignaturas" element={<Asignaturas />} /> 
          <Route path="/LeerReclamos" element={<Reclamos />} /> 
          <Route path="/Reclamos/:id" element={<ReclamoDetalle />} />
          <Route path="/MisReclamos" element={<MisReclamos />} />
          <Route path="/AgregarAlumno" element={<AgregarAlumno />} />
        </Routes>
      </Router>
    </div>    
  );  
}

export default App;
