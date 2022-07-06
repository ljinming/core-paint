import Tool, {
  getTransformedPos,
  getMousePosition,
  getMousePos,
  getPixelColorOnCanvas,
} from "./tool";
//import "@/libs/eraser_brush.mixin.js"; // 本地地址进行引用即可

class Eraser extends Tool {
  color: string;
  constructor() {
    super();
    this.color = "transparent";
    this.init();
  }

  init() {
    Tool.canvas.freeDrawingBrush.color = this.color;
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
    this.color = color;
    Tool.canvas.freeDrawingBrush.color = color;
  };

  public onMouseDown(options) {
    if (Tool.toolType !== "ERASER") {
      return;
    }
    const { e, pointer } = options;
    e.preventDefault();
    //const showPointer = getMousePos(e); //getTransformedPos(pointer);
    // const zoomPoint = getTransformedPos(showPointer);
    // const calcPoints = getMousePosition(e);
    // // const showPoint = getTransformedPos(pointer);
    e.preventDefault();
    const show = {
      x: pointer.x * 2,
      y: pointer.y * 2,
    };
    this.operateStart(show);
  }
  public onMouseMove(options) {
    if (Tool.toolType !== "ERASER") {
      return;
    }
    const { e, pointer } = options;
    e.preventDefault();
    Tool.canvas.freeDrawingBrush.color = this.color;
  }
}

export default Eraser;
