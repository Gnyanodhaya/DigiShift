import React from 'react';
import { PillarScore, MaturityPillarId } from '../types/advisor';

interface RadarChartProps {
  pillarScores: PillarScore[];
  projectedScores?: { pillarId: MaturityPillarId; score: number }[];
  showProjected?: boolean;
  showBaseline?: boolean;
  showBenchmark?: boolean;
  size?: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  pillarScores,
  projectedScores,
  showProjected = false,
  showBaseline = true,
  showBenchmark = true,
  size = 270,
}) => {
  const isCompact = size <= 310;
  const center = size / 2;
  const labelMargin = isCompact ? 36 : 52;
  const radius = Math.max(30, (size / 2) - labelMargin);
  const totalAxes = pillarScores.length;

  const getCoordinates = (value: number, index: number, max = 100) => {
    const angle = (Math.PI * 2 / totalAxes) * index - Math.PI / 2;
    const distance = (Math.min(100, Math.max(0, value)) / max) * radius;
    const x = center + distance * Math.cos(angle);
    const y = center + distance * Math.sin(angle);
    return { x, y, angle };
  };

  // Baseline Points
  const baselinePoints = pillarScores
    .map((p, i) => {
      const { x, y } = getCoordinates(p.score, i);
      return `${x},${y}`;
    })
    .join(' ');

  // Projected Points
  const projectedPoints = projectedScores && projectedScores.length > 0
    ? pillarScores
        .map((p, i) => {
          const match = projectedScores.find((proj) => proj.pillarId === p.pillarId);
          const score = match ? match.score : p.score;
          const { x, y } = getCoordinates(score, i);
          return `${x},${y}`;
        })
        .join(' ')
    : '';

  // Benchmark Points
  const benchmarkPoints = pillarScores
    .map((p, i) => {
      const { x, y } = getCoordinates(p.peerBenchmark, i);
      return `${x},${y}`;
    })
    .join(' ');

  const rings = [20, 40, 60, 80, 100];

  const shortNames: Record<string, string> = {
    customer_sales: 'Customer & Sales',
    operations_supply: 'Ops & Supply Chain',
    financials_admin: 'Finance & Invoicing',
    workforce_collab: 'Workforce & Collab',
    data_security: 'Data & Security',
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width={size} height={size} className="overflow-visible select-none">
          {/* Background grid concentric polygon rings */}
          {rings.map((ringValue) => {
            const ringPoints = Array.from({ length: totalAxes })
              .map((_, i) => {
                const { x, y } = getCoordinates(ringValue, i);
                return `${x},${y}`;
              })
              .join(' ');

            return (
              <g key={ringValue}>
                <polygon
                  points={ringPoints}
                  fill="none"
                  className="stroke-slate-200 dark:stroke-slate-800"
                  strokeWidth="1"
                  strokeDasharray={ringValue === 100 ? undefined : '2 2'}
                />
                <text
                  x={center + 4}
                  y={center - (ringValue / 100) * radius + 10}
                  className="text-[9px] font-mono fill-slate-400 dark:fill-slate-500 select-none"
                >
                  {ringValue}%
                </text>
              </g>
            );
          })}

          {/* Spokes */}
          {pillarScores.map((_, i) => {
            const { x, y } = getCoordinates(100, i);
            return (
              <line
                key={`spoke-${i}`}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                className="stroke-slate-200 dark:stroke-slate-800"
                strokeWidth="1"
              />
            );
          })}

          {/* 1. Industry Benchmark Polygon */}
          {showBenchmark && (
            <polygon
              points={benchmarkPoints}
              fill="rgba(148, 163, 184, 0.08)"
              className="stroke-slate-400 dark:stroke-slate-500"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
          )}

          {/* 2. Projected Maturity Polygon (if enabled) */}
          {showProjected && projectedPoints && (
            <>
              <polygon
                points={projectedPoints}
                fill="rgba(16, 185, 129, 0.22)"
                stroke="#059669"
                strokeWidth="2.5"
                strokeDasharray={showBaseline ? '4 2' : undefined}
              />
              {pillarScores.map((p, i) => {
                const match = projectedScores?.find((proj) => proj.pillarId === p.pillarId);
                const score = match ? match.score : p.score;
                const { x, y } = getCoordinates(score, i);
                return (
                  <circle
                    key={`proj-pt-${p.pillarId}`}
                    cx={x}
                    cy={y}
                    r="4"
                    className="fill-emerald-600 stroke-white dark:stroke-slate-900 stroke-2 shadow"
                  />
                );
              })}
            </>
          )}

          {/* 3. SME Baseline Polygon */}
          {showBaseline && (
            <>
              <polygon
                points={baselinePoints}
                fill={showProjected ? 'rgba(79, 70, 229, 0.14)' : 'rgba(79, 70, 229, 0.22)'}
                stroke="#4F46E5"
                strokeWidth="2.5"
              />
              {pillarScores.map((p, i) => {
                const { x, y } = getCoordinates(p.score, i);
                return (
                  <circle
                    key={`base-pt-${p.pillarId}`}
                    cx={x}
                    cy={y}
                    r="4"
                    className="fill-indigo-600 stroke-white dark:stroke-slate-900 stroke-2 shadow"
                  />
                );
              })}
            </>
          )}

          {/* Axis Labels & Values */}
          {pillarScores.map((p, i) => {
            const angle = (Math.PI * 2 / totalAxes) * i - Math.PI / 2;
            const labelDistance = radius + (isCompact ? 15 : 24);
            const lx = center + labelDistance * Math.cos(angle);
            const ly = center + labelDistance * Math.sin(angle);

            let textAnchor: 'middle' | 'start' | 'end' = 'middle';
            if (Math.cos(angle) > 0.3) textAnchor = 'start';
            else if (Math.cos(angle) < -0.3) textAnchor = 'end';

            const projScore = projectedScores?.find((proj) => proj.pillarId === p.pillarId)?.score;
            const hasDelta = showProjected && projScore !== undefined;

            return (
              <g key={`label-${p.pillarId}`}>
                <text
                  x={lx}
                  y={ly - (isCompact ? 2 : 4)}
                  textAnchor={textAnchor}
                  className="text-[10px] sm:text-[11px] font-semibold fill-slate-800 dark:fill-slate-200"
                >
                  {shortNames[p.pillarId] || p.name}
                </text>
                <text
                  x={lx}
                  y={ly + (isCompact ? 8 : 10)}
                  textAnchor={textAnchor}
                  className="text-[9px] sm:text-[10px] font-mono tabular-nums"
                >
                  {hasDelta ? (
                    <>
                      <tspan className="fill-indigo-600 dark:fill-indigo-400 font-bold">{p.score}</tspan>
                      <tspan className="fill-slate-400 dark:fill-slate-500"> → </tspan>
                      <tspan className="fill-emerald-600 dark:fill-emerald-400 font-bold">{projScore}</tspan>
                      <tspan className="fill-emerald-600 dark:fill-emerald-400 text-[8px] font-bold"> (+{projScore - p.score})</tspan>
                    </>
                  ) : (
                    <>
                      <tspan className="fill-indigo-600 dark:fill-indigo-400 font-bold">{p.score}/100</tspan>
                      <tspan className="fill-slate-500 dark:fill-slate-400 font-normal"> ({p.peerBenchmark})</tspan>
                    </>
                  )}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend with Interactive Toggle Clues */}
      <div className="flex items-center gap-3 flex-wrap justify-center mt-2 text-[11px]">
        {showBaseline && (
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-indigo-600 shrink-0" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">Current Baseline</span>
          </div>
        )}
        {showProjected && (
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-emerald-600 shrink-0" />
            <span className="font-semibold text-emerald-800 dark:text-emerald-300">Projected Post-Roadmap</span>
          </div>
        )}
        {showBenchmark && (
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-t-2 border-dashed border-slate-400 dark:border-slate-500 shrink-0" />
            <span className="text-slate-500 dark:text-slate-400">Peer Median</span>
          </div>
        )}
      </div>
    </div>
  );
};
