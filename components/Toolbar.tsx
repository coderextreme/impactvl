
import React from 'react';
import type { PersonalityType } from '../types';
import { PERSONALITY_LIST, PERSONALITY_NAMES } from '../constants';

interface ToolbarProps {
  isRunning: boolean;
  onRunPause: () => void;
  onStep: () => void;
  onReset: (type: '4x4' | 'division' | 'cell' | 'random') => void;
  selectedPersonality: PersonalityType;
  onSelectPersonality: (p: PersonalityType) => void;
  ink: string;
  onSetInk: (ink: string) => void;
}

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }> = ({ children, className, active, ...props }) => {
  const baseClasses = "px-4 py-2 text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors";
  const activeClasses = active ? "bg-cyan-500 text-white hover:bg-cyan-600" : "bg-gray-700 text-gray-300 hover:bg-gray-600";
  return (
    <button className={`${baseClasses} ${activeClasses} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const Toolbar: React.FC<ToolbarProps> = ({ isRunning, onRunPause, onStep, onReset, selectedPersonality, onSelectPersonality, ink, onSetInk }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-3 flex flex-wrap items-center gap-4 border-b border-gray-700 sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <Button onClick={onRunPause}>
          {isRunning ? 'Pause' : 'Run'}
        </Button>
        <Button onClick={onStep} disabled={isRunning}>
          Step
        </Button>
      </div>
       <div className="h-6 w-px bg-gray-600"></div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-400">Reset Grid:</span>
         <Button onClick={() => onReset('4x4')}>4x4 Multiply</Button>
         <Button onClick={() => onReset('division')}>Division</Button>
         <Button onClick={() => onReset('cell')}>Cell Test</Button>
         <Button onClick={() => onReset('random')}>Random</Button>
      </div>
       <div className="h-6 w-px bg-gray-600"></div>
       <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-400">Buffer Ink:</span>
        <Button active={ink === '0'} onClick={() => onSetInk('0')}>0</Button>
        <Button active={ink === '1'} onClick={() => onSetInk('1')}>1</Button>
        <Button active={ink === 'backspace'} onClick={() => onSetInk('backspace')}>Backspace</Button>
        <Button active={ink === 'replace'} onClick={() => onSetInk('replace')}>Replace Cell</Button>
      </div>
      <div className="h-6 w-px bg-gray-600"></div>
      <div className="flex items-center gap-2">
        <label htmlFor="personality-select" className="text-sm font-medium text-gray-400">Place Component:</label>
        <select
          id="personality-select"
          className="bg-gray-700 text-white rounded-md p-2 border border-gray-600 focus:ring-cyan-500 focus:border-cyan-500"
          value={selectedPersonality}
          onChange={(e) => onSelectPersonality(parseInt(e.target.value) as PersonalityType)}
        >
          {PERSONALITY_LIST.map(pType => (
            <option key={pType} value={pType}>{PERSONALITY_NAMES[pType]}</option>
          ))}
        </select>
      </div>
    </div>
  );
};
