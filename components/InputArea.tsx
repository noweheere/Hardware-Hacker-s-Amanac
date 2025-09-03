import React, { useState, useRef, useEffect } from 'react';
import Spinner from './Spinner';
import { CameraIcon, CameraOffIcon, CaptureIcon, WifiIcon } from './Icons';

interface InputAreaProps {
  onAnalysis: (prompt: string, image?: string) => void;
  isLoading: boolean;
}

type CameraMode = 'builtin' | 'ipcam';

const InputArea = ({ onAnalysis, isLoading }: InputAreaProps) => {
  const [cameraMode, setCameraMode] = useState<CameraMode>('builtin');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [ipCamUrl, setIpCamUrl] = useState('');
  const [isIpCamConnected, setIsIpCamConnected] = useState(false);
  const [ipCamError, setIpCamError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('Standard');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ipCamRef = useRef<HTMLImageElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };
  
  const handleIpCamDisconnect = () => {
    if (ipCamRef.current) {
      ipCamRef.current.src = '';
    }
    setIsIpCamConnected(false);
    setIpCamError(null);
  };
  
  const switchCameraMode = (mode: CameraMode) => {
    if (cameraMode === mode) return;
    stopCameraStream();
    handleIpCamDisconnect();
    setCapturedImage(null);
    setCameraError(null);
    setIpCamError(null);
    setCameraMode(mode);
  };

  const startCameraStream = async () => {
    if (isCameraActive) return;
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Kamerafehler:", err);
      setCameraError("Kamerazugriff verweigert. Bitte Berechtigungen prüfen.");
      setIsCameraActive(false);
    }
  };

  const toggleCamera = () => {
    if (isCameraActive) {
      stopCameraStream();
    } else {
      startCameraStream();
    }
  };

  const handleIpCamConnect = () => {
    if (!ipCamUrl) {
        setIpCamError("Bitte eine gültige URL eingeben.");
        return;
    }
    setIpCamError(null);
    setIsIpCamConnected(true);
  };

  const handleCapture = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    let source: HTMLVideoElement | HTMLImageElement | null = null;
    if (cameraMode === 'builtin' && videoRef.current) {
        source = videoRef.current;
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
    } else if (cameraMode === 'ipcam' && ipCamRef.current) {
        source = ipCamRef.current;
        canvas.width = ipCamRef.current.naturalWidth;
        canvas.height = ipCamRef.current.naturalHeight;
    }

    if (source) {
        context.drawImage(source, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
        if (cameraMode === 'builtin') {
          stopCameraStream();
        }
    }
  };

  const clearCapture = () => {
    setCapturedImage(null);
    if (cameraMode === 'builtin') {
      startCameraStream();
    }
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

      <div style={styles.tabs}>
        <button onClick={() => switchCameraMode('builtin')} style={cameraMode === 'builtin' ? {...styles.tab, ...styles.activeTab} : styles.tab}><CameraIcon/> Integrierte Kamera</button>
        <button onClick={() => switchCameraMode('ipcam')} style={cameraMode === 'ipcam' ? {...styles.tab, ...styles.activeTab} : styles.tab}><WifiIcon/> IP-Kamera</button>
      </div>
      
      {cameraMode === 'builtin' && (
        <div style={styles.inputMethods}>
          <button onClick={toggleCamera} style={styles.cameraToggleButton}>
            {isCameraActive ? <CameraOffIcon /> : <CameraIcon />}
            {isCameraActive ? 'Kamera deaktivieren' : 'Kamera aktivieren'}
          </button>
        </div>
      )}

      {cameraMode === 'ipcam' && (
        <div style={styles.ipCamControls}>
          <input 
            type="text" 
            value={ipCamUrl}
            onChange={(e) => setIpCamUrl(e.target.value)}
            placeholder="http://192.168.1.10:4747/video"
            style={styles.urlInput}
            aria-label="IP-Kamera URL"
            disabled={isIpCamConnected}
          />
          {!isIpCamConnected ? (
             <button onClick={handleIpCamConnect} style={styles.connectButton}>Verbinden</button>
          ) : (
             <button onClick={handleIpCamDisconnect} style={styles.disconnectButton}>Trennen</button>
          )}
        </div>
      )}
      
      <div style={styles.cameraView}>
        {capturedImage ? (
          <img src={capturedImage} alt="Aufgenommenes Bild" style={styles.video} />
        ) : (
          <>
            {cameraMode === 'builtin' && isCameraActive && <video ref={videoRef} style={styles.video} autoPlay playsInline muted />}
            {cameraMode === 'ipcam' && isIpCamConnected && (
                <img 
                    ref={ipCamRef} 
                    src={ipCamUrl} 
                    style={styles.video} 
                    alt="IP-Kamera Stream" 
                    crossOrigin="anonymous"
                    onError={() => {
                      setIpCamError("Stream konnte nicht geladen werden. URL prüfen oder CORS-Problem.");
                      setIsIpCamConnected(false);
                    }}
                />
            )}
            
            {!isCameraActive && !isIpCamConnected && !cameraError && !ipCamError && (
              <div style={styles.placeholder}>
                {cameraMode === 'builtin' ? <CameraIcon /> : <WifiIcon />}
                <p>{cameraMode === 'builtin' ? "Kamera ist aus" : "IP-Kamera nicht verbunden"}</p>
              </div>
            )}
            
            {cameraError && <p style={styles.errorText}>{cameraError}</p>}
            {ipCamError && <p style={styles.errorText}>{ipCamError}</p>}
          </>
        )}
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
        
      {!capturedImage && (isCameraActive || isIpCamConnected) && (
        <button onClick={handleCapture} style={styles.captureButton}>
          <CaptureIcon /> Foto aufnehmen
        </button>
      )}
      
      {capturedImage && (
         <button onClick={clearCapture} style={styles.secondaryButton}>
           Wiederholen
         </button>
      )}

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
    tabs: {
        display: 'flex',
        gap: '0.5rem',
    },
    tab: {
        flex: 1,
        backgroundColor: 'var(--border-color)',
        color: 'var(--text-color)',
        border: '1px solid var(--border-color)',
        padding: '0.5rem',
        borderRadius: '4px',
        cursor: 'pointer',
        fontFamily: 'var(--font-family)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '0.5rem',
        transition: 'background-color 0.2s',
    },
    activeTab: {
        backgroundColor: 'var(--primary-color)',
        color: '#fff',
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
    ipCamControls: {
        display: 'flex',
        gap: '0.5rem',
    },
    urlInput: {
        flexGrow: 1,
        backgroundColor: 'var(--background-color)',
        color: 'var(--text-color)',
        border: '1px solid var(--border-color)',
        borderRadius: '4px',
        padding: '0.5rem',
        fontFamily: 'var(--font-family)',
    },
    connectButton: {
        backgroundColor: 'var(--success-color)',
        color: '#fff',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        cursor: 'pointer',
        fontFamily: 'var(--font-family)',
    },
    disconnectButton: {
        backgroundColor: 'var(--danger-color)',
        color: '#fff',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        cursor: 'pointer',
        fontFamily: 'var(--font-family)',
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
