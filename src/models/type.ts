export interface PencilState {
  fontSize: number;
  color: string;
}

export interface ToolState {
  select: string;
}

export interface PaintState {
  pencil: PencilState;
  tool: ToolState;
}

export interface RootState {
  paint: PaintState;
}
