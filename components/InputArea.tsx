import React, { useState, useRef, useEffect } from 'react';
import Spinner from './Spinner';
import { CameraIcon, CameraOffIcon, CaptureIcon } from './Icons';

interface InputAreaProps {
  onAnalysis: (prompt: string, image?: string) => void;
  isLoading: boolean;
}

const InputArea = ({ onAnalysis, isLoading }: InputAreaProps) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('Standard');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const startCameraStream = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      console.error("Kamerafehler:", err);
      setCameraError("Kamerazugriff verweigert. Bitte Berechtigungen in den Browsereinstellungen prüfen.");
      setIsCameraActive(false);
    }
  };

  const toggleCamera = () => {
    if (isCameraActive) {
      stopCameraStream();
      setIsCameraActive(false);
      setCapturedImage(null);
    } else {
      setIsCameraActive(true);
      startCameraStream();
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
        stopCameraStream();
        setIsCameraActive(false);
      }
    }
  };

  const clearCapture = () => {
    setCapturedImage(null);
    setIsCameraActive(true);
    startCameraStream();
  };

  const handleAnalyzeClick = () => {
    if (capturedImage) {
      onAnalysis(`Identifiziere die Komponente auf dem Bild mit dem Filter '${activeFilter}'.`, capturedImage);
    }
  };
  
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);
  
  const filters = ['Standard', 'Hoher Kontrast', 'Schaltplan', 'Negativ'];

  return (
    <section style={styles.container} aria-labelledby="input-heading">
      <h2 id="input-heading" style={styles.heading}>Eingabe</h2>
      
      <div style={styles.inputMethods}>
        <button onClick={toggleCamera} style={styles.cameraToggleButton}>
          {isCameraActive ? <CameraOffIcon /> : <CameraIcon />}
          {isCameraActive ? 'Kamera deaktivieren' : 'Kamera aktivieren'}
        </button>
        
        <div style={styles.cameraView}>
          {cameraError && <p style={styles.errorText}>{cameraError}</p>}
          {!capturedImage && (
            <video
              ref={videoRef}
              style={{ ...styles.video, display: isCameraActive ? 'block' : 'none' }}
              autoPlay
              playsInline
              muted
            />
          )}
          {capturedImage && (
            <img src={capturedImage} alt="Aufgenommenes Bild" style={styles.video} />
          )}
          {!isCameraActive && !capturedImage && !cameraError && (
              <div style={styles.placeholder}>
                  <CameraIcon />
                  <p>Kamera ist aus</p>
              </div>
          )}
        </div>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        
        {isCameraActive && !capturedImage && (
          <button onClick={handleCapture} style={styles.captureButton}>
            <CaptureIcon /> Foto aufnehmen
          </button>
        )}
        
        {capturedImage && (
           <button onClick={clearCapture} style={styles.secondaryButton}>
             Wiederholen
           </button>
        )}
      </div>

      <div style={styles.filterSection}>
          <h3 style={styles.subHeading}>Filter & Modi</h3>
          <div style={styles.filterButtons}>
              {filters.map(filter => (
                  <button 
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      style={{
                          ...styles.filterButton, 
                          ...(activeFilter === filter ? styles.activeFilter : {})
                      }}
                  >
                      {filter}
                  </button>
              ))}
          </div>
      </div>
      
      <button 
        style={isLoading || !capturedImage ? { ...styles.button, ...styles.buttonDisabled } : styles.button}
        onClick={handleAnalyzeClick} 
        disabled={isLoading || !capturedImage}
        aria-busy={isLoading}
      >
        {isLoading ? <Spinner /> : 'Analysieren'}
      </button>
    </section>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        backgroundColor: 'var(--foreground-color)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    heading: {
        margin: '0 0 0.5rem 0',
        fontSize: '1rem',
        color: 'var(--secondary-color)',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '0.5rem',
    },
    subHeading: {
        margin: '0 0 0.5rem 0',
        fontSize: '0.9rem',
        color: 'var(--text-color)',
        fontWeight: 'normal',
    },
    inputMethods: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    cameraView: {
        width: '100%',
        aspectRatio: '16 / 9',
        backgroundColor: 'var(--background-color)',
        borderRadius: '4px',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid var(--border-color)',
    },
    video: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    placeholder: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        color: 'var(--border-color)',
    },
    cameraToggleButton: {
        backgroundColor: 'var(--border-color)',
        color: 'var(--text-color)',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        cursor: 'pointer',
        fontFamily: 'var(--font-family)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '0.5rem',
    },
    captureButton: {
        backgroundColor: 'var(--success-color)',
        color: '#fff',
        border: 'none',
        padding: '0.75rem',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontFamily: 'var(--font-family)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '0.5rem',
    },
     secondaryButton: {
        backgroundColor: 'var(--border-color)',
        color: 'var(--text-color)',
        border: 'none',
        padding: '0.75rem',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontFamily: 'var(--font-family)',
    },
    button: {
        backgroundColor: 'var(--primary-color)',
        color: '#fff',
        border: 'none',
        padding: '0.75rem',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontFamily: 'var(--font-family)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'opacity 0.2s',
    },
    buttonDisabled: {
        opacity: 0.5,
        cursor: 'not-allowed',
    },
    errorText: {
        color: 'var(--danger-color)',
        padding: '1rem',
        textAlign: 'center',
    },
    filterSection: {
        paddingTop: '0.5rem',
        borderTop: '1px solid var(--border-color)',
    },
    filterButtons: {
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap',
    },
    filterButton: {
        flex: '1 1 auto',
        backgroundColor: 'var(--border-color)',
        color: 'var(--text-color)',
        border: '1px solid var(--border-color)',
        padding: '0.5rem',
        borderRadius: '4px',
        cursor: 'pointer',
        fontFamily: 'var(--font-family)',
        transition: 'background-color 0.2s, border-color 0.2s',
    },
    activeFilter: {
        backgroundColor: 'var(--primary-color)',
        borderColor: 'var(--primary-color)',
        color: '#fff',
    }
};

export default InputArea;
