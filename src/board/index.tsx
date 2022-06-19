import { fabric } from "fabric";
import { threadId } from "worker_threads";

interface InitialProps {
  tool: string;
}

export class Board {
  tool: string;
  canvas: fabric.Canvas | null;
  isDrawingMode: boolean;
  // pencilColor: string | null;
  lineWidth: number;
  shapeType: string;
  shapeLine: string;
  mouseFrom: { x: number; y: number };
  mouseTo: { x: number; y: number };
  stateArr: any[];
  stateIdx: number;
  private _offset: any;
  strokeColor: string;
  drawingObject: any;
  constructor(initial: InitialProps) {
    this.tool = initial.tool;
    this.canvas = null;
    this.isDrawingMode = true;
    //this.pencilColor = "#000";
    this.lineWidth = 5;
    this.shapeType = "RECT";
    this.shapeLine = "SOLID";
    this.strokeColor = "#000";
    this.stateArr = []; // 存储画布步骤
    this.stateIdx = 0; //记录画布index
    this.drawingObject = null; //记录绘画图形
    this._offset = {
      left: 0,
      top: 0
    };
    this.mouseFrom = {
      x: 0,
      y: 0
    };
    this.mouseTo = {
      x: 0,
      y: 0
    };
  }

  init(canvas: fabric.Canvas, canvasCurren: HTMLCanvasElement) {
    this.canvas = canvas;

    this._offset.left = canvasCurren.getBoundingClientRect().left;
    this._offset.top = canvasCurren.getBoundingClientRect().top;
    console.log("=dd==", this._offset.left, this._offset.top);

    this.stateArr.push(JSON.stringify(this.canvas));
    this.stateIdx = 0;
    //this.canvas.overlayColor = backgroundColor;
  }

  setIsDrawingMode(drawing: boolean) {
    this.isDrawingMode = drawing;
    this.canvas!.isDrawingMode = drawing;
  }

  setShape = (value: { shapeType?: string }) => {
    const { shapeType } = value;
    this.shapeType = shapeType || this.shapeType;
    this.showShape();
  };

  setPencil = (value: { color?: string; lineWidth?: number }) => {
    const { color, lineWidth } = value;
    this.strokeColor = color || this.strokeColor;
    this.lineWidth = lineWidth || this.lineWidth;
    this.showPen();
  };

  showPen() {
    // 设置自由绘画模式画笔类型为 铅笔类型
    this.canvas!.freeDrawingBrush = new fabric.PencilBrush(this.canvas!);
    // 设置自由绘画模式 画笔颜色与画笔线条大小
    this.canvas!.freeDrawingBrush.color = this.strokeColor;
    this.canvas!.freeDrawingBrush.width = this.lineWidth;
  }

  showShape() {
    switch (this.shapeType) {
      case "RECT":
        // 创建一个矩形对象
        let rect = new fabric.Rect({
          left: 200, //距离左边的距离
          top: 200, //距离上边的距离
          fill: "green", //填充的颜色
          width: 200, //矩形宽度
          height: 200 //矩形高度
        });

        // 绘制矩形
        this.startDrawingObject(rect);
        break;
      case "LINE":
        let canvasObject = new fabric.Line([20, 20, 100, 100], {
          fill: "#000",
          stroke: "red",
          strokeWidth: 5
        });
        this.canvas.add(canvasObject);
        break;
    }
  }

  // 绘制图形
  startDrawingObject(canvasObject) {
    // 禁止用户选择当前正在绘制的图形
    canvasObject.selectable = false;
    // 如果当前图形已绘制，清除上一次绘制的图形
    if (this.drawingObject) {
      this.canvas.remove(this.drawingObject);
    }
    // 将绘制对象添加到 canvas中
    this.canvas.add(canvasObject);
    // 保存当前绘制的图形
    this.drawingObject = canvasObject;
  }
  // 因为画布会进行移动或缩放，所以鼠标在画布上的坐标需要进行相应的处理才是相对于画布的可用坐标
  getTransformedPosX(x) {
    console.log("=xx=4", x);
    let zoom = Number(this.canvas.getZoom());
    return (x - this.canvas.viewportTransform[4]) / zoom;
  }

  getTransformedPosY(y) {
    let zoom = Number(this.canvas.getZoom());
    return (y - this.canvas.viewportTransform[5]) / zoom;
  }

  // resetMove() {
  //   this.mouseFrom = {x:0,y:0};
  //   this.mouseTo = {};
  // },
}

export default new Board({
  tool: "PEN"
});
