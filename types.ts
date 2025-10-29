
export enum PersonalityType {
  And,
  BitAdder,
  Buffer,
  Copy,
  Division,
  DontKnow,
  Empty,
  LeftShift,
  LeftTurn,
  MultAdder,
  Pass,
  RightShift,
  RightTurn,
  SortBottom,
  SortTop,
}

export enum Direction {
  TOP,
  LEFT,
  RIGHT,
  BOTTOM,
}

export interface BasePersonality {
  type: PersonalityType;
  tOutput: boolean;
  bOutput: boolean;
  lOutput: boolean;
  rOutput: boolean;
  tFull: boolean;
  bFull: boolean;
  lFull: boolean;
  rFull: boolean;
}

export interface BufferPersonality extends BasePersonality {
  type: PersonalityType.Buffer;
  inBuffer: string;
  outBuffer: string;
}

export interface DivisionPersonality extends BasePersonality {
    type: PersonalityType.Division;
    a: bigint;
    b: bigint;
    agather: boolean;
    bgather: boolean;
    aend: boolean;
    bend: boolean;
    aouting: boolean;
    preaout: boolean;
    aflag: boolean;
    bflag: boolean;
    flag: boolean;
    leftshifts: number;
    sentaone: boolean;
}

export type Personality = BasePersonality | BufferPersonality | DivisionPersonality;
