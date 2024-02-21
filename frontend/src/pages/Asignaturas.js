import React, { useState, useEffect } from 'react';
import { API_URL } from '../config.js';
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, IconButton, Menu, MenuItem, Modal, Backdrop, Fade, TextField, Button } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import '../styles/Asignaturas.css';

const Asignaturas = () => {
    const [estudiantes, setEstudiantes] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [notaEC, setNotaEC] = useState('');
    const [notaEP, setNotaEP] = useState('');
    const [notaEF, setNotaEF] = useState('');    
    const [modoEdicion, setModoEdicion] = useState(false);
    const [edicionHabilitada, setEdicionHabilitada] = useState(false);
    const [campoActual, setCampoActual] = useState('');
    const [currentRowIndex, setCurrentRowIndex] = useState(-1);
    const [reconocimientoActivo, setReconocimientoActivo] = useState(false);
    const [recognition, setRecognition] = useState(null);
    const convertTextToNumber = (text) => {
        const numberWords = {
            'cero': 0,
            'uno': 1,
            'dos': 2,
            'tres': 3,
            'cuatro': 4,
            'cinco': 5,
            'seis': 6,
            'siete': 7,
            'ocho': 8,
            '11': 11,
            '12': 12,
            '13': 13,
            '14':14,
            '15':15,
            '16':16,
            '17':17,
            '18':18,
            '19':19,
            '20':20,
            '9': 9,
            '10': 10,           
        };
        const number = numberWords[text.toLowerCase()];
        return number !== undefined ? number : NaN;
    };
    const cursoId = 1;
    useEffect(() => {
        fetchStudentGrades();
    }, []);

    useEffect(() => {
        if (campoActual !== '' && reconocimientoActivo) {
            startContinuousListening(campoActual, currentRowIndex);
        }
    }, [campoActual, currentRowIndex, reconocimientoActivo]);

    const fetchStudentGrades = async () => {
        try {
            const response = await fetch(`${API_URL}/estudiantes`);
            const data = await response.json();
            const estudiantesConNotas = await Promise.all(data.map(async (estudiante) => {
                const notasResponse = await fetch(`${API_URL}/cursosEst/${estudiante.codigo}/${cursoId}`);
                const notasData = await notasResponse.json();
                return { ...estudiante, ...notasData };
            }));
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
                setNotaEP(String(student.nota_ep));
                setNotaEF(String(student.nota_ef));
                
            } else {
                setModoEdicion(false);
                setNotaEC('');
                setNotaEP('');
                setNotaEF('');
            }
        }
    };

    useEffect(() => {
        if (reconocimientoActivo) {
            startContinuousListening();
        } else {
            stopContinuousListening();
        }
    }, [reconocimientoActivo]);

    const startContinuousListening = () => {
        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = 'es-ES';
        recognition.continuous = true;
    
        recognition.onresult = (event) => {
          let transcript = event.results[0][0].transcript.trim().toLowerCase();
            console.log('Transcripción:', transcript);
        
            const number = convertTextToNumber(transcript);
            if (!isNaN(number)) {
                switch (campoActual) {
                    case 'EC':
                        setNotaEC(number);
                        handleNotaChange('EC', currentRowIndex, number);
                        console.log('Nota EC:', number);
                        break;
                    case 'EP':
                        setNotaEP(number);
                        handleNotaChange('EP', currentRowIndex, number);
                        console.log('Nota EP:', number);
                        break;
                    case 'EF':
                        setNotaEF(number);
                        handleNotaChange('EF', currentRowIndex, number);
                        console.log('Nota EF:', number);
                        break;
                }
            } else {
                // Si el transcript no es un número, limpiar el transcript
                transcript = ''; // Establecer el transcript como una cadena vacía
                console.log('Transcript no es un número, limpiando transcript:', transcript);
                startContinuousListening();
            }
        };
        recognition.start();
        setRecognition(recognition);
    };
    

    const stopContinuousListening = () => {
        if (recognition) {
            recognition.stop();
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
        setReconocimientoActivo(false);
    };

    const handleCalificar = (campo, rowIndex) => {
        setCampoActual(campo);
        setCurrentRowIndex(rowIndex);        
    };

    const handleNotaChange = (campo, rowIndex, value) => {
        if (!isNaN(value)) {
            const updatedEstudiantes = [...estudiantes];
            updatedEstudiantes[rowIndex][`nota_${campo.toLowerCase()}`] = value;
            setEstudiantes(updatedEstudiantes);
    
            let nextCampo = campo;
            let nextRowIndex = rowIndex;
    
            switch (campo) {
                case 'EC':
                    nextCampo = 'EP';
                    break;
                case 'EP':
                    nextCampo = 'EF';
                    break;
                case 'EF':
                    nextCampo = 'EC';
                    nextRowIndex += 1;
                    break;                
            }
    
            if (nextRowIndex >= estudiantes.length) {
                nextRowIndex = 0;
                nextCampo = 'EC';
            }
    
            setCurrentRowIndex(nextRowIndex);
            setCampoActual(nextCampo);
    
            // Calcular el promedio actualizado
            const promedio = calculatePromedio(updatedEstudiantes[rowIndex]);
            updatedEstudiantes[rowIndex]['promedio'] = promedio;
            setEstudiantes(updatedEstudiantes);
        } else {
            alert('Por favor, ingrese un número válido para la nota.');
        }
    };
    
    const calculatePromedio = (estudiante) => {
        const notas = ['nota_ec', 'nota_ef', 'nota_ep'];
        let suma = 0;
        notas.forEach(nota => {
            suma += parseFloat(estudiante[nota]) || 0;
        });
        return (suma / notas.length).toFixed(2);
    };
    
    
    
    const handleGuardarCalificacion = async () => {
        try {
            if (
                parseFloat(notaEC) >= 0 && parseFloat(notaEC) <= 20 &&
                parseFloat(notaEP) >= 0 && parseFloat(notaEP) <= 20 &&
                parseFloat(notaEF) >= 0 && parseFloat(notaEF) <= 20 
                
            ) {
                console.log('Notas a guardar:', { nota_ec: parseFloat(notaEC), nota_ep: parseFloat(notaEP), nota_ef: parseFloat(notaEF) });
                const response = await fetch(`${API_URL}/cursosEst/${selectedStudent.codigo}/${cursoId}/editar-notas`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        nota_ec: parseFloat(notaEC) || 0,                        
                        nota_ep: parseFloat(notaEP) || 0,
                        nota_ef: parseFloat(notaEF) || 0,
                    }),
                });
                if (response.ok) {
                    alert("Notas actualizadas correctamente");
                    const nextRowIndex = currentRowIndex + 1;
                    if (nextRowIndex < estudiantes.length) {
                        setCurrentRowIndex(nextRowIndex);
                        setCampoActual('EC');
                    }
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

    const handleStartNotas = () => {
        setCurrentRowIndex(0);
        setCampoActual('EC');
        setReconocimientoActivo(true);
    };

    return (
        <div className="contenedor-alumnos">
            <h1>Asignaturas</h1>
            <Button variant="contained"
            onClick={handleStartNotas}
            className="custom-button"
            >
                Iniciar Registro por Voz
            </Button>
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
                            <TableCell>Nota EP</TableCell>
                            <TableCell>Nota EF</TableCell>
                            <TableCell>Promedio</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                {estudiantes.map((estudiante, index) => (
                <TableRow key={estudiante.codigo}>
                    <TableCell>{estudiante.codigo}</TableCell>
                    <TableCell>{estudiante.nombre}</TableCell>
                    <TableCell>{estudiante.apellido_pat}</TableCell>
                    <TableCell>{estudiante.apellido_mat}</TableCell>
                    <TableCell>{estudiante.telefono}</TableCell>
                    <TableCell>{estudiante.email}</TableCell>
                    <TableCell>{estudiante.is_delegado ? 'Sí' : 'No'}</TableCell>
                    <TableCell 
                        className={`${campoActual === 'EC' && index === currentRowIndex ? 'current-cell' : ''} ${estudiante.nota_ec >= 0 && estudiante.nota_ec <= 10 ? 'nota-desaprobatoria' : ''}`}
                        contentEditable={edicionHabilitada && modoEdicion}
                        onBlur={(e) => handleNotaChange('EC', index, e.target.innerText)}
                    >
                        {estudiante.nota_ec}
                    </TableCell>
                    <TableCell 
                        className={`${campoActual === 'EP' && index === currentRowIndex ? 'current-cell' : ''} ${estudiante.nota_ep >= 0 && estudiante.nota_ep <= 10 ? 'nota-desaprobatoria' : ''}`}
                        contentEditable={edicionHabilitada && modoEdicion}
                        onBlur={(e) => handleNotaChange('EP', index, e.target.innerText)}
                    >
                        {estudiante.nota_ep}
                    </TableCell>
                    <TableCell 
                        className={`${campoActual === 'EF' && index === currentRowIndex ? 'current-cell' : ''} ${estudiante.nota_ef >= 0 && estudiante.nota_ef <= 10 ? 'nota-desaprobatoria' : ''}`}
                        contentEditable={edicionHabilitada && modoEdicion}
                        onBlur={(e) => handleNotaChange('EF', index, e.target.innerText)}
                    >
                        {estudiante.nota_ef}
                    </TableCell>
                    <TableCell 
                    className={`${campoActual === 'promedio' && index === currentRowIndex ? 'current-cell' : ''} ${estudiante.promedio >= 0 && estudiante.promedio <= 10 ? 'nota-desaprobatoria' : ''}`}
                    contentEditable={edicionHabilitada && modoEdicion}
                    onBlur={(e) => handleNotaChange('promedio', index, e.target.innerText)}
                    >
                    {estudiante.promedio}
                    </TableCell>
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
                        <TextField
                            label="Nota EP"
                            value={notaEP}
                            onChange={(e) => setNotaEP(e.target.value)}
                            disabled={!edicionHabilitada && modoEdicion}
                            inputProps={{ maxLength: 2 }}
                        />
                        <TextField
                            label="Nota EF"
                            value={notaEF}
                            onChange={(e) => setNotaEF(e.target.value)}
                            disabled={!edicionHabilitada && modoEdicion}
                            inputProps={{ maxLength: 2 }}
                        />
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