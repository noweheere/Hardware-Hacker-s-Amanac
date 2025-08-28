
import React, { useState, useRef, useCallback } from 'react';
import { InputMode } from '../types';
import { CameraIcon, TextIcon, UploadIcon, FlipHorizontalIcon, FlashOnIcon, FlashOffIcon } from './Icons';

// FIX: Removed isConfigured prop as API key is now handled via environment variables.
interface InputAreaProps {
  onAnalyze: (textInput?: string, imageBase64?: string, mimeType?: string) => void;
  isLoading: boolean;
  imagePreview: string | null;
  setImagePreview: (preview: string | null) => void;
  setImageData: (data: { base64: string; mimeType: string } | null) => void;
}

const ModeButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold rounded-t-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 ${
            active
                ? 'bg-gray-800 text-cyan-400 border-b-2 border-cyan-400'
                : 'bg-gray-900 text-gray-400 hover:bg-gray-700'
        }`}
    >
        {children}
    </button>
);

const InputArea: React.FC<InputAreaProps> = ({ onAnalyze, isLoading, imagePreview, setImagePreview, setImageData }) => {
    const [inputMode, setInputMode] = useState<InputMode>(InputMode.Upload);
    const [textInput, setTextInput] = useState('');
    const [cameraError, setCameraError] = useState<string | null>(null);

    // Camera effect states
    const [isMirrored, setIsMirrored] = useState(false);
    const [isFlashOn, setIsFlashOn] = useState(false);
    const [torchSupported, setTorchSupported] = useState(false);
    const [activeFilter, setActiveFilter] = useState('none');

    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const filters = [
        { name: 'Ohne', value: 'none' },
        { name: 'Monochrom', value: 'grayscale(100%)' },
        { name: 'Sepia', value: 'sepia(100%)' },
        { name: 'Hoher Kontrast', value: 'contrast(150%)' },
        { name: 'Invertieren', value: 'invert(100%)' },
    ];

    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            const videoTrack = streamRef.current.getVideoTracks()[0];
            const capabilities = videoTrack.getCapabilities();
            // FIX: Cast capabilities to 'any' to access the non-standard 'torch' property.
            if ((capabilities as any).torch) {
                // Unconditionally try to turn off torch, ignoring errors
                // FIX: Cast constraints to 'any' to use the non-standard 'torch' property.
                videoTrack.applyConstraints({ advanced: [{ torch: false }] } as any)
                    .catch(e => console.error("Could not turn off flash on stop", e));
            }
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setIsFlashOn(false); // Reset state
    }, []);

    const handleModeChange = (mode: InputMode) => {
        stopCamera();
        setCameraError(null);
        setInputMode(mode);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = (reader.result as string).split(',')[1];
                setImageData({ base64: base64String, mimeType: file.type });
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const startCamera = async () => {
        stopCamera();
        // Reset camera state for new session
        setIsMirrored(false);
        setTorchSupported(false);
        setIsFlashOn(false);
        setActiveFilter('none');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
            }
            
            // Check for torch (flash) support
            const videoTrack = stream.getVideoTracks()[0];
            const capabilities = videoTrack.getCapabilities();
            // FIX: Cast capabilities to 'any' to access the non-standard 'torch' property.
            if ((capabilities as any).torch) {
                setTorchSupported(true);
            }

            setCameraError(null);
        } catch (err) {
            console.error("Error accessing camera:", err);
            setCameraError("Kamera konnte nicht aufgerufen werden. Bitte Berechtigungen prüfen.");
            stopCamera();
        }
    };
    
    React.useEffect(() => {
      if(inputMode === InputMode.Camera){
        startCamera();
      }
      return () => {
          stopCamera();
      };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputMode]);

    const toggleFlash = async () => {
        if (streamRef.current && torchSupported) {
            const videoTrack = streamRef.current.getVideoTracks()[0];
            try {
                // FIX: Cast constraints to 'any' to use the non-standard 'torch' property.
                await videoTrack.applyConstraints({
                    advanced: [{ torch: !isFlashOn }]
                } as any);
                setIsFlashOn(!isFlashOn);
            } catch (err) {
                console.error('Error toggling flash:', err);
                setCameraError("Blitz konnte nicht umgeschaltet werden.");
            }
        }
    };

    const capturePhoto = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');
            if(ctx){
                // Apply mirror transformation to the canvas
                if (isMirrored) {
                    ctx.translate(canvas.width, 0);
                    ctx.scale(-1, 1);
                }

                // Apply visual filter to the canvas
                ctx.filter = activeFilter;
                
                ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                
                const dataUrl = canvas.toDataURL('image/jpeg');
                setImagePreview(dataUrl);
                setImageData({ base64: dataUrl.split(',')[1], mimeType: 'image/jpeg' });
                stopCamera();
            }
        }
    };

    const handleSubmit = () => {
        if (isLoading) return;
        if (inputMode === InputMode.Text) {
            onAnalyze(textInput);
        } else {
            const finalImageDataBase64 = imagePreview?.split(',')[1];
            const finalMimeType = imagePreview?.match(/data:(.*);/)?.[1] || 'image/png';
            onAnalyze(undefined, finalImageDataBase64, finalMimeType);
        }
    };

    const isSubmitDisabled = isLoading || (inputMode !== InputMode.Text && !imagePreview) || (inputMode === InputMode.Text && !textInput.trim());

    const videoStyles: React.CSSProperties = {
        transform: isMirrored ? 'scaleX(-1)' : 'none',
        filter: activeFilter,
        width: '100%',
        height: '100%',
        objectFit: 'cover'
    };

    return (
        <div className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700">
            <div className="flex">
                <ModeButton active={inputMode === InputMode.Upload} onClick={() => handleModeChange(InputMode.Upload)}><UploadIcon /> Bild hochladen</ModeButton>
                <ModeButton active={inputMode === InputMode.Camera} onClick={() => handleModeChange(InputMode.Camera)}><CameraIcon /> Kamera nutzen</ModeButton>
                <ModeButton active={inputMode === InputMode.Text} onClick={() => handleModeChange(InputMode.Text)}><TextIcon /> Text eingeben</ModeButton>
            </div>
            <div className="p-6">
                {inputMode === InputMode.Upload && (
                    <div className="text-center">
                        <input type="file" id="file-upload" className="hidden" accept="image/*" onChange={handleFileChange} />
                        <label htmlFor="file-upload" className="cursor-pointer inline-block bg-gray-700 text-cyan-300 font-bold py-3 px-6 rounded-md hover:bg-gray-600 transition-colors duration-200">
                            Bilddatei auswählen
                        </label>
                        {imagePreview && <img src={imagePreview} alt="Preview" className="mt-4 max-h-64 mx-auto rounded-lg" />}
                    </div>
                )}
                {inputMode === InputMode.Camera && (
                    <div className="flex flex-col items-center">
                        {cameraError && <p className="text-red-400 mb-4">{cameraError}</p>}
                        <div className="w-full max-w-md bg-black rounded-lg overflow-hidden aspect-video relative">
                            {/* Camera Controls Overlay */}
                            {streamRef.current && !imagePreview && (
                                <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-around gap-2 bg-black/50 p-3 backdrop-blur-sm">
                                    {/* Mirror Button */}
                                    <button 
                                        onClick={() => setIsMirrored(!isMirrored)} 
                                        title="Bild spiegeln" 
                                        aria-label="Bild spiegeln"
                                        aria-pressed={isMirrored}
                                        className={`p-3 rounded-full transition-colors ${isMirrored ? 'bg-cyan-500 text-white' : 'text-gray-200 bg-gray-900/60 hover:bg-gray-700/80'}`}
                                    >
                                        <FlipHorizontalIcon className="w-6 h-6" />
                                    </button>
                                    
                                    {/* Flash Button */}
                                    <button 
                                        onClick={toggleFlash} 
                                        disabled={!torchSupported} 
                                        title={torchSupported ? "Blitz umschalten" : "Blitz nicht verfügbar"} 
                                        aria-label="Blitz umschalten" 
                                        aria-pressed={isFlashOn}
                                        className="p-3 text-gray-200 bg-gray-900/60 rounded-full hover:bg-gray-700/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isFlashOn ? <FlashOnIcon className="w-6 h-6 text-yellow-300" /> : <FlashOffIcon className="w-6 h-6" />}
                                    </button>
                                    
                                    {/* Filter Select */}
                                    <div className="relative">
                                        <label htmlFor="camera-filter" className="sr-only">Kamerafilter</label>
                                        <select
                                            id="camera-filter"
                                            value={activeFilter}
                                            onChange={(e) => setActiveFilter(e.target.value)}
                                            className="bg-gray-900/60 text-gray-200 border-2 border-transparent rounded-full pl-4 pr-10 py-2.5 appearance-none focus:ring-2 focus:ring-cyan-500 focus:outline-none text-base font-medium"
                                            aria-label="Kamerafilter"
                                        >
                                            {filters.map(f => <option key={f.value} value={f.value} className="bg-gray-800 font-medium">{f.name}</option>)}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-300">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {imagePreview ? (
                                <img src={imagePreview} alt="Captured" className="w-full h-full object-cover" />
                             ) : (
                                <video ref={videoRef} autoPlay playsInline style={videoStyles} />
                            )}
                        </div>
                         {streamRef.current && !imagePreview ? (
                             <button onClick={capturePhoto} className="mt-4 bg-cyan-500 text-white font-bold py-2 px-4 rounded-md hover:bg-cyan-600 transition-colors duration-200">Aufnehmen</button>
                         ) : !imagePreview && !cameraError && (
                             <button onClick={startCamera} className="mt-4 bg-gray-700 text-cyan-300 font-bold py-2 px-4 rounded-md hover:bg-gray-600 transition-colors duration-200">Kamera starten</button>
                         )}
                         {imagePreview && (
                             <button onClick={() => { setImagePreview(null); setImageData(null); startCamera(); }} className="mt-4 bg-red-500 text-white font-bold py-2 px-4 rounded-md hover:bg-red-600 transition-colors duration-200">Wiederholen</button>
                         )}
                    </div>
                )}
                {inputMode === InputMode.Text && (
                    <textarea
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder="Modellnummer, S/N, Chip-ID, etc. eingeben."
                        className="w-full h-32 bg-gray-900 text-green-300 p-3 rounded-md border border-gray-700 focus:ring-2 focus:ring-cyan-500 focus:outline-none resize-none transition-all duration-300"
                    />
                )}
                <div className="mt-6 text-center">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitDisabled}
                        className="w-full max-w-xs bg-green-500 text-gray-900 font-bold text-lg py-3 px-6 rounded-md hover:bg-green-400 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                    >
                        {isLoading ? 'Analysiere...' : 'Analysieren'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InputArea;
