import React from 'react';
import { CloseIcon, InfoIcon, TrashIcon } from './Icons';

interface SettingsModalProps {
    onClose: () => void;
    onClearNotes: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, onClearNotes }) => {
    // Prevent background scrolling when the modal is open
    React.useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-title"
        >
            <div 
                className="bg-gray-800 border border-cyan-400/30 rounded-lg shadow-2xl w-full max-w-lg relative"
                onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
            >
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <h2 id="settings-title" className="text-2xl font-bold text-cyan-400">Einstellungen</h2>
                    <button 
                        onClick={onClose} 
                        className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                        aria-label="Einstellungen schließen"
                    >
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-cyan-300 mb-2">API-Schlüssel-Konfiguration</h3>
                        <div className="flex items-start gap-3 text-sm text-gray-300">
                            <InfoIcon className="w-5 h-5 mt-0.5 text-cyan-400 flex-shrink-0" />
                            <p>
                                Aus Sicherheitsgründen wird der Google Gemini API-Schlüssel über eine Umgebungsvariable (<code className="bg-gray-700 text-green-300 px-1.5 py-0.5 rounded-md text-xs">API_KEY</code>) geladen. Er wird nicht in der App gespeichert oder eingegeben, um Ihren Schlüssel zu schützen. Bitte befolgen Sie die Anweisungen in der Anleitung, um ihn einzurichten.
                            </p>
                        </div>
                    </div>

                    <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-cyan-300 mb-3">Datenverwaltung</h3>
                        <p className="text-sm text-gray-400 mb-3">
                           Ihre Projektnotizen werden lokal in Ihrem Browser gespeichert. Sie können sie hier löschen.
                        </p>
                        <button 
                            onClick={onClearNotes}
                            className="w-full flex items-center justify-center gap-2 bg-red-600/80 text-white font-bold py-2 px-4 rounded-md hover:bg-red-600 transition-colors duration-200"
                        >
                            <TrashIcon className="w-5 h-5" />
                            Alle Projektnotizen löschen
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
