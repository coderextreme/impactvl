
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Grid } from './components/Grid';
import { Toolbar } from './components/Toolbar';
import type { Personality } from './types';
import { PersonalityType } from './types';
import { initializeGrid } from './services/gridService';
import { runSimulationStep } from './services/simulationService';

const App: React.FC = () => {
  const [grid, setGrid] = useState<Personality[][]>(() => initializeGrid('4x4'));
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedPersonality, setSelectedPersonality] = useState<PersonalityType>(PersonalityType.Empty);
  const [ink, setInk] = useState<string>('');
  
  const isRunningRef = useRef(isRunning);
  isRunningRef.current = isRunning;

  const step = useCallback(() => {
    setGrid(prevGrid => {
      const { newGrid, changed } = runSimulationStep(prevGrid);
      if (!changed && isRunningRef.current) {
        setIsRunning(false);
      }
      return newGrid;
    });
  }, []);

  useEffect(() => {
    if (isRunning) {
      const intervalId = setInterval(() => {
        step();
      }, 100);
      return () => clearInterval(intervalId);
    }
  }, [isRunning, step]);

  const handleCellClick = (x: number, y: number) => {
    const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
    const cell = newGrid[y][x];

    if (cell.type === PersonalityType.Buffer) {
        if (ink === '0' || ink === '1') {
            cell.inBuffer += ink;
        } else if (ink === 'backspace') {
            cell.inBuffer = cell.inBuffer.slice(0, -1);
        } else if (ink === 'replace') {
            const newPersonality = initializeGrid('empty', selectedPersonality)[0][0];
            newGrid[y][x] = { ...newPersonality };
        }
    } else {
        const newPersonality = initializeGrid('empty', selectedPersonality)[0][0];
        newGrid[y][x] = { ...newPersonality };
    }
    setGrid(newGrid);
  };
  
  const resetGrid = (type: '4x4' | 'division' | 'cell' | 'random') => {
    setIsRunning(false);
    setGrid(initializeGrid(type));
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 font-sans">
      <header className="bg-gray-800 p-4 shadow-lg flex items-center justify-between z-10">
        <h1 className="text-2xl font-bold text-cyan-400">ImpactVL Circuit Simulator</h1>
      </header>
      <Toolbar
        isRunning={isRunning}
        onRunPause={() => setIsRunning(!isRunning)}
        onStep={step}
        onReset={resetGrid}
        selectedPersonality={selectedPersonality}
        onSelectPersonality={setSelectedPersonality}
        ink={ink}
        onSetInk={setInk}
      />
      <main className="flex-grow p-4 overflow-auto">
        <Grid grid={grid} onCellClick={handleCellClick} />
      </main>
    </div>
  );
};

export default App;
