import Tool, { getRandomColor, setStrawColor } from "./tool";
import cursorPen from "@/assets/icon/cursorPen.jpg";
import straw from "@/assets/icon/straw.jpg";
import { fabric } from "fabric";

class Pen extends Tool {
  static color: string = getRandomColor();
  static lineWidth: number = 20;
  //改变画笔的状态
  constructor() {
    super();
    this.init();
  }

  //fabric.BaseBrush.limitedToCanvasSize = true
  init() {
    console.log("pen init", Tool.strawColor);
    // 设置自由绘画模式画笔类型为 铅笔类型
    Tool.canvas.freeDrawingBrush = new fabric.PencilBrush(Tool.canvas);
    //  Tool.canvas.freeDrawingBrush["limitedToCanvasSize"] = true;
    // Tool.canvas.freeDrawingBrush = new fabric.BaseBrush();
    Tool.canvas.freeDrawingBrush.width = Pen.lineWidth;
    // Tool.canvas.BaseBrush.limitedToCanvasSize = Boolean;
    if (!Tool.canvas.isDrawingMode) {
      Tool.canvas.isDrawingMode = true;
    }
    Tool.canvas.freeDrawingBrush.color = Tool.strawColor || Pen.color;
    Tool.canvas.setCursor("default");
  }

  static setPenStyle(type: string, value: string | number) {
    Pen[type] = value;
  }

  onMouseDown = (options) => {
    const { e, pointer } = options;
    e.preventDefault();
    if (Tool.toolType === "PEN") {
      if (Tool.strawFlag) {
        const show = {
          x: pointer.x * 2,
          y: pointer.y * 2,
        };
        setStrawColor(show);
      } else {
        this.init();
      }
    }
  };
}

export default Pen;
