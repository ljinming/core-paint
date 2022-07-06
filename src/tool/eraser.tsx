import { fabric } from "fabric";
import Tool, { getTransformedPos, getMousePosition, getMousePos } from "./tool";
import { rgbToHex } from "./colorChange";
//import "@/libs/eraser_brush.mixin.js"; // 本地地址进行引用即可

class Eraser extends Tool {
  private color: string;
  lineWidth: number;
  constructor() {
    super();
    this.color = "transparent";
    this.lineWidth = 2;
  }

  //改变画笔的状态
  static setEraserStyle(value: number) {
    this.canvas!.freeDrawingBrush.width = value;
  }

  private getPixelColorOnCanvas = (pointer): void => {
    const ctx = Tool.canvas.getContext();
    const p = ctx.getImageData(pointer.x, pointer.y, 1, 1).data;
    const color = rgbToHex(p[0], p[1], p[2], p[3]);
    this.color = color;
    Tool.canvas.freeDrawingBrush.color = color;
    if (!Tool.canvas.isDrawingMode) {
      Tool.canvas.isDrawingMode = true;
    }
    Tool.canvas.freeDrawingBrush.width = 30; // 设置画笔粗细为 10
  };

  public onMouseDown(options) {
    const { e, pointer } = options;
    const showPointer = getMousePos(e); //getTransformedPos(pointer);
    const zoomPoint = getTransformedPos(showPointer);
    const calcPoints = getMousePosition(e);
    Tool.canvas.freeDrawingBrush.color = "transparent";

    // // const showPoint = getTransformedPos(pointer);
    e.preventDefault();
    const show = {
      x: pointer.x * 2,
      y: pointer.y * 2,
    };
    this.getPixelColorOnCanvas(show);
  }
}

export default Eraser;
