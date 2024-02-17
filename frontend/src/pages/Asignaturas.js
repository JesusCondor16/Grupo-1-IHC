import React, { useState, useEffect } from 'react';
import { API_URL } from '../config.js';
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, IconButton, Menu, MenuItem, Modal, Backdrop, Fade, TextField, Button } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MicIcon from '@mui/icons-material/Mic';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import '../styles/Asignaturas.css';
import wordsToNumbers from 'words-to-numbers';

const Asignaturas = () => {
    //voz
    const { transcript, resetTranscript } = useSpeechRecognition();
    const [isListening, setIsListening] = useState(false);
    const [campoActual, setCampoActual] = useState('');
    //
    const [estudiantes, setEstudiantes] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [notaEC, setNotaEC] = useState('');
    const [notaEF, setNotaEF] = useState('');
    const [notaEP, setNotaEP] = useState('');
    const [modoEdicion, setModoEdicion] = useState(false);
    const [edicionHabilitada, setEdicionHabilitada] = useState(false);
    const cursoId = 1;
    //probando

    useEffect(() => {
        fetchStudentGrades();
    }, []);

    useEffect(() => {
        if (transcript !== '') {            
            let numberValue;
    // Intenta convertir la transcripción a un número
    if (transcript === 'uno') {
      numberValue = 1;
    } else if (transcript === 'dos') {
      numberValue = 2;
    } else if (transcript === 'tres') {
      numberValue = 3;
    } else if (transcript === 'cuatro') {
        numberValue =4;
    } else {
      // Si no es "uno", "dos" o "tres", intenta convertir la transcripción a un número
      numberValue = parseInt(transcript);
    }
        
           
            if (!isNaN(numberValue)) {
                
                if (campoActual === 'EC') {
                    setNotaEC(numberValue);
                } else if (campoActual === 'EF') {
                    setNotaEF(numberValue);
                } else if (campoActual === 'EP') {
                    setNotaEP(numberValue);
                }
            }
            resetTranscript();
        }
    }, [transcript, campoActual]);

    const fetchStudentGrades = async () => {
        try {
            const response = await fetch(`${API_URL}/estudiantes`);
            const data = await response.json();
            const estudiantesConNotas = await Promise.all(data.map(async (estudiante) => {
                const notasResponse = await fetch(`${API_URL}/cursosEst/${estudiante.codigo}/${cursoId}`);
                const notasData = await notasResponse.json();
                return { ...estudiante, ...notasData };
            }));
            console.log('Estudiantes con notas:', estudiantesConNotas); // Imprimir los datos de los estudiantes con notas en la consola
            setEstudiantes(estudiantesConNotas);
        } catch (error) {
            console.error('Error fetching estudiantes data:', error);
        }
    };
  
    const handleOpenMenu = (event, student) => {
        if (event) {
            setAnchorEl(event.currentTarget);
            setSelectedStudent(student);
            setEdicionHabilitada(false);
            if (student.nota_ec !== null && student.nota_ef !== null && student.nota_ep !== null) {
                setModoEdicion(true);
                setNotaEC(String(student.nota_ec));
                setNotaEF(String(student.nota_ef));
                setNotaEP(String(student.nota_ep));
            } else {
                setModoEdicion(false);
                setNotaEC('');
                setNotaEF('');
                setNotaEP('');
            }
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
        setEdicionHabilitada(false);
    };

    const handleCalificar = () => {
        handleOpenMenu();
        handleOpenModal();
        setModoEdicion(false);
    };

    const handleGuardarCalificacion = async () => {
        try {
            // Validar que las notas estén dentro del rango permitido (0 - 20)
            if (
                parseFloat(notaEC) >= 0 && parseFloat(notaEC) <= 20 &&
                parseFloat(notaEF) >= 0 && parseFloat(notaEF) <= 20 &&
                parseFloat(notaEP) >= 0 && parseFloat(notaEP) <= 20
            ) {
                // Realizar la solicitud al backend solo si las notas son válidas
                const response = await fetch(`${API_URL}/cursosEst/${selectedStudent.codigo}/${cursoId}/editar-notas`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        nota_ec: parseFloat(notaEC) || 0,
                        nota_ef: parseFloat(notaEF) || 0,
                        nota_ep: parseFloat(notaEP) || 0,
                    }),
                });
                if (response.ok) {
                    alert("Notas actualizadas correctamente");
                } else {
                    alert('Error al actualizar las notas:', response.statusText);
                }
                fetchStudentGrades();
                handleCloseModal();
            } else {
                alert('Por favor, asegúrese de ingresar notas válidas, el rango válido es de 0 a 20.');
            }
        } catch (error) {
            console.error('Error al guardar o actualizar las notas:', error);
        }
    }; 
  
    const handleEditarNotas = () => {
        setEdicionHabilitada(true);
        handleOpenModal();
    };

    const startListening = (campo) => {
        setIsListening(true);
        SpeechRecognition.startListening({
            language: 'es-ES' // Especifica el idioma español (España)
        });
        setCampoActual(campo);
    };
    
    const stopListening = () => {
        setIsListening(false);
        SpeechRecognition.stopListening();
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
                                <TableCell>{estudiante.is_delegado ? 'Sí' : 'No'}</TableCell>
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
                                        <MenuItem onClick={handleEditarNotas}>Editar Notas</MenuItem>
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
                            disabled={!edicionHabilitada && modoEdicion}
                            inputProps={{ maxLength: 2 }}
                        />
                        <IconButton onClick={() => startListening('EC')}>
                            <MicIcon />
                        </IconButton>
                        <TextField
                            label="Nota EF"
                            value={notaEF}
                            onChange={(e) => setNotaEF(e.target.value)}
                            disabled={!edicionHabilitada && modoEdicion}
                            inputProps={{ maxLength: 2 }}
                        />
                        <IconButton onClick={() => startListening('EF')}>
                            <MicIcon />
                        </IconButton>
                        <TextField
                            label="Nota EP"
                            value={notaEP}
                            onChange={(e) => setNotaEP(e.target.value)}
                            disabled={!edicionHabilitada && modoEdicion}
                            inputProps={{ maxLength: 2 }}
                        />
                        <IconButton onClick={() => startListening('EP')}>
                            <MicIcon />
                        </IconButton>
                        <Button variant="contained" onClick={handleGuardarCalificacion}>
                            Guardar Calificación
                        </Button>
                        <Button variant="contained" onClick={handleCloseModal}>
                            Cancelar
                        </Button>
                    </div>
                </Fade>
            </Modal>
        </div>
    );
};

export default Asignaturas;
