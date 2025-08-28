
import React from 'react';
import { ChipIcon } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm border-b border-cyan-400/20 p-4 sticky top-0 z-10">
      <div className="container mx-auto flex items-center gap-4">
        <ChipIcon className="w-10 h-10 text-cyan-400" />
        <div>
          <h1 className="text-2xl font-bold text-cyan-400">Hardware Hacker's Almanac</h1>
          <p className="text-sm text-gray-400">Identify. Analyze. Hack.</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
