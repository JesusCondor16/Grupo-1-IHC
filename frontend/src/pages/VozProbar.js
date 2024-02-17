import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import '../styles/VozProbar.css';
 
const VozProbar = () => {
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    console.log("Navegador compatible con reconocimiento de voz:", SpeechRecognition.browserSupportsSpeechRecognition());
  }, []);

  useEffect(() => {
    console.log("Reconocimiento de voz activo:", isListening);
  }, [isListening]);

  const startListening = () => {
    SpeechRecognition.startListening({
      language: 'es-ES' // Especifica el idioma español (España)
    });
    setIsListening(true);
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    setIsListening(false);
  };
  
  
   
  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <span>La navegación por voz no es compatible con tu navegador.</span>;
  }

  return (
    <div className="container"> 
      <div className="voice-container">
        <p>Última transcripción: {transcript}</p>
        <button onClick={startListening}>Iniciar reconocimiento de voz</button>
        <button onClick={stopListening}>Detener reconocimiento de voz</button>
        <button onClick={resetTranscript}>Reiniciar transcripción</button>
      </div>
    </div>
  );
}

export default VozProbar;
