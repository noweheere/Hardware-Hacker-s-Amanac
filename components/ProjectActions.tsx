import React from 'react';
import { DocumentDownloadIcon, FolderOpenIcon, SaveIcon } from './Icons';

interface ProjectActionsProps {
    onSave: () => void;
    onLoad: () => void;
    onExportPdf: () => void;
    disabled: boolean;
}

const ActionButton: React.FC<{ onClick: () => void; disabled: boolean; children: React.ReactNode }> = ({ onClick, disabled, children }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className="flex items-center justify-center gap-2 w-full bg-gray-700 text-cyan-300 font-bold py-2 px-4 rounded-md hover:bg-gray-600 transition-colors duration-200 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed"
    >
        {children}
    </button>
);

const ProjectActions: React.FC<ProjectActionsProps> = ({ onSave, onLoad, onExportPdf, disabled }) => {
    return (
        <div className="bg-gray-800/50 rounded-lg p-4">
            <h2 className="text-xl font-bold text-cyan-400 mb-4 border-b border-cyan-400/30 pb-2">Projekt-Aktionen</h2>
            <div className="space-y-3">
                <ActionButton onClick={onSave} disabled={disabled}>
                    <SaveIcon />
                    Projekt speichern
                </ActionButton>
                <ActionButton onClick={onLoad} disabled={false}> {/* Load is always enabled */}
                    <FolderOpenIcon />
                    Projekt laden
                </ActionButton>
                 <ActionButton onClick={onExportPdf} disabled={disabled}>
                    <DocumentDownloadIcon />
                    PDF exportieren
                </ActionButton>
            </div>
             <p className="text-xs text-gray-500 mt-3">Speichern Sie Ihr Projekt als JSON-Datei oder laden Sie eine vorhandene. Exportieren Sie einen PDF-Bericht zum Teilen.</p>
        </div>
    );
};

export default ProjectActions;
