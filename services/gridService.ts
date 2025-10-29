
import { PMAXX, PMAXY } from '../constants';
import type { Personality, BufferPersonality, DivisionPersonality } from '../types';
import { PersonalityType } from '../types';

const createEmptyPersonality = (type: PersonalityType = PersonalityType.Empty): Personality => {
  const base: Personality = {
    type,
    tOutput: false, bOutput: false, lOutput: false, rOutput: false,
    tFull: false, bFull: false, lFull: false, rFull: false,
  };
  if (type === PersonalityType.Buffer) {
    (base as BufferPersonality).inBuffer = '';
    (base as BufferPersonality).outBuffer = '';
  }
  if (type === PersonalityType.Division) {
    const divState: Partial<DivisionPersonality> = {
        a: 0n, b: 0n, agather: true, bgather: true, aend: false, bend: false,
        aouting: false, preaout: false, aflag: false, bflag: false, flag: false,
        leftshifts: 0, sentaone: false,
    };
    Object.assign(base, divState);
  }
  return base;
};

export const initializeGrid = (type: '4x4' | 'division' | 'cell' | 'random' | 'empty', selectedP?: PersonalityType): Personality[][] => {
  if (type === 'empty' && selectedP !== undefined) {
      return [[createEmptyPersonality(selectedP)]];
  }

  const grid: Personality[][] = Array(PMAXY).fill(null).map(() => Array(PMAXX).fill(null).map(() => createEmptyPersonality()));

  // Setup borders
  for (let x = 1; x < PMAXX - 1; x++) {
    grid[0][x] = createEmptyPersonality(PersonalityType.Buffer);
    grid[PMAXY - 1][x] = createEmptyPersonality(PersonalityType.Buffer);
  }
  for (let y = 1; y < PMAXY - 1; y++) {
    grid[y][0] = createEmptyPersonality(PersonalityType.Buffer);
    grid[y][PMAXX - 1] = createEmptyPersonality(PersonalityType.Buffer);
  }

  const setCell = (x: number, y: number, p: PersonalityType) => {
    if (x >= 0 && x < PMAXX && y >= 0 && y < PMAXY) {
      grid[y][x] = createEmptyPersonality(p);
    }
  };

  if (type === '4x4') {
    // 4x4 bit multiplier
    setCell(1, 1, PersonalityType.DontKnow); setCell(2, 1, PersonalityType.RightTurn);
    setCell(3, 1, PersonalityType.DontKnow); setCell(4, 1, PersonalityType.RightTurn);
    setCell(5, 1, PersonalityType.DontKnow); setCell(6, 1, PersonalityType.RightTurn);
    setCell(7, 1, PersonalityType.DontKnow); setCell(8, 1, PersonalityType.RightTurn);
    setCell(9, 1, PersonalityType.RightTurn);

    for (let z = 2; z < 8; z += 2) {
      setCell(1, z, PersonalityType.Pass); setCell(2, z, PersonalityType.And);
      setCell(3, z, PersonalityType.Pass); setCell(4, z, PersonalityType.And);
      setCell(5, z, PersonalityType.Pass); setCell(6, z, PersonalityType.And);
      setCell(7, z, PersonalityType.Pass); setCell(8, z, PersonalityType.And);
      setCell(9, z, PersonalityType.Pass);

      setCell(1, z + 1, PersonalityType.LeftTurn); setCell(2, z + 1, PersonalityType.MultAdder);
      setCell(3, z + 1, PersonalityType.DontKnow); setCell(4, z + 1, PersonalityType.MultAdder);
      setCell(5, z + 1, PersonalityType.DontKnow); setCell(6, z + 1, PersonalityType.MultAdder);
      setCell(7, z + 1, PersonalityType.DontKnow); setCell(8, z + 1, PersonalityType.MultAdder);
      setCell(9, z + 1, PersonalityType.DontKnow);
    }
    setCell(1, 8, PersonalityType.Pass); setCell(2, 8, PersonalityType.And);
    setCell(3, 8, PersonalityType.Pass); setCell(4, 8, PersonalityType.And);
    setCell(5, 8, PersonalityType.Pass); setCell(6, 8, PersonalityType.And);
    setCell(7, 8, PersonalityType.Pass); setCell(8, 8, PersonalityType.And);
    setCell(9, 8, PersonalityType.Pass);
  } else if (type === 'division') {
      for(let y=1; y < PMAXY - 1; y++) {
          setCell(1, y, PersonalityType.Division);
      }
      (grid[0][1] as BufferPersonality).inBuffer = '11';
      (grid[PMAXY-1][1] as BufferPersonality).inBuffer = '10000001';
  } else if (type === 'cell') {
      setCell(1,1, PersonalityType.MultAdder);
  } else if (type === 'random') {
    for (let y = 1; y < PMAXY - 1; y++) {
      for (let x = 1; x < PMAXX - 1; x++) {
        const pTypes = [
            PersonalityType.RightTurn, PersonalityType.LeftTurn, PersonalityType.Pass,
            PersonalityType.LeftShift, PersonalityType.RightShift, PersonalityType.MultAdder,
            PersonalityType.And, PersonalityType.DontKnow
        ];
        setCell(x, y, pTypes[Math.floor(Math.random() * pTypes.length)]);
      }
    }
  }

  return grid;
};
