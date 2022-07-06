import { fabric } from "fabric";
import Tool, { getMousePos, getTransformedPos, setStrawColor } from "./tool";

class CanvasText extends Tool {
  textObject: any;
  static textStyle: any;
  selected: boolean;
  constructor() {
    super();
    this.selected = false;
  }

  static changeTextStyle(type: any, value: any) {
    CanvasText.textStyle = { ...CanvasText.textStyle, [type]: value };
  }

  initText(points) {
    const newObj = {
      ...CanvasText.textStyle,
    };
    if (Tool.strawColor) {
      newObj.fill = Tool.strawColor;
    }
    this.textObject = new fabric.Textbox("", {
      left: points.x,
      top: points.y,
      width: 150,
      fontSize: 72,
      ...newObj,
      moveCursor: "pointer",
    });
    Tool.canvas.add(this.textObject);
    this.textObject.enterEditing();
  }

  onMouseDown = (options) => {
    if (Tool.toolType !== "TEXT") {
      return;
    }
    const { e, pointer } = options;
    e.preventDefault();
    if (Tool.strawFlag) {
      const show = {
        x: pointer.x * 2,
        y: pointer.y * 2,
      };
      setStrawColor(show);
      return;
    }
    const showPointer = getMousePos(e); //鼠标按下位置
    const zoomPoint = getTransformedPos(showPointer); //缩放后的位置
    if (!this.selected) {
      if (!this.textObject) {
        this.initText(zoomPoint);
      } else {
        this.textObject.exitEditing();
        this.textObject = null;
      }
    }
  };

  public onSelected(options): void {
    this.selected = true;
  }
  public onCancelSelected(options): void {
    this.selected = false;
  }
}

export default CanvasText;
