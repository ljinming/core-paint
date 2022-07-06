import { fabric } from "fabric";
import Action from "@/action";
import { rgbToHex } from "./colorChange";

export interface Point {
  x: number;
  y: number;
}

export interface Pencil {
  lineWidth: number;
  strokeColor: string;
}

// 随机color
export const getRandomColor = () => {
  return (
    "#" + ("00000" + ((Math.random() * 0x1000000) << 0).toString(16)).substr(-6)
  );
};

// strawColor

export const setStrawColor = (pos: Point) => {
  const ctx = Tool.canvas.getContext();
  const color = getPixelColorOnCanvas(pos, ctx);
  Tool.strawColor = color;
  Tool.strawFlag = false;
  Action.emit("paint.straw", { strawColor: color, strawFlag: false });
};
//鼠标点颜色
export const getPixelColorOnCanvas = (
  pos: Point,
  ctx: CanvasRenderingContext2D
) => {
  const p = ctx.getImageData(pos.x, pos.y, 1, 1).data;
  return rgbToHex(p[0], p[1], p[2], p[3]);
};

//缩放后鼠标坐标
export const getTransformedPos = (points: Point): Point => {
  let zoom = Number(Tool.canvas.getZoom());
  return {
    x: (points.x - Tool.canvas.viewportTransform[4]) / zoom,
    y: (points.y - Tool.canvas.viewportTransform[4]) / zoom,
  };
};

//当前鼠标坐标
export const getMousePos = (event: MouseEvent): Point => {
  return {
    x: event.clientX - Tool._offset.x,
    y: event.clientY - Tool._offset.y,
  };
};

export const getMousePosition = (event: MouseEvent): Point => {
  const scale = Tool.currentScale || 1;
  const rect = Tool.canvasCurrent.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) / scale,
    y: (event.clientY - rect.top) / scale,
  };
};

export default class Tool {
  //选择的工具
  public toolType: string = "PEN";

  // canvas
  public static canvas: fabric.Canvas;
  static currentScale: number = 1;
  static _offset: { x: any; y: any };
  static canvasCurrent: any;
  static toolType: string;
  static filters: fabric.IAllFilters;
  static img: fabric.Image;
  static transform: { translatex: number; translatey: number };
  static strawColor: string;
  static strawFlag: boolean;

  public onMouseDown(options): void {
    //
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
