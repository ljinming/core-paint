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
    console.log("---3", ctx.getImageData(pointer.x, pointer.y, 1, 1));

    this.color = rgbToHex(p[0], p[1], p[2], p[3]);
    console.log(this.color);
    Tool.canvas.freeDrawingBrush.color = this.color;
  };

  createRraser = () => {
    // 设置自由绘画模式画笔类型为 铅笔类型
    // 设置自由绘画模式 画笔颜色与画笔线条大小
    Tool.canvas!.freeDrawingBrush.color = this.color;
    Tool.canvas!.freeDrawingBrush.width = this.lineWidth;
  };

  public onMouseDown(options) {
    console.log("=eraser=options=345", options);

    // Tool.canvas.freeDrawingBrush = new fabric.EraserBrush(Tool.canvas);
    // Tool.canvas!.freeDrawingBrush.width = 35;

    const { e, pointer } = options;
    const showPointer = getMousePos(e); //getTransformedPos(pointer);
    const zoomPoint = getTransformedPos(showPointer);
    // const calcPoints = getMousePosition(e);
    // // const showPoint = getTransformedPos(pointer);
    e.preventDefault();
    console.log("==2", zoomPoint);
    this.getPixelColorOnCanvas(zoomPoint);
  }
  onMouseMove(options) {
    // Tool.canvas!.freeDrawingBrush.color = this.color;
    // Tool.canvas!.freeDrawingBrush.width = this.lineWidth;
  }
}

export default Eraser;
