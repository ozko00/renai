'use client';

import { AttachmentScores, AttachmentType } from '@/types/diagnosis';
import { attachmentTypeInfo } from '@/data/types/attachmentTypes';
import { attachmentScoreToPercent } from '@/lib/utils/scoring';

interface AttachmentScoreBarProps {
  scores: AttachmentScores;
  primaryType: AttachmentType;
}

export default function AttachmentScoreBar({
  scores,
  primaryType,
}: AttachmentScoreBarProps) {
  const types: AttachmentType[] = ['secure', 'preoccupied', 'dismissive', 'fearful'];

  return (
    <div className="space-y-4">
      {types.map((type) => {
        const info = attachmentTypeInfo[type];
        const percent = attachmentScoreToPercent(scores[type]);
        const isPrimary = type === primaryType;

        return (
          <div key={type} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className={isPrimary ? 'font-semibold text-gray-900' : 'text-gray-600'}>
                {info.name}
                {isPrimary && (
                  <span className="ml-2 text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                    メイン
                  </span>
                )}
              </span>
              <span className="text-gray-500">{scores[type]}/25</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${percent}%`,
                  backgroundColor: isPrimary ? info.color : '#9ca3af',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
