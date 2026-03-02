import { Task, TaskType } from "./public-types";

export interface BarTask extends Task {
  index: number;
  typeInternal: TaskTypeInternal;
  x1: number;
  x2: number;
  y: number;
  height: number;
  actualX1: number | null;
  actualX2: number | null;
  actualY: number;
  actualHeight: number;
  actualHasWindow: boolean;
  actualIsInProgress: boolean;
  showActual: boolean;
  progressX: number;
  progressWidth: number;
  barCornerRadius: number;
  handleWidth: number;
  barChildren: BarTask[];
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
    actualArrowColor?: string;
    actualArrowFallbackColor?: string;
    actualArrowDashArray?: string;
  };
}

export type TaskTypeInternal = TaskType | "smalltask";
