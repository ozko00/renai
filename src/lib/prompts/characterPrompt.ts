import { AxisScores, RenAICode } from '@/types/diagnosis';
import { characterAnimals } from '@/data/types/characterAnimals';

const BASE_PROMPT =
  'an original cute 2D character, full body, front-facing 3/4 view, simple rounded silhouette, ' +
  'thick black outline, flat colors, pastel color palette, minimal face, ' +
  'small dot eyes, tiny mouth, lots of negative space, playful and charming design, ' +
  'friendly kid-safe vibe, clean vector illustration style, ' +
  'soft pastel solid background, square profile picture composition, ' +
  'no complex shading, no realistic texture, simple hands and limbs, ' +
  'slightly quirky accessories, cohesive character design, highly readable silhouette';

type Intensity = 'strong' | 'medium' | 'weak';

function intensity(score: number): Intensity {
  const abs = Math.abs(score);
  if (abs > 0.5) return 'strong';
  if (abs >= 0.2) return 'medium';
  return 'weak';
}

// LF: + = 主導 (lead) / - = 受容 (follow)
function poseClause(lf: number): string {
  const i = intensity(lf);
  if (lf >= 0) {
    if (i === 'strong') return 'prominently standing tall with a confident pose, slight lean forward';
    if (i === 'medium') return 'standing tall with a confident pose';
    return 'standing calmly with a relaxed posture';
  }
  if (i === 'strong') return 'cozy sitting pose, warmly leaning slightly to one side, welcoming and soft stance';
  if (i === 'medium') return 'sitting comfortably with a gentle leaning pose';
  return 'standing softly with a relaxed and open posture';
}

// PS: + = 情熱 (passion) / - = 安定 (stability)
function clothingClause(ps: number): string {
  const i = intensity(ps);
  if (ps >= 0) {
    if (i === 'strong') return 'wearing a bold stylish jacket and a long flowing scarf';
    if (i === 'medium') return 'wearing a stylish jacket and a cozy scarf';
    return 'with a hint of a light jacket';
  }
  if (i === 'strong') return 'wearing a soft chunky cardigan and a thick knit sweater';
  if (i === 'medium') return 'wearing a soft cardigan and a knit sweater';
  return 'with a hint of a soft cardigan';
}

// WA: + = 言葉 (words) / - = 行動 (action)
function expressionClause(wa: number): string {
  const i = intensity(wa);
  if (wa >= 0) {
    if (i === 'strong') return 'big bright open smile, mouth slightly open as if speaking excitedly';
    if (i === 'medium') return 'gentle warm smile, mouth slightly open as if about to speak';
    return 'soft small smile';
  }
  if (i === 'strong') return 'exaggerated playful wink, closed mouth, mischievous expression';
  if (i === 'medium') return 'cute wink with a closed-mouth expression';
  return 'calm thoughtful expression';
}

// IE: + = 自由 (independence) / - = 一途 (exclusive)
function accessoryClause(ie: number): string {
  const i = intensity(ie);
  if (ie >= 0) {
    if (i === 'strong') return 'holding a fluttering colorful ribbon and a tiny feather accessory';
    if (i === 'medium') return 'holding a small colorful ribbon or a tiny feather accessory';
    return 'with a tiny colorful ribbon barely visible';
  }
  if (i === 'strong') return 'holding a small heart and a sealed love letter close to the chest';
  if (i === 'medium') return 'holding a small heart or a sealed letter';
  return 'with a tiny heart symbol barely visible';
}

export function buildCharacterPrompt(
  code: RenAICode,
  axes: AxisScores
): string {
  const { animal, baseColor } = characterAnimals[code];
  const pose = poseClause(axes.LF);
  const clothing = clothingClause(axes.PS);
  const expression = expressionClause(axes.WA);
  const accessory = accessoryClause(axes.IE);

  return [
    `an original cute 2D ${animal} character,`,
    `${pose},`,
    `${clothing},`,
    `${expression},`,
    `${accessory},`,
    `main color scheme: pastel ${baseColor},`,
    BASE_PROMPT,
  ].join(' ');
}
