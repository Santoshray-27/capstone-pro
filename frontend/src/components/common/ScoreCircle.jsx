/**
 * ScoreCircle - Animated circular progress indicator for ATS scores
 */
import React from 'react';

const ScoreCircle = ({ score = 0, size = 120, strokeWidth = 10 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (score) => {
    if (score >= 80) return '#22c55e';       // Green - Excellent
    if (score >= 65) return '#3b82f6';       // Blue - Good
    if (score >= 45) return '#f59e0b';       // Amber - Average
    return '#ef4444';                         // Red - Poor
  };

  const getLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 65) return 'Good';
    if (score >= 45) return 'Average';
    return 'Needs Work';
  };

  const color = getColor(score);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1.5s ease-in-out' }}
          />
        </svg>
        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold" style={{ color }}>
            {score}
          </span>
          <span className="text-xs text-gray-400 font-medium">/100</span>
        </div>
      </div>
      <span className="text-sm font-semibold" style={{ color }}>
        {getLabel(score)}
      </span>
    </div>
  );
};

export default ScoreCircle;
