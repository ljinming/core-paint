import Tool from "./tool";

class Pen extends Tool {
  //改变画笔的状态
  static setPenStyle(type: string, value: string | number) {
    if (type === "lineWidth" && typeof value === "number") {
      Tool.canvas!.freeDrawingBrush.width = value;
    } else if (type === "color" && typeof value === "string") {
      Tool.canvas!.freeDrawingBrush.color = value;
    }
  }

  // onMouseMove = () => {
  //   if (Tool.canvas && !Tool.canvas.isDrawingMode) {
  //     Tool.canvas.isDrawingMode = true;
  //   }
  // };
}

export default Pen;
