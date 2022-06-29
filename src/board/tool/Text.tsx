import fabric from "fabric/fabric-impl";
import Tool from "./index";

export class Text extends Tool {
  init() {
    const textbox = new fabric.Textbox("test", {
      left: 50,
      top: 50,
      width: 150,
      fontSize: 20,
    });

    this.canvas.add(textbox);
  }
}
