import Tool, { getPixelColorOnCanvas } from "./tool";
//import "libs/eraser_brush.mixin.js"; // 本地地址进行引用即可

class Eraser extends Tool {
  color: string;
  constructor() {
    super();
    this.init();
  }

  init() {
    Tool.canvas.interactive = false;

    Tool.canvas.freeDrawingBrush.color = "transparent";
    // Tool.canvas.freeDrawingBrush = new fabric.EraserBrush(Tool.canvas); // 使用橡皮擦画笔
    Tool.canvas.isDrawingMode = true;
    Tool.canvas.freeDrawingBrush.width = 20; // 设置画笔粗细为 20
  }

  //改变画笔的粗细
  static setEraserStyle(value: number) {
    this.canvas!.freeDrawingBrush.width = value;
  }

  private operateStart = (pointer): void => {
    const ctx = Tool.canvas.getContext();
    const color = getPixelColorOnCanvas(pointer, ctx);
    Tool.canvas.freeDrawingBrush.color = color;
  };

  public onMouseDown(options) {
    if (Tool.toolType !== "ERASER") {
      return;
    }
    const { e, pointer, absolutePointer } = options;
    e.preventDefault();
    Tool.canvas.freeDrawingBrush.color = "transparent";
    const show = {
      x: absolutePointer.x * 2,
      y: absolutePointer.y * 2,
    };
    this.operateStart(show);
  }
}

export default Eraser;
