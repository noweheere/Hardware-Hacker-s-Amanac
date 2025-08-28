
import React, { useState, useRef, useCallback } from 'react';
import { InputMode } from '../types';
import { CameraIcon, TextIcon, UploadIcon } from './Icons';

interface InputAreaProps {
  onAnalyze: (textInput?: string, imageBase64?: string, mimeType?: string) => void;
  isLoading: boolean;
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

const InputArea: React.FC<InputAreaProps> = ({ onAnalyze, isLoading }) => {
    const [inputMode, setInputMode] = useState<InputMode>(InputMode.Upload);
    const [textInput, setTextInput] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageData, setImageData] = useState<{ base64: string; mimeType: string } | null>(null);
    const [cameraError, setCameraError] = useState<string | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    }, []);

    const handleModeChange = (mode: InputMode) => {
        stopCamera();
        setCameraError(null);
        setImagePreview(null);
        setImageData(null);
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
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
            }
            setCameraError(null);
        } catch (err) {
            console.error("Error accessing camera:", err);
            setCameraError("Could not access camera. Please check permissions.");
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

    const capturePhoto = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');
            if(ctx){
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
            onAnalyze(undefined, imageData?.base64, imageData?.mimeType);
        }
    };

    return (
        <div className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700">
            <div className="flex">
                <ModeButton active={inputMode === InputMode.Upload} onClick={() => handleModeChange(InputMode.Upload)}><UploadIcon /> Upload Image</ModeButton>
                <ModeButton active={inputMode === InputMode.Camera} onClick={() => handleModeChange(InputMode.Camera)}><CameraIcon /> Use Camera</ModeButton>
                <ModeButton active={inputMode === InputMode.Text} onClick={() => handleModeChange(InputMode.Text)}><TextIcon /> Enter Text</ModeButton>
            </div>
            <div className="p-6">
                {inputMode === InputMode.Upload && (
                    <div className="text-center">
                        <input type="file" id="file-upload" className="hidden" accept="image/*" onChange={handleFileChange} />
                        <label htmlFor="file-upload" className="cursor-pointer inline-block bg-gray-700 text-cyan-300 font-bold py-3 px-6 rounded-md hover:bg-gray-600 transition-colors duration-200">
                            Select an Image File
                        </label>
                        {imagePreview && <img src={imagePreview} alt="Preview" className="mt-4 max-h-64 mx-auto rounded-lg" />}
                    </div>
                )}
                {inputMode === InputMode.Camera && (
                    <div className="flex flex-col items-center">
                        {cameraError && <p className="text-red-400 mb-4">{cameraError}</p>}
                        <div className="w-full max-w-md bg-black rounded-lg overflow-hidden aspect-video relative">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Captured" className="w-full h-full object-cover" />
                             ) : (
                                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                            )}
                        </div>
                         {streamRef.current && !imagePreview ? (
                             <button onClick={capturePhoto} className="mt-4 bg-cyan-500 text-white font-bold py-2 px-4 rounded-md hover:bg-cyan-600 transition-colors duration-200">Capture</button>
                         ) : !imagePreview && !cameraError && (
                             <button onClick={startCamera} className="mt-4 bg-gray-700 text-cyan-300 font-bold py-2 px-4 rounded-md hover:bg-gray-600 transition-colors duration-200">Start Camera</button>
                         )}
                         {imagePreview && (
                             <button onClick={() => { setImagePreview(null); setImageData(null); startCamera(); }} className="mt-4 bg-red-500 text-white font-bold py-2 px-4 rounded-md hover:bg-red-600 transition-colors duration-200">Retake</button>
                         )}
                    </div>
                )}
                {inputMode === InputMode.Text && (
                    <textarea
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder="Enter Model Number, S/N, Chip ID, etc."
                        className="w-full h-32 bg-gray-900 text-green-300 p-3 rounded-md border border-gray-700 focus:ring-2 focus:ring-cyan-500 focus:outline-none resize-none transition-all duration-300"
                    />
                )}
                <div className="mt-6 text-center">
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading || (inputMode !== InputMode.Text && !imageData) || (inputMode === InputMode.Text && !textInput.trim())}
                        className="w-full max-w-xs bg-green-500 text-gray-900 font-bold text-lg py-3 px-6 rounded-md hover:bg-green-400 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                    >
                        {isLoading ? 'Analyzing...' : 'Analyze'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InputArea;
