
import { PersonalityType } from "./types";

export const PMAXX = 11;
export const PMAXY = 10;

export const PERSONALITY_NAMES: { [key in PersonalityType]: string } = {
  [PersonalityType.And]: "And",
  [PersonalityType.BitAdder]: "Bit Adder",
  [PersonalityType.Buffer]: "Buffer",
  [PersonalityType.Copy]: "Copy",
  [PersonalityType.Division]: "Division",
  [PersonalityType.DontKnow]: "Don't Know",
  [PersonalityType.Empty]: "Empty",
  [PersonalityType.LeftShift]: "Left Shift",
  [PersonalityType.LeftTurn]: "Left Turn",
  [PersonalityType.MultAdder]: "Mult Adder",
  [PersonalityType.Pass]: "Pass",
  [PersonalityType.RightShift]: "Right Shift",
  [PersonalityType.RightTurn]: "Right Turn",
  [PersonalityType.SortBottom]: "Sort Bottom",
  [PersonalityType.SortTop]: "Sort Top",
};

export const PERSONALITY_LIST = Object.values(PersonalityType).filter(v => typeof v === 'number') as PersonalityType[];
