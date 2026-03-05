import React, { ReactChild } from "react";
import { Task } from "../../types/public-types";
import { addToDate } from "../../helpers/date-helper";
import styles from "./grid.module.css";

export type GridBodyProps = {
  tasks: Task[];
  dates: Date[];
  svgWidth: number;
  rowHeight: number;
  columnWidth: number;
  todayColor: string;
  rtl: boolean;
};
export const GridBody: React.FC<GridBodyProps> = ({
  tasks,
  dates,
  rowHeight,
  svgWidth,
  columnWidth,
  todayColor,
  rtl,
}) => {
  let y = 0;
  const gridRows: ReactChild[] = [];
  const rowLines: ReactChild[] = [
    <line
      key="RowLineFirst"
      x="0"
      y1={0}
      x2={svgWidth}
      y2={0}
      className={styles.gridRowLine}
    />,
  ];
  for (const task of tasks) {
    gridRows.push(
      <rect
        key={"Row" + task.id}
        x="0"
        y={y}
        width={svgWidth}
        height={rowHeight}
        className={styles.gridRow}
      />
    );
    rowLines.push(
      <line
        key={"RowLine" + task.id}
        x="0"
        y1={y + rowHeight}
        x2={svgWidth}
        y2={y + rowHeight}
        className={styles.gridRowLine}
      />
    );
    y += rowHeight;
  }

  const now = new Date();
  let tickX = 0;
  const ticks: ReactChild[] = [];
  const weekendRects: ReactChild[] = [];
  let todayHighlight: ReactChild = <rect />;
  let todayLineX: number | null = null;
  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];
    ticks.push(
      <line
        key={date.getTime()}
        x1={tickX}
        y1={0}
        x2={tickX}
        y2={y}
        className={styles.gridTick}
      />
    );

    // Weekend shading
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      weekendRects.push(
        <rect
          key={`weekend-${date.getTime()}`}
          x={tickX}
          y={0}
          width={columnWidth}
          height={y}
          fill="rgba(148, 163, 184, 0.08)"
          pointerEvents="none"
        />
      );
    }

    if (
      (i + 1 !== dates.length &&
        date.getTime() < now.getTime() &&
        dates[i + 1].getTime() >= now.getTime()) ||
      // if current date is last
      (i !== 0 &&
        i + 1 === dates.length &&
        date.getTime() < now.getTime() &&
        addToDate(
          date,
          date.getTime() - dates[i - 1].getTime(),
          "millisecond"
        ).getTime() >= now.getTime())
    ) {
      todayHighlight = (
        <rect
          x={tickX}
          y={0}
          width={columnWidth}
          height={y}
          fill={todayColor}
        />
      );
      // Calculate exact position within the column for the today line
      const nextDate = i + 1 < dates.length ? dates[i + 1] : addToDate(date, date.getTime() - dates[Math.max(0, i - 1)].getTime(), "millisecond");
      const totalMs = nextDate.getTime() - date.getTime();
      const elapsedMs = now.getTime() - date.getTime();
      const fraction = totalMs > 0 ? Math.max(0, Math.min(1, elapsedMs / totalMs)) : 0;
      todayLineX = tickX + fraction * columnWidth;
    }
    // rtl for today
    if (
      rtl &&
      i + 1 !== dates.length &&
      date.getTime() >= now.getTime() &&
      dates[i + 1].getTime() < now.getTime()
    ) {
      todayHighlight = (
        <rect
          x={tickX + columnWidth}
          y={0}
          width={columnWidth}
          height={y}
          fill={todayColor}
        />
      );
      todayLineX = tickX + columnWidth;
    }
    tickX += columnWidth;
  }
  return (
    <g className="gridBody">
      <g className="rows">{gridRows}</g>
      <g className="weekends">{weekendRects}</g>
      <g className="rowLines">{rowLines}</g>
      <g className="ticks">{ticks}</g>
      <g className="today">{todayHighlight}</g>
      {todayLineX !== null && (
        <g className="todayLine">
          <line
            x1={todayLineX}
            y1={0}
            x2={todayLineX}
            y2={y}
            stroke="#ef4444"
            strokeWidth={2}
            strokeDasharray="none"
            pointerEvents="none"
          />
          <polygon
            points={`${todayLineX - 5},0 ${todayLineX + 5},0 ${todayLineX},7`}
            fill="#ef4444"
            pointerEvents="none"
          />
        </g>
      )}
    </g>
  );
};
