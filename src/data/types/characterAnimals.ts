import { RenAICode } from '@/types/diagnosis';

export interface AnimalCharacter {
  animal: string;
  animalJa: string;
  baseColor: string;
}

export const characterAnimals: Record<RenAICode, AnimalCharacter> = {
  LPWI: { animal: 'lion',         animalJa: 'ライオン',     baseColor: 'golden yellow' },
  LPWE: { animal: 'red fox',      animalJa: 'キツネ',       baseColor: 'warm orange' },
  LPAI: { animal: 'cheetah',      animalJa: 'チーター',     baseColor: 'pale yellow with soft spots' },
  LPAE: { animal: 'bear',         animalJa: 'クマ',         baseColor: 'warm brown' },
  LSWI: { animal: 'deer',         animalJa: 'シカ',         baseColor: 'soft beige' },
  LSWE: { animal: 'owl',          animalJa: 'フクロウ',     baseColor: 'lavender grey' },
  LSAI: { animal: 'rabbit',       animalJa: 'ウサギ',       baseColor: 'mint green' },
  LSAE: { animal: 'tortoise',     animalJa: 'カメ',         baseColor: 'sage green' },
  FPWI: { animal: 'white cat',    animalJa: '白ネコ',       baseColor: 'soft cream white' },
  FPWE: { animal: 'hamster',      animalJa: 'ハムスター',   baseColor: 'peachy pink' },
  FPAI: { animal: 'striped cat',  animalJa: 'トラネコ',     baseColor: 'warm beige' },
  FPAE: { animal: 'hedgehog',     animalJa: 'ハリネズミ',   baseColor: 'dusty rose' },
  FSWI: { animal: 'alpaca',       animalJa: 'アルパカ',     baseColor: 'soft cloud white' },
  FSWE: { animal: 'rabbit',       animalJa: '青いウサギ',   baseColor: 'periwinkle blue' },
  FSAI: { animal: 'sparrow',      animalJa: 'スズメ',       baseColor: 'warm tan' },
  FSAE: { animal: 'duck',         animalJa: 'アヒル',       baseColor: 'soft teal' },
};
