import React, { useState, useEffect } from 'react';
import { API_URL } from '../config.js';
import {  Table,  TableContainer,  TableHead,  TableRow,  TableCell,  TableBody,  Paper,  IconButton,  Menu,  MenuItem,  Modal,  Backdrop,  Fade,  TextField,   Button,} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import '../styles/Asignaturas.css'; // Asegúrate de tener este archivo importado si contiene estilos adicionales

const Asignaturas = () => {
    const [estudiantes, setEstudiantes] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [notaEC, setNotaEC] = useState('');
    const [notaEF, setNotaEF] = useState('');
    const [notaEP, setNotaEP] = useState('');
    const [notasIniciales, setNotasIniciales] = useState(null);
  
    useEffect(() => {
      const fetchEstudiantes = async () => {
        try {
          const response = await fetch(`${API_URL}/estudiantes`);
          const data = await response.json();
          setEstudiantes(data);
        } catch (error) {
          console.error('Error fetching estudiantes data:', error);
        }
      };
  
      fetchEstudiantes();
    }, []);
  
///modal

    const handleOpenMenu = (event, student) => {
      if (event) {
        setAnchorEl(event.currentTarget);
        setSelectedStudent(student);
        setNotasIniciales({
          notaEC: student.nota_ec,
          notaEF: student.nota_ef,
          notaEP: student.nota_ep,
        });
      }
    };
  
    const handleCloseMenu = () => {
      setAnchorEl(null);
    };
  
    const handleOpenModal = () => {
      setOpenModal(true);
    };
  
    const handleCloseModal = () => {
      setOpenModal(false);
    };
  
    const handleCalificar = () => {
      handleOpenMenu();
      handleOpenModal();
    };

      
    const handleGuardarCalificacion = async () => {
      try {
        // Lógica para guardar las calificaciones
        console.log('Calificación guardada:', notaEC, notaEF, notaEP);
    
        // Realizar la solicitud a la API
        const response = await fetch(`${API_URL}/estudiantes/notas/${selectedStudent.email}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nota_ec: parseFloat(notaEC),
            nota_ep: parseFloat(notaEP),
            nota_ef: parseFloat(notaEF),
          }),
        });
    
        if (!response.ok) {
          throw new Error(`Error al enviar las notas. Código de respuesta: ${response.status}`);
        }
    
        // Mostrar alerta de éxito
        alert('Notas enviadas exitosamente.');
    
        // Actualizar la tabla (vuelve a cargar los datos de los estudiantes)
        const updatedEstudiantes = await fetch(`${API_URL}/estudiantes`).then(response => response.json());
        setEstudiantes(updatedEstudiantes);
    
        // Cierra el modal
        handleCloseModal();
      } catch (error) {
        console.error('Error al enviar las notas:', error);
        // Aquí puedes manejar el error de acuerdo a tus necesidades
      }
    };
    
    const handleEditarNotas = () => {
      console.log('Editar notas del estudiante:', selectedStudent);
    };
  
    return (
        <div className="contenedor-alumnos">
          <h1>Asignaturas</h1>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Código</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Apellido Paterno</TableCell>
                  <TableCell>Apellido Materno</TableCell>
                  <TableCell>Teléfono</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Delegado</TableCell>
                  <TableCell>Nota EC</TableCell>
                  <TableCell>Nota EF</TableCell>
                  <TableCell>Nota EP</TableCell>
                  <TableCell>Promedio</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {estudiantes.map((estudiante) => (
                  <TableRow key={estudiante.codigo}>
                    <TableCell>{estudiante.codigo}</TableCell>
                    <TableCell>{estudiante.nombre}</TableCell>
                    <TableCell>{estudiante.apellido_pat}</TableCell>
                    <TableCell>{estudiante.apellido_mat}</TableCell>
                    <TableCell>{estudiante.telefono}</TableCell>
                    <TableCell>{estudiante.email}</TableCell>
                    <TableCell>{estudiante.isDelegado ? 'Sí' : 'No'}</TableCell>
                    <TableCell>{estudiante.nota_ec}</TableCell>
                    <TableCell>{estudiante.nota_ef}</TableCell>
                    <TableCell>{estudiante.nota_ep}</TableCell>
                    <TableCell>{estudiante.promedio}</TableCell>
                    <TableCell>
                    <IconButton
                        size="small"
                        aria-controls="actions-menu"
                        aria-haspopup="true"
                        onClick={(e) => handleOpenMenu(e, estudiante)}
                    >
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                      id="actions-menu"
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleCloseMenu}
                      elevation={2} 
                    >
                      <MenuItem onClick={handleCalificar}>Calificar</MenuItem>
                      <MenuItem onClick={handleCalificar}>Editar Notas</MenuItem>
                    </Menu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
          <div className="modal-paper">
            <h2 id="transition-modal-title">Calificar Estudiante</h2>
            <TextField
              label="Nota EC"
              value={notaEC}
              onChange={(e) => setNotaEC(e.target.value)}
            />
            <TextField
              label="Nota EF"
              value={notaEF}
              onChange={(e) => setNotaEF(e.target.value)}
            />
            <TextField
              label="Nota EP"
              value={notaEP}
              onChange={(e) => setNotaEP(e.target.value)}
            />
            <Button variant="contained" onClick={handleGuardarCalificacion}>
              Guardar Calificación
            </Button>
          </div>
        </Fade>
      </Modal>                    
        </div>
      );
      
  };  
  
export default Asignaturas;
