
import React from 'react';
import type { Personality } from '../types';
import { PersonalityType } from '../types';

interface PersonalityIconProps {
  personality: Personality;
}

const M = 15; // 75px / 5
const SX = 4;
const SY = 3;

const Arrow: React.FC<{ x1: number, y1: number, x2: number, y2: number }> = ({ x1, y1, x2, y2 }) => {
  const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  return (
    <g stroke="#9ca3af" strokeWidth="1.5">
      <line x1={x1} y1={y1} x2={x2} y2={y2} />
      <path d={`M ${x2} ${y2} L ${x2 - 8 * Math.cos((angle - 20) * Math.PI / 180)} ${y2 - 8 * Math.sin((angle - 20) * Math.PI / 180)} M ${x2} ${y2} L ${x2 - 8 * Math.cos((angle + 20) * Math.PI / 180)} ${y2 - 8 * Math.sin((angle + 20) * Math.PI / 180)}`} />
    </g>
  );
};


export const PersonalityIcon: React.FC<PersonalityIconProps> = ({ personality }) => {
  const renderIcon = () => {
    switch (personality.type) {
      case PersonalityType.And:
        return (
          <>
            <circle cx="37.5" cy="37.5" r="12" fill="none" stroke="#67e8f9" strokeWidth="2"/>
            <text x="37.5" y="41.5" textAnchor="middle" fontSize="18" fill="#67e8f9">+</text>
          </>
        );
      case PersonalityType.BitAdder:
      case PersonalityType.MultAdder:
          return (
            <>
              <circle cx="37.5" cy="37.5" r="12" fill="none" stroke="#f472b6" strokeWidth="2"/>
              <text x="37.5" y="42.5" textAnchor="middle" fontSize="20" fill="#f472b6">Σ</text>
            </>
          )
      case PersonalityType.Copy:
          return (
             <text x="37.5" y="41.5" textAnchor="middle" fontSize="14" fill="#a78bfa">Copy</text>
          )
      case PersonalityType.Pass:
        return (
          <>
            <Arrow x1={M} y1={M+M/2} x2={5*M} y2={M+M/2} />
            <Arrow x1={4*M} y1={3*M+M/2} x2={0} y2={3*M+M/2} />
            <Arrow x1={3*M+M/2} y1={M} x2={3*M+M/2} y2={5*M} />
            <Arrow x1={M+M/2} y1={4*M} x2={M+M/2} y2={0} />
            <text x="37.5" y="41.5" textAnchor="middle" fontSize="14" fill="#a78bfa">Pass</text>
          </>
        );
      case PersonalityType.LeftTurn:
        return (
            <>
                <Arrow x1={M} y1={M+M/2} x2={3*M+M/2} y2={5*M} />
                <Arrow x1={3*M+M/2} y1={M} x2={0} y2={3*M+M/2} />
                <Arrow x1={4*M} y1={3*M+M/2} x2={M+M/2} y2={0} />
                <Arrow x1={M+M/2} y1={4*M} x2={5*M} y2={M+M/2} />
                <text x="37.5" y="41.5" textAnchor="middle" fontSize="12" fill="#a78bfa">L-Turn</text>
            </>
        )
      case PersonalityType.RightTurn:
        return (
            <>
                <Arrow x1={M} y1={M+M/2} x2={M+M/2} y2={0} />
                <Arrow x1={3*M+M/2} y1={M} x2={5*M} y2={M+M/2} />
                <Arrow x1={4*M} y1={3*M+M/2} x2={3*M+M/2} y2={5*M} />
                <Arrow x1={M+M/2} y1={4*M} x2={0} y2={3*M+M/2} />
                <text x="37.5" y="41.5" textAnchor="middle" fontSize="12" fill="#a78bfa">R-Turn</text>
            </>
        )
      case PersonalityType.LeftShift:
        return (
          <>
            <Arrow x1={M} y1={M+M/2} x2={3*M+M/2} y2={5*M} />
            <Arrow x1={3*M+M/2} y1={M} x2={5*M} y2={M+M/2} />
            <Arrow x1={4*M} y1={3*M+M/2} x2={M+M/2} y2={0} />
            <Arrow x1={M+M/2} y1={4*M} x2={0} y2={3*M+M/2} />
            <text x="37.5" y="41.5" textAnchor="middle" fontSize="12" fill="#a78bfa">L-Shift</text>
          </>
        );
      case PersonalityType.RightShift:
        return (
          <>
            <Arrow x1={M} y1={M+M/2} x2={M+M/2} y2={0} />
            <Arrow x1={3*M+M/2} y1={M} x2={0} y2={3*M+M/2} />
            <Arrow x1={4*M} y1={3*M+M/2} x2={3*M+M/2} y2={5*M} />
            <Arrow x1={M+M/2} y1={4*M} x2={5*M} y2={M+M/2} />
            <text x="37.5" y="41.5" textAnchor="middle" fontSize="12" fill="#a78bfa">R-Shift</text>
          </>
        );
       case PersonalityType.DontKnow:
        return <text x="37.5" y="41.5" textAnchor="middle" fontSize="12" fill="#fca5a5">?</text>;
       case PersonalityType.Division:
        return <text x="37.5" y="41.5" textAnchor="middle" fontSize="14" fill="#34d399">÷</text>;
       case PersonalityType.SortBottom:
        return <text x="37.5" y="41.5" textAnchor="middle" fontSize="12" fill="#fcd34d">Sort↓</text>;
       case PersonalityType.SortTop:
        return <text x="37.5" y="41.5" textAnchor="middle" fontSize="12" fill="#fcd34d">Sort↑</text>;
      default:
        return null;
    }
  };

  return <>{renderIcon()}</>;
};
