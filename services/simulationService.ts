
import type { Personality, BufferPersonality, DivisionPersonality } from '../types';
import { PersonalityType, Direction } from '../types';

const { TOP, LEFT, RIGHT, BOTTOM } = Direction;

// Helper to create a deep copy of the grid to prevent state mutation issues.
const deepCopyGrid = (grid: Personality[][]): Personality[][] => 
  grid.map(row => row.map(cell => {
    // Create a new object and copy properties
    const newCell = { ...cell };
    // If it's a division personality, ensure BigInts are handled correctly
    if (newCell.type === PersonalityType.Division) {
        const divCell = newCell as DivisionPersonality;
        divCell.a = BigInt(divCell.a);
        divCell.b = BigInt(divCell.b);
    }
    return newCell;
}));


const getNeighbor = (grid: Personality[][], x: number, y: number, dir: Direction): Personality | null => {
    const PMAXY = grid.length;
    const PMAXX = grid[0]?.length || 0;
    switch(dir) {
        case TOP: return y > 0 ? grid[y-1][x] : null;
        case BOTTOM: return y < PMAXY - 1 ? grid[y+1][x] : null;
        case LEFT: return x > 0 ? grid[y][x-1] : null;
        case RIGHT: return x < PMAXX - 1 ? grid[y][x+1] : null;
    }
    return null;
}

const getCellFull = (p: Personality, dir: Direction) => {
    switch(dir) {
        case TOP: return p.tFull;
        case BOTTOM: return p.bFull;
        case LEFT: return p.lFull;
        case RIGHT: return p.rFull;
    }
    return false;
}

const consumeOutput = (p: Personality, dir: Direction): { value: boolean, consumed: boolean } => {
    switch(dir) {
        case TOP: if (p.tFull) { p.tFull = false; return { value: p.tOutput, consumed: true }; } break;
        case BOTTOM: if (p.bFull) { p.bFull = false; return { value: p.bOutput, consumed: true }; } break;
        case LEFT: if (p.lFull) { p.lFull = false; return { value: p.lOutput, consumed: true }; } break;
        case RIGHT: if (p.rFull) { p.rFull = false; return { value: p.rOutput, consumed: true }; } break;
    }
    return { value: false, consumed: false };
}

const setOutputData = (p: Personality, dir: Direction, value: boolean) => {
    switch(dir) {
        case TOP: p.tFull = true; p.tOutput = value; break;
        case BOTTOM: p.bFull = true; p.bOutput = value; break;
        case LEFT: p.lFull = true; p.lOutput = value; break;
        case RIGHT: p.rFull = true; p.rOutput = value; break;
    }
}

// Main simulation step function
export const runSimulationStep = (currentGrid: Personality[][]): { newGrid: Personality[][], changed: boolean } => {
  let changed = false;
  const newGrid = deepCopyGrid(currentGrid);
  
  const PMAXY = newGrid.length;
  const PMAXX = newGrid[0].length;

  const performStep = (x: number, y: number) => {
    const p = newGrid[y][x];
    const originalP = currentGrid[y][x];

    // Helper for data transfer logic
    const transfer = (neighbor: Personality | null, fromDir: Direction, toDir: Direction) => {
        if (!neighbor) return false;
        if(getCellFull(neighbor, fromDir) && !getCellFull(originalP, toDir)) {
            const {value, consumed} = consumeOutput(neighbor, fromDir);
            if(consumed) {
                setOutputData(p, toDir, value);
                changed = true;
                return true;
            }
        }
        return false;
    }
    
    // Logic per personality
    switch (p.type) {
        case PersonalityType.And: {
            const rightN = getNeighbor(newGrid, x, y, RIGHT);
            const topN = getNeighbor(newGrid, x, y, TOP);
            if (rightN && topN && getCellFull(rightN, LEFT) && getCellFull(topN, BOTTOM) && !getCellFull(originalP, TOP) && !getCellFull(originalP, BOTTOM) && !getCellFull(originalP, LEFT)) {
                 const {value: inData1, consumed: c1} = consumeOutput(rightN, LEFT);
                 const {value: inData2, consumed: c2} = consumeOutput(topN, BOTTOM);
                 if (c1 && c2) {
                    setOutputData(p, TOP, inData1 && inData2);
                    changed = true;
                 }
            }
            break;
        }

        case PersonalityType.BitAdder:
        case PersonalityType.MultAdder: {
            const topN = getNeighbor(newGrid, x, y, TOP);
            const bottomN = getNeighbor(newGrid, x, y, BOTTOM);
            const rightN = getNeighbor(newGrid, x, y, RIGHT);
            
            const isBitAdder = p.type === PersonalityType.BitAdder;
            const leftN = isBitAdder ? null : getNeighbor(newGrid, x, y, LEFT); // MultAdder has left input

            if (p.type === PersonalityType.MultAdder) transfer(topN, BOTTOM, BOTTOM);

            const canFire = 
                (isBitAdder ? (topN && getCellFull(topN, BOTTOM)) : (leftN && getCellFull(leftN, RIGHT))) &&
                (bottomN && getCellFull(bottomN, TOP)) &&
                (rightN && getCellFull(rightN, LEFT)) &&
                !getCellFull(originalP, LEFT) &&
                !getCellFull(originalP, RIGHT);

            if(canFire) {
                const {value: v1, consumed: c1} = consumeOutput(isBitAdder ? topN! : leftN!, isBitAdder ? BOTTOM : RIGHT);
                const {value: v2, consumed: c2} = consumeOutput(bottomN!, TOP);
                const {value: v3, consumed: c3} = consumeOutput(rightN!, LEFT);
                
                if (c1 && c2 && c3) {
                    const sum = (v1?1:0) + (v2?1:0) + (v3?1:0);
                    setOutputData(p, LEFT, sum >= 2);
                    setOutputData(p, RIGHT, sum % 2 === 1);
                    changed = true;
                }
            }
            break;
        }

        case PersonalityType.Buffer: {
            const buffer = p as BufferPersonality;
            if (buffer.outBuffer.length > 0) {
                const bit = buffer.outBuffer[0] === '1';
                setOutputData(p, TOP, bit); setOutputData(p, BOTTOM, bit);
                setOutputData(p, LEFT, bit); setOutputData(p, RIGHT, bit);
                buffer.outBuffer = buffer.outBuffer.slice(1);
                changed = true;
            } else if (buffer.inBuffer.length > 0) {
                const bit = buffer.inBuffer[0] === '1';
                 setOutputData(p, TOP, bit); setOutputData(p, BOTTOM, bit);
                 setOutputData(p, LEFT, bit); setOutputData(p, RIGHT, bit);
                 buffer.inBuffer = buffer.inBuffer.slice(1);
                 changed = true;
            } else {
                 p.tFull = p.bFull = p.lFull = p.rFull = false;
            }
            break;
        }

        case PersonalityType.Pass: {
            transfer(getNeighbor(newGrid, x, y, RIGHT), LEFT, LEFT);
            transfer(getNeighbor(newGrid, x, y, LEFT), RIGHT, RIGHT);
            transfer(getNeighbor(newGrid, x, y, BOTTOM), TOP, TOP);
            transfer(getNeighbor(newGrid, x, y, TOP), BOTTOM, BOTTOM);
            break;
        }
        
        case PersonalityType.LeftTurn:
            transfer(getNeighbor(newGrid, x, y, BOTTOM), TOP, LEFT);
            transfer(getNeighbor(newGrid, x, y, TOP), BOTTOM, RIGHT);
            transfer(getNeighbor(newGrid, x, y, RIGHT), LEFT, BOTTOM);
            transfer(getNeighbor(newGrid, x, y, LEFT), RIGHT, TOP);
            break;
        
        case PersonalityType.RightTurn:
            transfer(getNeighbor(newGrid, x, y, TOP), BOTTOM, LEFT);
            transfer(getNeighbor(newGrid, x, y, BOTTOM), TOP, RIGHT);
            transfer(getNeighbor(newGrid, x, y, LEFT), RIGHT, BOTTOM);
            transfer(getNeighbor(newGrid, x, y, RIGHT), LEFT, TOP);
            break;
        
        case PersonalityType.LeftShift:
            transfer(getNeighbor(newGrid, x, y, TOP), BOTTOM, RIGHT);
            transfer(getNeighbor(newGrid, x, y, LEFT), RIGHT, BOTTOM);
            transfer(getNeighbor(newGrid, x, y, RIGHT), LEFT, TOP);
            transfer(getNeighbor(newGrid, x, y, BOTTOM), TOP, LEFT);
            break;
        
        case PersonalityType.RightShift:
            transfer(getNeighbor(newGrid, x, y, TOP), BOTTOM, LEFT);
            transfer(getNeighbor(newGrid, x, y, LEFT), RIGHT, TOP);
            transfer(getNeighbor(newGrid, x, y, RIGHT), LEFT, BOTTOM);
            transfer(getNeighbor(newGrid, x, y, BOTTOM), TOP, RIGHT);
            break;
    }
  };

  for (let phase = 0; phase < 2; phase++) {
      for (let y = 0; y < PMAXY; y++) {
          for (let x = 0; x < PMAXX; x++) {
              if ((x + y) % 2 === phase) {
                  performStep(x, y);
              }
          }
      }
  }

  return { newGrid, changed };
};
