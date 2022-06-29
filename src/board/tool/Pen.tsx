import { fabric } from "fabric";
import Tool from "./index";

class Pen extends Tool {
  private lineWidth: 10;
  private strokeColor: "#000";
  setPen(type: string, value: number) {
    this[type] = value;
  }

  init() {
    console.log("--4", this.canvas);
    // 设置自由绘画模式画笔类型为 铅笔类型
    this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
    // 设置自由绘画模式 画笔颜色与画笔线条大小
    //  Tool.canvas.freeDrawingBrush.color = this.strokeColor;
    //  Tool.canvas.freeDrawingBrush.width = this.lineWidth;
  }

  onMouseDown(event: MouseEvent): void {
    //event.preventDefault();
    console.log("===pen.onMouseDown", this.canvas, event);
    //  const mousePos = getMousePos(Tool.ctx.canvas, event);

    // if (clacArea(mousePos)) {
    //   this.operateStart(mousePos);
    // }
  }
}

export default Pen;

// export const downClick = (event: MouseEvent) => {
//   console.log("==35", event);
// };
