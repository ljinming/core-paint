import Tool from "./tool";
import { fabric } from "fabric";
import { Point } from "./tool";

class Shape extends Tool {
  private shapeType: string;
  private shapeCurrent: any;
  private shapeColor: string;
  downPoints: Point;
  upPoints: Point;
  constructor() {
    super();
    this.shapeType = "LINE";
    this.shapeCurrent = undefined;
    this.downPoints = undefined;
    this.upPoints = undefined;
  }

  createShape = (points) => {
    switch (this.shapeType) {
      case "LINE":
        this.shapeCurrent = new fabric.Line(
          [
            points.x,
            points.y, // 起始点坐标
            points.x,
            points.y, // 结束点坐标
          ],
          {
            stroke: "#000", // 笔触颜色
          }
        );
        break;
    }
    Tool.canvas.add(this.shapeCurrent);
  };

  changeShape = (points: Point) => {
    switch (this.shapeType) {
      case "LINE":
        if (this.shapeCurrent) {
          console.log("==546", this.shapeCurrent.x2);

          //   this.shapeCurrent.x2 = points.x;
          //   this.shapeCurrent.y2 = points.y;
          this.shapeCurrent.set({ x2: points.x, y2: points.y });
          this.shapeCurrent.setCoords();
          //this.shapeCurrent.set({ x2: points.x, y2: points.y });
        }
        //
        break;
    }
    Tool.canvas.requestRenderAll();
  };

  public onMouseDown(options): void {
    console.log("--shape-45", options);
    const { e, pointer } = options;
    e.preventDefault();
    this.downPoints = pointer;
    if (!this.shapeCurrent) {
      this.createShape(pointer);
    }
  }

  public onMouseMove(options): void {
    const { e, points } = options;
    if (this.shapeCurrent) {
      this.changeShape(points);
    }
  }

  public onMouseUp(options): void {
    const { e, points } = options;
    e.preventDefault();
    this.upPoints = points;
    if (JSON.stringify(this.downPoints) === JSON.stringify(this.upPoints)) {
      Tool.canvas.remove(this.shapeCurrent);
    } else {
      this.shapeCurrent.set("stroke", "#000");
    }
    this.shapeCurrent = undefined;
  }
}

export default Shape;
