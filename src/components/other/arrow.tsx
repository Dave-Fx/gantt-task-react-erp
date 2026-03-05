import React from "react";
import { BarTask } from "../../types/bar-task";

type ArrowProps = {
  taskFrom: BarTask;
  taskTo: BarTask;
  rowHeight: number;
  taskHeight: number;
  arrowIndent: number;
  rtl: boolean;
  useActual?: boolean;
  color?: string;
  strokeWidth?: number;
  dashArray?: string;
};
export const Arrow: React.FC<ArrowProps> = ({
  taskFrom,
  taskTo,
  rowHeight,
  taskHeight,
  arrowIndent,
  rtl,
  useActual = false,
  color,
  strokeWidth = 1.5,
  dashArray,
}) => {
  const resolvedColor = color || "currentColor";
  let path: string;
  let trianglePoints: string;
  if (useActual) {
    [path, trianglePoints] = drawActualPathAndTriangle(
      taskFrom,
      taskTo,
      rowHeight,
      taskHeight,
      arrowIndent,
      rtl
    );
  } else {
    if (rtl) {
      [path, trianglePoints] = drawPathAndTriangleRTL(
        taskFrom,
        taskTo,
        rowHeight,
        taskHeight,
        arrowIndent
      );
    } else {
      [path, trianglePoints] = drawPathAndTriangle(
        taskFrom,
        taskTo,
        rowHeight,
        taskHeight,
        arrowIndent
      );
    }
  }

  return (
    <g className="arrow">
      <path
        strokeWidth={strokeWidth}
        d={path}
        fill="none"
        stroke={resolvedColor}
        strokeDasharray={dashArray}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polygon points={trianglePoints} fill={resolvedColor} />
    </g>
  );
};

const resolveLanePoints = (
  taskFrom: BarTask,
  taskTo: BarTask,
  taskHeight: number,
  useActual: boolean,
  rtl: boolean
) => {
  const resolvePlanCenterY = (task: BarTask) => {
    if (!task.showActual) {
      return task.y + taskHeight / 2;
    }

    const laneGap = Math.max(2, Math.round(task.height * 0.08));
    const availableLaneHeight = Math.max(4, task.height - laneGap);
    const planHeight = Math.max(2, availableLaneHeight - task.actualHeight);
    return task.y + planHeight / 2;
  };

  if (rtl) {
    return {
      taskFromX: useActual
        ? taskFrom.actualX1 !== null
          ? taskFrom.actualX1
          : taskFrom.x1
        : taskFrom.x1,
      taskToX: useActual
        ? taskTo.actualX2 !== null
          ? taskTo.actualX2
          : taskTo.x2
        : taskTo.x2,
      taskFromY: useActual
        ? taskFrom.actualY + taskFrom.actualHeight / 2
        : resolvePlanCenterY(taskFrom),
      taskToY: useActual
        ? taskTo.actualY + taskTo.actualHeight / 2
        : resolvePlanCenterY(taskTo),
    };
  }

  return {
    taskFromX: useActual
      ? taskFrom.actualX2 !== null
        ? taskFrom.actualX2
        : taskFrom.x2
      : taskFrom.x2,
    taskToX: useActual
      ? taskTo.actualX1 !== null
        ? taskTo.actualX1
        : taskTo.x1
      : taskTo.x1,
    taskFromY: useActual
      ? taskFrom.actualY + taskFrom.actualHeight / 2
      : resolvePlanCenterY(taskFrom),
    taskToY: useActual
      ? taskTo.actualY + taskTo.actualHeight / 2
      : resolvePlanCenterY(taskTo),
  };
};

const drawPathAndTriangle = (
  taskFrom: BarTask,
  taskTo: BarTask,
  rowHeight: number,
  taskHeight: number,
  arrowIndent: number
) => {
  const points = resolveLanePoints(taskFrom, taskTo, taskHeight, false, false);
  const indexCompare = taskFrom.index > taskTo.index ? -1 : 1;
  const taskToY = points.taskToY;
  const taskFromY = points.taskFromY;
  const taskFromEndX = points.taskFromX;
  const taskToStartX = points.taskToX;
  const taskFromEndPosition = points.taskFromX + arrowIndent * 2;
  const taskFromHorizontalOffsetValue =
    taskFromEndPosition < taskToStartX ? "" : `H ${taskToStartX - arrowIndent}`;
  const taskToHorizontalOffsetValue =
    taskFromEndPosition > taskToStartX
      ? arrowIndent
      : taskToStartX - taskFromEndX - arrowIndent;

  const path = `M ${taskFromEndX} ${taskFromY} 
  h ${arrowIndent} 
  v ${(indexCompare * rowHeight) / 2} 
  ${taskFromHorizontalOffsetValue}
  V ${taskToY} 
  h ${taskToHorizontalOffsetValue}`;

  const trianglePoints = `${taskToStartX},${taskToY} 
  ${taskToStartX - 5},${taskToY - 5} 
  ${taskToStartX - 5},${taskToY + 5}`;
  return [path, trianglePoints];
};

const drawPathAndTriangleRTL = (
  taskFrom: BarTask,
  taskTo: BarTask,
  rowHeight: number,
  taskHeight: number,
  arrowIndent: number
) => {
  const points = resolveLanePoints(taskFrom, taskTo, taskHeight, false, true);
  const indexCompare = taskFrom.index > taskTo.index ? -1 : 1;
  const taskToY = points.taskToY;
  const taskFromY = points.taskFromY;
  const taskFromEndX = points.taskFromX;
  const taskToEndX = points.taskToX;
  const taskFromEndPosition = taskFromEndX - arrowIndent * 2;
  const taskFromHorizontalOffsetValue =
    taskFromEndPosition > taskToEndX ? "" : `H ${taskToEndX + arrowIndent}`;
  const taskToHorizontalOffsetValue =
    taskFromEndPosition < taskToEndX
      ? -arrowIndent
      : taskToEndX - taskFromEndX + arrowIndent;

  const path = `M ${taskFromEndX} ${taskFromY} 
  h ${-arrowIndent} 
  v ${(indexCompare * rowHeight) / 2} 
  ${taskFromHorizontalOffsetValue}
  V ${taskToY} 
  h ${taskToHorizontalOffsetValue}`;

  const trianglePoints = `${taskToEndX},${taskToY} 
  ${taskToEndX + 5},${taskToY + 5} 
  ${taskToEndX + 5},${taskToY - 5}`;
  return [path, trianglePoints];
};

const drawActualPathAndTriangle = (
  taskFrom: BarTask,
  taskTo: BarTask,
  rowHeight: number,
  taskHeight: number,
  arrowIndent: number,
  rtl: boolean
) => {
  const points = resolveLanePoints(taskFrom, taskTo, taskHeight, true, rtl);

  if (rtl) {
    const indexCompare = taskFrom.index > taskTo.index ? -1 : 1;
    const taskToY = points.taskToY;
    const taskFromY = points.taskFromY;
    const taskFromEndX = points.taskFromX;
    const taskToEndX = points.taskToX;
    const taskFromEndPosition = taskFromEndX - arrowIndent * 2;
    const taskFromHorizontalOffsetValue =
      taskFromEndPosition > taskToEndX ? "" : `H ${taskToEndX + arrowIndent}`;
    const taskToHorizontalOffsetValue =
      taskFromEndPosition < taskToEndX
        ? -arrowIndent
        : taskToEndX - taskFromEndX + arrowIndent;

    const path = `M ${taskFromEndX} ${taskFromY} 
    h ${-arrowIndent} 
    v ${(indexCompare * rowHeight) / 2} 
    ${taskFromHorizontalOffsetValue}
    V ${taskToY} 
    h ${taskToHorizontalOffsetValue}`;

    const trianglePoints = `${taskToEndX},${taskToY} 
    ${taskToEndX + 5},${taskToY + 5} 
    ${taskToEndX + 5},${taskToY - 5}`;
    return [path, trianglePoints];
  }

  const indexCompare = taskFrom.index > taskTo.index ? -1 : 1;
  const taskToY = points.taskToY;
  const taskFromY = points.taskFromY;
  const taskFromEndX = points.taskFromX;
  const taskToStartX = points.taskToX;
  const taskFromEndPosition = taskFromEndX + arrowIndent * 2;
  const taskFromHorizontalOffsetValue =
    taskFromEndPosition < taskToStartX ? "" : `H ${taskToStartX - arrowIndent}`;
  const taskToHorizontalOffsetValue =
    taskFromEndPosition > taskToStartX
      ? arrowIndent
      : taskToStartX - taskFromEndX - arrowIndent;

  const path = `M ${taskFromEndX} ${taskFromY} 
  h ${arrowIndent} 
  v ${(indexCompare * rowHeight) / 2} 
  ${taskFromHorizontalOffsetValue}
  V ${taskToY} 
  h ${taskToHorizontalOffsetValue}`;

  const trianglePoints = `${taskToStartX},${taskToY} 
  ${taskToStartX - 5},${taskToY - 5} 
  ${taskToStartX - 5},${taskToY + 5}`;
  return [path, trianglePoints];
};
