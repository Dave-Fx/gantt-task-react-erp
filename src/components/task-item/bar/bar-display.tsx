import React from "react";
import style from "./bar.module.css";

type BarDisplayProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  showActual: boolean;
  actualX1: number | null;
  actualX2: number | null;
  actualY: number;
  actualHeight: number;
  actualHasWindow: boolean;
  actualIsInProgress: boolean;
  isSelected: boolean;
  /* progress start point */
  progressX: number;
  progressWidth: number;
  barCornerRadius: number;
  styles: {
    backgroundColor: string;
    backgroundSelectedColor: string;
    progressColor: string;
    progressSelectedColor: string;
    actualColor?: string;
    actualSelectedColor?: string;
    actualInProgressColor?: string;
    actualInProgressSelectedColor?: string;
    actualStrokeColor?: string;
    actualSelectedStrokeColor?: string;
    actualInProgressStrokeColor?: string;
    actualInProgressSelectedStrokeColor?: string;
  };
  onMouseDown: (event: React.MouseEvent<SVGPolygonElement, MouseEvent>) => void;
};
export const BarDisplay: React.FC<BarDisplayProps> = ({
  x,
  y,
  width,
  height,
  showActual,
  actualX1,
  actualX2,
  actualY,
  actualHeight,
  actualHasWindow,
  actualIsInProgress,
  isSelected,
  progressX,
  progressWidth,
  barCornerRadius,
  styles,
  onMouseDown,
}) => {
  const getProcessColor = () => {
    return isSelected ? styles.progressSelectedColor : styles.progressColor;
  };

  const getBarColor = () => {
    return isSelected ? styles.backgroundSelectedColor : styles.backgroundColor;
  };

  const getActualColor = () => {
    if (actualIsInProgress) {
      return isSelected
        ? styles.actualInProgressSelectedColor || styles.actualSelectedColor || styles.progressSelectedColor
        : styles.actualInProgressColor || styles.actualColor || styles.progressColor;
    }

    return isSelected
      ? styles.actualSelectedColor || styles.progressSelectedColor
      : styles.actualColor || styles.progressColor;
  };

  const getActualStrokeColor = () => {
    if (actualIsInProgress) {
      return isSelected
        ? styles.actualInProgressSelectedStrokeColor ||
            styles.actualSelectedStrokeColor ||
            styles.actualInProgressSelectedColor ||
            styles.actualSelectedColor ||
            styles.progressSelectedColor
        : styles.actualInProgressStrokeColor ||
            styles.actualStrokeColor ||
            styles.actualInProgressColor ||
            styles.actualColor ||
            styles.progressColor;
    }

    return isSelected
      ? styles.actualSelectedStrokeColor ||
          styles.actualSelectedColor ||
          styles.progressSelectedColor
      : styles.actualStrokeColor || styles.actualColor || styles.progressColor;
  };

  const laneGap = showActual ? Math.max(2, Math.round(height * 0.08)) : 0;
  const availableLaneHeight = showActual ? Math.max(4, height - laneGap) : height;
  const planHeight = showActual
    ? Math.max(2, availableLaneHeight - actualHeight)
    : height;
  const planY = y;
  const laneY = showActual ? actualY : y;
  const laneX =
    showActual && actualHasWindow && actualX1 !== null ? actualX1 : null;
  const laneWidth =
    showActual && actualHasWindow && actualX1 !== null && actualX2 !== null
      ? Math.max(0, actualX2 - actualX1)
      : 0;
  const laneCornerRadius = Math.min(barCornerRadius, actualHeight / 2);
  const hasExecutionWindow =
    showActual && actualHasWindow && laneX !== null && laneWidth > 0;
  const executionLaneX = laneX ?? x;

  return (
    <g onMouseDown={onMouseDown}>
      <rect
        x={x}
        width={width}
        y={planY}
        height={planHeight}
        ry={barCornerRadius}
        rx={barCornerRadius}
        fill={getBarColor()}
        className={style.barBackground}
      />
      <rect
        x={progressX}
        width={progressWidth}
        y={planY}
        height={planHeight}
        ry={barCornerRadius}
        rx={barCornerRadius}
        fill={getProcessColor()}
      />
      {showActual && !hasExecutionWindow && (
        <rect
          x={x}
          width={width}
          y={laneY}
          height={actualHeight}
          ry={laneCornerRadius}
          rx={laneCornerRadius}
          fill={getActualColor()}
          stroke={getActualStrokeColor()}
          strokeWidth={0.9}
          pointerEvents="none"
        />
      )}
      {hasExecutionWindow && (
        <rect
          x={executionLaneX}
          width={laneWidth}
          y={laneY}
          height={actualHeight}
          ry={laneCornerRadius}
          rx={laneCornerRadius}
          fill={getActualColor()}
          stroke={getActualStrokeColor()}
          strokeWidth={0.9}
          pointerEvents="none"
        />
      )}
    </g>
  );
};
