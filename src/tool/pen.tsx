import Tool from "./tool";
import { fabric } from "fabric";
import { Point } from "fabric/fabric-impl";

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
      const { e, pointer } = options;

      console.log("==er5,options", options);
      // Tool.canvas._setObjectScale(
      //   localMouse: pointer,
      //   transform:Tool.transform,
      // );
      Tool.canvas.isDrawingMode = true;
      //Tool.canvas.freeDrawingBrush.limitedToCanvasSize = true;
      // const { e, pointer } = options;
      // new fabric.CircleBrush().drawDot(pointer);
    }

    //Tool.canvas!.freeDrawingBrush.width = value;
  };
  onMouseUp = (options) => {
    console.log("==4", options);
  };
}

export default Pen;
