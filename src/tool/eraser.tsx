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
    this.color = rgbToHex(p[0], p[1], p[2], p[3]);
    //Tool.canvas.freeDrawingBrush = new fabric.EraserBrush(Tool.canvas); // 使用橡皮擦画笔
    Tool.canvas.freeDrawingBrush.width = 30; // 设置画笔粗细为 10
    Tool.canvas.freeDrawingBrush.color = this.color;
    // fabric.util.
  };

  createRraser = () => {
    // 设置自由绘画模式画笔类型为 铅笔类型
    // 设置自由绘画模式 画笔颜色与画笔线条大小
    Tool.canvas!.freeDrawingBrush.color = this.color;
    Tool.canvas!.freeDrawingBrush.width = this.lineWidth;
  };

  public onMouseDown(options) {
    const { e, pointer } = options;
    const showPointer = getMousePos(e); //getTransformedPos(pointer);
    const zoomPoint = getTransformedPos(showPointer);
    const calcPoints = getMousePosition(e);
    // // const showPoint = getTransformedPos(pointer);
    e.preventDefault();
    const show = {
      x: pointer.x * 2,
      y: pointer.y * 2,
    };
    this.getPixelColorOnCanvas(show);
  }
  onMouseMove(options) {
    // Tool.canvas!.freeDrawingBrush.color = this.color;
    // Tool.canvas!.freeDrawingBrush.width = this.lineWidth;
  }
  public onSelected(options): void {
    console.log("====567", options);
    //this.selected = true;
  }
}

export default Eraser;
