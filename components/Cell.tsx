
import React from 'react';
import type { Personality, BufferPersonality } from '../types';
import { PersonalityType } from '../types';
import { PersonalityIcon } from './PersonalityIcon';

interface CellProps {
  personality: Personality;
  onClick: () => void;
}

const M = 15; // size of subcell in pixels
const SX = 4;
const SY = 3;

export const Cell: React.FC<CellProps> = ({ personality, onClick }) => {
  const isBuffer = personality.type === PersonalityType.Buffer;
  const bufferData = isBuffer ? (personality as BufferPersonality) : null;

  return (
    <div
      className="relative w-[75px] h-[75px] bg-gray-800 cursor-pointer hover:bg-gray-700 transition-colors duration-150"
      onClick={onClick}
    >
      <svg width="75" height="75" viewBox="0 0 75 75" className="absolute inset-0">
        {/* Main Cell Border */}
        <rect x="0.5" y="0.5" width="74" height="74" fill="none" stroke="rgba(75, 85, 99, 0.5)" strokeWidth="1" />

        <PersonalityIcon personality={personality} />

        {/* I/O Ports and Data Display - Not for Buffer or Empty */}
        {personality.type !== PersonalityType.Buffer && personality.type !== PersonalityType.Empty && (
          <>
            {/* Top Port */}
            <g>
              <rect x={3 * M} y={0} width={M} height={M} fill="none" stroke="#4a5568" strokeWidth="1" />
              {personality.tFull && (
                <text x={3 * M + SX + 3} y={M - SY} fontFamily="monospace" fontSize={M - 2} fill="#e2e8f0" textAnchor="middle">
                  {personality.tOutput ? '1' : '0'}
                </text>
              )}
            </g>

            {/* Bottom Port */}
            <g>
              <rect x={M} y={4 * M} width={M} height={M} fill="none" stroke="#4a5568" strokeWidth="1" />
              {personality.bFull && (
                <text x={M + SX + 3} y={5 * M - SY} fontFamily="monospace" fontSize={M - 2} fill="#e2e8f0" textAnchor="middle">
                  {personality.bOutput ? '1' : '0'}
                </text>
              )}
            </g>

            {/* Left Port */}
            <g>
              <rect x={0} y={M} width={M} height={M} fill="none" stroke="#4a5568" strokeWidth="1" />
              {personality.lFull && (
                <text x={SX + 3} y={2 * M - SY} fontFamily="monospace" fontSize={M - 2} fill="#e2e8f0" textAnchor="middle">
                  {personality.lOutput ? '1' : '0'}
                </text>
              )}
            </g>

            {/* Right Port */}
            <g>
              <rect x={4 * M} y={3 * M} width={M} height={M} fill="none" stroke="#4a5568" strokeWidth="1" />
              {personality.rFull && (
                <text x={4 * M + SX + 3} y={4 * M - SY} fontFamily="monospace" fontSize={M - 2} fill="#e2e8f0" textAnchor="middle">
                  {personality.rOutput ? '1' : '0'}
                </text>
              )}
            </g>
          </>
        )}

        {/* Buffer Specific Text */}
        {isBuffer && bufferData && (
          <>
            <text x={SX} y={2 * M - SY} className="text-xs fill-current text-cyan-300 truncate">
              in: {bufferData.inBuffer.slice(-6)}
            </text>
            <text x={SX} y={3 * M - SY} className="text-xs fill-current text-gray-400">
              Buffer
            </text>
            <text x={SX} y={4 * M - SY} className="text-xs fill-current text-green-300 truncate">
              out: {bufferData.outBuffer.slice(-6)}
            </text>
          </>
        )}
      </svg>
    </div>
  );
};
