'use client';

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { LoveStyleScores } from '@/types/diagnosis';
import { loveStyleTypeInfo } from '@/data/types/loveStyleTypes';

interface LoveStyleRadarChartProps {
  scores: LoveStyleScores;
}

export default function LoveStyleRadarChart({ scores }: LoveStyleRadarChartProps) {
  const data = [
    { style: '情熱型', value: scores.eros, fullMark: 20 },
    { style: '遊戯型', value: scores.ludus, fullMark: 20 },
    { style: '友愛型', value: scores.storge, fullMark: 20 },
    { style: '実用型', value: scores.pragma, fullMark: 20 },
    { style: '熱狂型', value: scores.mania, fullMark: 20 },
    { style: '博愛型', value: scores.agape, fullMark: 20 },
  ];

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis
            dataKey="style"
            tick={{ fontSize: 12, fill: '#374151' }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 20]}
            tick={{ fontSize: 10 }}
          />
          <Radar
            name="スコア"
            dataKey="value"
            stroke="#f43f5e"
            fill="#f43f5e"
            fillOpacity={0.5}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
