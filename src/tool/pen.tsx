import Tool, { getRandomColor, setStrawColor } from "./tool";
import cursorPen from "@/assets/icon/cursorPen.jpg";
import straw from "@/assets/icon/straw.jpg";

class Pen extends Tool {
  static color: string = getRandomColor();
  static lineWidth: number = 20;
  //改变画笔的状态
  constructor() {
    super();
    this.init();
  }

  init() {
    console.log("pen init", Tool.strawColor);
    if (!Tool.canvas.isDrawingMode) {
      Tool.canvas.isDrawingMode = true;
    }
    Tool.canvas.freeDrawingBrush.color = Tool.strawColor || Pen.color;
    Tool.canvas.freeDrawingBrush.width = Pen.lineWidth;
    Tool.canvas.setCursor(`${cursorPen}`);
  }

  static setPenStyle(type: string, value: any) {
    Pen[type] = value;
    if (type === "lineWidth") {
      Tool.canvas.freeDrawingBrush.width = value;
    } else {
      Tool.canvas.freeDrawingBrush.color = value;
    }
  }

  public onMouseDown = (options) => {
    const { e, pointer, absolutePointer } = options;
    e.preventDefault();
    if (Tool.toolType === "PEN") {
      if (Tool.strawFlag) {
        const show = {
          x: absolutePointer.x * 2,
          y: absolutePointer.y * 2,
        };
        setStrawColor(show);
      } else {
        this.init();
      }
    }
  };
}

export default Pen;
