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
    Tool.canvas.freeDrawingBrush.width = Pen.lineWidth;

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
