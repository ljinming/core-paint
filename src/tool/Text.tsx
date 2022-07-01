import { fabric } from "fabric-with-erasing";
import Tool from "./tool";

export class Text extends Tool {
  init() {
    const textbox = new fabric.Textbox("test", {
      left: 50,
      top: 50,
      width: 150,
      fontSize: 20,
    });

    Tool.canvas.add(textbox);
  }
}
