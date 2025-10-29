
import React from 'react';
import type { Personality } from '../types';
import { Cell } from './Cell';

interface GridProps {
  grid: Personality[][];
  onCellClick: (x: number, y: number) => void;
}

export const Grid: React.FC<GridProps> = ({ grid, onCellClick }) => {
  return (
    <div
      className="inline-block border-2 border-cyan-500 bg-gray-800 shadow-2xl"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${grid[0]?.length || 0}, 75px)`,
        gap: '0px',
      }}
    >
      {grid.map((row, y) =>
        row.map((cell, x) => (
          <Cell
            key={`${x}-${y}`}
            personality={cell}
            onClick={() => onCellClick(x, y)}
          />
        ))
      )}
    </div>
  );
};
