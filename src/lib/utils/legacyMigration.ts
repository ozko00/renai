import {
  DiagnosisResult,
  KoigokoroCode,
  LegacyAttachmentType,
  LegacyDiagnosisResult,
  LegacyLoveStyleType,
} from '@/types/diagnosis';
import { koigokoroTypes } from '@/data/types/koigokoroTypes';

// 旧 attachment × lovestyle → 16 タイプの決定論的マッピング
// 戦略:
//  - secure   = 主導(L) 寄り、安定(S)
//  - preoccupied = 受容(F) 寄り、情熱(P)
//  - dismissive  = 主導(L) 寄り、安定(S)、自由(I)
//  - fearful     = 受容(F) 寄り、情熱(P) または 安定(S)、一途(E)
//  - eros/mania → 情熱(P), agape/storge/pragma → 安定(S)
//  - ludus → 言葉(W) 軽い + 自由(I)
//  - storge/pragma → 行動(A)、一途(E) 寄り
//  - eros/agape → 言葉(W)
//  - mania → 一途(E) で熱狂、agape → 一途(E) で献身
const LEGACY_MAP: Record<
  LegacyAttachmentType,
  Record<LegacyLoveStyleType, KoigokoroCode>
> = {
  secure: {
    eros: 'LPWI',
    ludus: 'LSWI',
    storge: 'LSWE',
    pragma: 'LSAE',
    mania: 'LPWE',
    agape: 'LSWE',
  },
  preoccupied: {
    eros: 'FPWE',
    ludus: 'FPWI',
    storge: 'FSWE',
    pragma: 'FSAE',
    mania: 'FPAE',
    agape: 'FPWE',
  },
  dismissive: {
    eros: 'LPAI',
    ludus: 'LPWI',
    storge: 'LSAI',
    pragma: 'LSAI',
    mania: 'LPAI',
    agape: 'LSWI',
  },
  fearful: {
    eros: 'FPAE',
    ludus: 'FPAI',
    storge: 'FSAI',
    pragma: 'FSAE',
    mania: 'FPAE',
    agape: 'FSAE',
  },
};

function pickPrimaryAttachment(
  legacy: LegacyDiagnosisResult
): LegacyAttachmentType | null {
  const primary = legacy.analysis?.attachmentAnalysis?.primaryType;
  if (primary) return primary;

  const scores = legacy.scores?.attachment;
  if (!scores) return null;
  const entries = Object.entries(scores) as [LegacyAttachmentType, number][];
  if (entries.length === 0) return null;
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0][0];
}

function pickPrimaryLoveStyle(
  legacy: LegacyDiagnosisResult
): LegacyLoveStyleType | null {
  const primary = legacy.analysis?.loveStyleAnalysis?.primaryType;
  if (primary) return primary;

  const scores = legacy.scores?.loveStyle;
  if (!scores) return null;
  const entries = Object.entries(scores) as [LegacyLoveStyleType, number][];
  if (entries.length === 0) return null;
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0][0];
}

export function isLegacyResult(value: unknown): value is LegacyDiagnosisResult {
  if (!value || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;
  // 新スキーマには code フィールド + version=2 がある
  if ('code' in obj && 'version' in obj) return false;
  return 'scores' in obj || 'analysis' in obj;
}

export function migrateLegacyResult(
  legacy: LegacyDiagnosisResult
): DiagnosisResult | null {
  const attachment = pickPrimaryAttachment(legacy);
  const loveStyle = pickPrimaryLoveStyle(legacy);
  if (!attachment || !loveStyle) return null;

  const code = LEGACY_MAP[attachment][loveStyle];
  const type = koigokoroTypes[code];

  // 軸スコアは決定論的に推定 (各軸 ±0.6 程度の弱信号)
  const sign = (letter: string, positive: string): number =>
    letter === positive ? 0.6 : -0.6;

  return {
    version: 2,
    code,
    name: type.name,
    emoji: type.emoji,
    axes: {
      LF: sign(code[0], 'L'),
      PS: sign(code[1], 'P'),
      WA: sign(code[2], 'W'),
      IE: sign(code[3], 'I'),
    },
    summary: type.desc,
    advice: [
      'まずは新しい24問の診断を受け直すと、より正確なタイプ分析が得られます。',
      'この結果は旧スキーマからの自動変換です。',
    ],
  };
}
