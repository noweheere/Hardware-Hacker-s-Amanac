
import React from 'react';
import { ChipIcon, GearIcon } from './Icons';

interface HeaderProps {
    onSettingsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSettingsClick }) => {
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm border-b border-cyan-400/20 p-4 sticky top-0 z-10">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
            <ChipIcon className="w-10 h-10 text-cyan-400" />
            <div>
              <h1 className="text-2xl font-bold text-cyan-400">Hardware Hacker's Almanac</h1>
              <p className="text-sm text-gray-400">Identify. Analyze. Hack.</p>
            </div>
        </div>
        <button
            onClick={onSettingsClick}
            className="p-2 text-gray-400 rounded-full hover:bg-gray-700 hover:text-cyan-300 transition-colors duration-200"
            aria-label="Einstellungen öffnen"
        >
            <GearIcon className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;