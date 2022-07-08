import Tool, { setStrawColor } from "./tool";
import { parseColorString } from "./colorChange";
import { fabric } from "fabric";
class Bucket extends Tool {
  static color: string = "transparent";
  constructor() {
    super();
    this.init();
  }

  static changeColor = (color) => {
    this.color = color;
  };

  init() {
    Tool.canvas.isDrawingMode = false;
  }

  filterChange(pos) {
    const color = parseColorString(Tool.strawColor || Bucket.color);
    const filter = new fabric.Image.filters["ChangeColorFilter"]({
      pos,
      fillColor: [color.r, color.g, color.b],
    });
    Tool.img.filters.push(filter);
    Tool.img.applyFilters();
    Tool.canvas.renderAll();
  }

  public onMouseDown(options): void {
    if (Tool.toolType !== "BUCKET") {
      return;
    }
    const { e, pointer, absolutePointer } = options;
    e.preventDefault();
    if (Tool.strawFlag) {
      const show = {
        x: absolutePointer.x * 2,
        y: absolutePointer.y * 2,
      };
      setStrawColor(show);
      return;
    }
    this.filterChange(absolutePointer);
  }
}

export default Bucket;
