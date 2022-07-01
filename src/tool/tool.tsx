import { fabric } from "fabric";

export interface Point {
  x: number;
  y: number;
}

export interface Pencil {
  lineWidth: number;
  strokeColor: string;
}

export const getTransformedPos = (points: Point): Point => {
  let zoom = Number(Tool.canvas.getZoom());
  return {
    x: (points.x - Tool.canvas.viewportTransform[4]) / zoom,
    y: (points.y - Tool.canvas.viewportTransform[4]) / zoom,
  };
};

export default class Tool {
  //选择的工具
  private toolType: string = "PEN";

  // canvas
  public static canvas: fabric.Canvas;

  // pen 相关数据
  public static PENTool: Pencil = {
    lineWidth: 1,
    strokeColor: "#000",
  };

  static setTool(
    toolType: string,
    value: Record<string, string | number>
  ): void {
    Tool[toolType] = { ...Tool[toolType], ...value };
  }

  public onMouseDown(event: MouseEvent): void {
    //
    console.log("e43", event);
  }
  public onMouseMove(event: MouseEvent): void {
    //
  }

  public onMouseUp(event: MouseEvent): void {
    //
  }

  public onSelected(event: MouseEvent): void {}

  public onCancelSelected(event: MouseEvent): void {}

  //双击
  public onDbClick(event: MouseEvent): void {}

  public onTouchStart(event: TouchEvent): void {
    //
  }

  public onTouchMove(event: TouchEvent): void {
    //
  }

  public onTouchEnd(event: TouchEvent): void {
    //
  }

  public onKeyDown(event: KeyboardEvent): void {
    //
  }
}
