import Tool from "./tool";
import { fabric } from "fabric";

class Pen extends Tool {
  //改变画笔的状态
  static setPenStyle(type: string, value: string | number) {
    if (type === "lineWidth" && typeof value === "number") {
      Tool.canvas!.freeDrawingBrush.width = value;
    } else if (type === "color" && typeof value === "string") {
      Tool.canvas!.freeDrawingBrush.color = value;
    }
  }

  onMouseDown = (options) => {
    if (Tool.toolType === "PEN") {
      console.log("==er5,options", options);
      Tool.canvas.isDrawingMode = true;
      //Tool.canvas.freeDrawingBrush.limitedToCanvasSize = true;
      // const { e, pointer } = options;
      // new fabric.CircleBrush().drawDot(pointer);
    }
    //Tool.canvas!.freeDrawingBrush.width = value;
  };
}

export default Pen;
