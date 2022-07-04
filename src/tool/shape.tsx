import Tool, { getTransformedPos, getMousePos, getMousePosition } from "./tool";
import { fabric } from "fabric";
import { Point } from "./tool";

class Shape extends Tool {
  private shapeType: string;
  private shapeCurrent: any;
  private shapeColor: string;
  private selected: boolean;
  downPoints: Point;
  upPoints: Point;
  static shapeObject: Record<string, string> = {
    shapeType: "LINE",
    border: "SOLID",
    color: "#000",
  };
  constructor() {
    super();
    this.shapeType = "LINE";
    this.shapeCurrent = undefined;
    this.downPoints = undefined;
    this.upPoints = undefined;
    this.selected = false;
  }

  static changeShapeType(type: string, value: string) {
    this.shapeObject[type] = value;
  }

  createShape = (pointer) => {
    const { shapeType, border, color } = Shape.shapeObject;
    const options = {
      strokeDashArray: border === "SOLID" ? [0, 0] : [3, 3],
      stroke: color, // 笔触颜色
    };
    switch (shapeType) {
      case "LINE":
        this.shapeCurrent = new fabric.Line(
          [
            pointer.x,
            pointer.y, // 起始点坐标
            pointer.x,
            pointer.y, // 结束点坐标
          ],
          options
        );
        break;
      case "RECT":
        // 创建矩形
        // 矩形参数计算
        let top = Math.min(pointer.y, pointer.y);
        let left = Math.min(pointer.x, pointer.x);
        let width = Math.abs(pointer.x - pointer.x);
        let height = Math.abs(pointer.y - pointer.y);
        // 矩形对象
        this.shapeCurrent = new fabric.Rect({
          top,
          left,
          width,
          height,
          ...options,
          fill: "transparent",
          strokeWidth: 1,
        });
        break;
      case "CIRCLE":
        this.shapeCurrent = new fabric.Circle({
          top: pointer.y,
          left: pointer.x,
          radius: 0,
          fill: "transparent",
          ...options,
        });
        break;
      case "TRIANGLE":
        this.shapeCurrent = new fabric.Triangle({
          top: pointer.y,
          left: pointer.x,
          width: 0,
          height: 0,
          fill: "transparent",
          ...options,
        });
        break;
      case "RHOMBUS": //多边形
        this.shapeCurrent = new fabric.Polygon(
          [
            { x: pointer.x, y: pointer.y },
            { x: pointer.x, y: pointer.y },
          ],
          {
            fill: "transparent",
            objectCaching: false,
            ...options,
          }
        );
        break;
    }

    Tool.canvas.add(this.shapeCurrent);
  };

  changeShape = (pointer: Point) => {
    const { shapeType } = Shape.shapeObject;
    switch (shapeType) {
      case "LINE":
        if (this.shapeCurrent) {
          this.shapeCurrent.set("x2", pointer.x);
          this.shapeCurrent.set("y2", pointer.y);
        }
        break;
      case "RECT":
        if (this.shapeCurrent) {
          this.shapeCurrent.set(
            "width",
            Math.abs(this.downPoints.x - pointer.x)
          );
          this.shapeCurrent.set(
            "height",
            Math.abs(this.downPoints.y - pointer.y)
          );
        }
        break;
      case "CIRCLE":
        {
          const radius =
            Math.min(
              Math.abs(this.downPoints.x - pointer.x),
              Math.abs(this.downPoints.y - pointer.y)
            ) / 2;
          const top =
            pointer.y > this.downPoints.y
              ? this.downPoints.y
              : this.downPoints.y - radius * 2;
          const left =
            pointer.x > this.downPoints.x
              ? this.downPoints.x
              : this.downPoints.x - radius * 2;

          this.shapeCurrent.set("radius", radius);
          this.shapeCurrent.set("top", top);
          this.shapeCurrent.set("left", left);
        }
        break;
      case "TRIANGLE":
        {
          const width = Math.abs(this.downPoints.x - pointer.x);
          const height = Math.abs(this.downPoints.y - pointer.y);
          const top = Math.min(this.downPoints.y, pointer.y);
          const left = Math.min(this.downPoints.x, pointer.x);
          this.shapeCurrent.set("width", width);
          this.shapeCurrent.set("height", height);
          this.shapeCurrent.set("top", top);
          this.shapeCurrent.set("left", left);
        }
        break;
      case "RHOMBUS": //多边形
        let points = this.shapeCurrent.points;
        points.push({
          x: pointer.x,
          y: pointer.y,
        });
        break;
    }
    Tool.canvas.requestRenderAll();
  };

  // 多边形橡皮带
  changePolygonBelt(pointer: Point) {
    let points = this.shapeCurrent.points;
    points[points.length - 1].x = pointer.x;
    points[points.length - 1].y = pointer.y;
    Tool.canvas.requestRenderAll();
  }
  // 完成多边形绘制
  finishPolygon(pointer: Point) {
    const { shapeType, border, color } = Shape.shapeObject;
    const options = {
      strokeDashArray: border === "SOLID" ? [0, 0] : [3, 3],
      stroke: color, // 笔触颜色
    };
    let points = this.shapeCurrent.points;
    if (points[points.length - 1]) {
      points[points.length - 1].x = pointer.x;
      points[points.length - 1].y = pointer.y;
    }

    points.pop();
    points.pop();
    Tool.canvas.remove(this.shapeCurrent);
    if (points.length > 1) {
      let polygon = new fabric.Polygon(points, {
        fill: "transparent",
        ...options,
      });

      Tool.canvas.add(polygon);
    }

    this.shapeCurrent = null;
    Tool.canvas.requestRenderAll();
  }

  onMouseDown(options): void {
    console.log("=shape=options=345", options);

    if (Tool.canvas.isDrawingMode) {
      return;
    }
    const { e } = options;
    const { shapeType } = Shape.shapeObject;
    e.preventDefault();
    const showPointer = getMousePos(e); //getTransformedPos(pointer);
    const zoomPoint = getTransformedPos(showPointer);
    this.downPoints = zoomPoint; //鼠标按下的位置
    console.log("===456", Tool.canvas);
    console.log("==34", options);
    const calcPoints = getMousePosition(e);

    if (!this.selected) {
      if (shapeType === "RHOMBUS") {
        if (!this.shapeCurrent) {
          this.createShape(zoomPoint);
        } else {
          this.changeShape(zoomPoint);
        }
      } else if (!this.shapeCurrent) {
        this.createShape(calcPoints);
      }
    }
  }

  public onMouseMove(options): void {
    const { e } = options;
    const { shapeType } = Shape.shapeObject;
    const showPointer = getMousePos(e); //鼠标按下位置
    const zoomPoint = getTransformedPos(showPointer); //缩放后的位置
    e.preventDefault();
    const calcPoints = getMousePosition(e);

    if (this.shapeCurrent) {
      if (shapeType === "RHOMBUS") {
        this.changePolygonBelt(zoomPoint);
      } else {
        this.changeShape(calcPoints);
      }
    }
  }

  public onMouseUp(options): void {
    const { e } = options;
    const { shapeType } = Shape.shapeObject;
    e.preventDefault();
    const showPointer = getMousePos(e); //鼠标按下位置
    if (shapeType !== "RHOMBUS") {
      this.upPoints = showPointer;
      if (JSON.stringify(this.downPoints) === JSON.stringify(this.upPoints)) {
        Tool.canvas.remove(this.shapeCurrent);
      }
      this.shapeCurrent = undefined;
    }
  }

  public onDbClick(options): void {
    const { shapeType } = Shape.shapeObject;
    const { e, pointer } = options;
    const showPointer = getTransformedPos(pointer);
    e.preventDefault();
    if (shapeType === "RHOMBUS" && this.shapeCurrent) {
      this.finishPolygon(showPointer);
    }
  }

  public onSelected(options): void {
    this.selected = true;
  }
  public onCancelSelected(options): void {
    this.selected = false;
  }
}

export default Shape;
