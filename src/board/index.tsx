import { fabric } from "fabric";
import "fabric/src/mixins/eraser_brush.mixin";
import { rgbToHex } from "./utils";
interface InitialProps {
  tool: string;
}

export class Board {
  tool: string;
  canvas: fabric.Canvas | null;
  isDrawingMode: boolean;
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
  mouseDown: boolean;
  selected: boolean;
  ctx: CanvasRenderingContext2D;
  eraserColor: string;
  textObject: any;
  fontSize: any;
  imgUrl: string;
  canvasCurren: HTMLCanvasElement;
  constructor(initial: InitialProps) {
    this.tool = initial.tool;
    this.canvas = null;
    this.isDrawingMode = true;
    //this.pencilColor = "#000";
    this.lineWidth = 5;
    this.shapeType = "LINE";
    this.shapeLine = "SOLID";
    this.strokeColor = "#000";
    this.stateArr = []; // 存储画布步骤
    this.stateIdx = 0; //记录画布index
    this.drawingObject = null; //记录绘画图形
    this.mouseDown = false;
    this.ctx = null;
    this.eraserColor = "#fff";
    this.selected = false; //记录绘画是否被选中
    this.fontSize = 10; // text fontsize
    this._offset = {
      left: 0,
      top: 0,
    };
    this.mouseFrom = {
      x: 0,
      y: 0,
    };
    this.mouseTo = {
      x: 0,
      y: 0,
    };
  }

  init(
    canvas: fabric.Canvas,
    canvasCurren: HTMLCanvasElement,
    imgUrl?: string
  ) {
    this.canvas = canvas;
    this._offset.left = canvasCurren.getBoundingClientRect().left;
    this._offset.top = canvasCurren.getBoundingClientRect().top;
    this.stateArr.push(JSON.stringify(this.canvas));
    this.canvasCurren = canvasCurren;
    this.imgUrl = imgUrl;
    this.stateIdx = 0;
    if (imgUrl) {
      fabric.Image.fromURL(
        imgUrl,
        (img) => {
          img.scale(0.5);
          img.selectable = false;
          this.canvas.add(img).renderAll();
        },
        { crossOrigin: "anonymous" }
      );
    }

    this.addEventListener();
    //this.canvas.overlayColor = backgroundColor;
  }

  setTool = (tool: string) => {
    if (tool !== "PEN") {
      this.canvas.isDrawingMode = false;
    }
    this.tool = tool;
  };

  addEventListener = () => {
    // 监听鼠标按下事件
    this.canvas.on("mouse:down", this.canvasMouseDown.bind(this));
    // 监听鼠标移动事件
    this.canvas.on("mouse:move", this.canvasMouseMove.bind(this));
    // 监听鼠标抬起事件
    this.canvas.on("mouse:up", this.canvasMouseUp.bind(this));
    // 监听绘画选中/取消⌚️
    this.canvas.on("selection:created", (options) => {
      this.selected = true;
    });
    this.canvas.on("selection:cleared", (options) => {
      this.selected = false;
    });
    this.canvas.on("mouse:wheel", this.canvasMouseWheel.bind(this));
  };

  canvasMouseWheel = (options) => {
    const delta = options.e.deltaY; // 滚轮，向上滚一下是 -100，向下滚一下是 100
    if (this.imgUrl) {
      let zoom = this.canvas.getZoom(); // 获取画布当前缩放值
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20; // 限制最大缩放级别
      if (zoom < 0.01) zoom = 0.01; // 限制最小缩放级别

      // 以鼠标所在位置为原点缩放
      this.canvas.zoomToPoint(
        {
          // 关键点
          x: options.e.offsetX,
          y: options.e.offsetY,
        },
        zoom // 传入修改后的缩放级别
      );
    }
  };

  canvasMouseUp = (options) => {
    const ev = options.e;
    //ev.preventDefault();
    console.log("up===4", options, this.tool);
    if (!this.selected && this.tool === "SHAPE") {
      // 记录当前鼠标移动终点坐标 (减去画布在 x y轴的偏移，因为画布左上角坐标不一定在浏览器的窗口左上角)
      this.mouseTo.x = options.pointer.x;
      this.mouseTo.y = options.pointer.y;
      this.mouseDown = false; //鼠标抬起
      this.showShape();
    }
  };

  canvasMouseMove = (options) => {
    const ev = options.e;
    //ev.preventDefault();
    //this.mouseDown = false;
    // console.log("move===4", options);
    // this.showShape();
  };

  canvasMouseDown = (options) => {
    // 记录当前鼠标的起点坐标 (减去画布在 x y轴的偏移，因为画布左上角坐标不一定在浏览器的窗口左上角)
    console.log("==5", options, options.e.clientX - this.canvas._offset.left);
    console.log("==3", this.canvas);

    this.mouseFrom.x = options.e.clientX - this.canvas._offset.left; //options.e.clientX - this._offset.left;
    this.mouseFrom.y = options.e.clientY - this._offset.top;
    this.mouseDown = true;
    this.showDwonRender();
  };

  showDwonRender = () => {
    switch (this.tool) {
      case "PEN":
        return this.showPen();
      case "TEXT":
        return this.drawText();
      case "ERASER":
        return this.getPixelColorOnCanvas();
    }
  };

  getPixelColorOnCanvas = (): void => {
    const ctx = this.canvas.getContext("2d");
    const x = this.getTransformedPosX(this.mouseFrom.x);
    const y = this.getTransformedPosY(this.mouseFrom.y);
    const p = ctx.getImageData(x, y, 5, 5).data;
    console.log("=p==5", x, y, this.mouseFrom.x, this.mouseFrom.y, p);
    this.eraserColor = rgbToHex(p[0], p[1], p[2], p[3]);
    console.log("==5", this.eraserColor);
    this.showBrush();
  };

  setIsDrawingMode(drawing: boolean) {
    this.isDrawingMode = drawing;
    this.canvas!.isDrawingMode = drawing;
  }

  setShape = (value: { shapeType?: string }) => {
    const { shapeType } = value;
    this.shapeType = shapeType || this.shapeType;
    // this.showShape();
  };

  setShowCanvas = (value: { color?: string; lineWidth?: number }) => {
    const { color, lineWidth } = value;
    this.strokeColor = color || this.strokeColor;
    this.lineWidth = lineWidth || this.lineWidth;
    this.showPen();
  };

  showPen() {
    console.log("==pen", this.canvas!.isDrawingMode);
    // 设置自由绘画模式画笔类型为 铅笔类型
    this.canvas!.freeDrawingBrush = new fabric.PencilBrush(this.canvas!);
    // 设置自由绘画模式 画笔颜色与画笔线条大小
    this.canvas!.freeDrawingBrush.color = this.strokeColor;
    this.canvas!.freeDrawingBrush.width = this.lineWidth;
  }

  showBrush() {
    this.canvas.isDrawingMode = true;
    // 自由绘画模式 画笔类型设置为 橡皮擦对象
    this.canvas.freeDrawingBrush = new fabric.EraserBrush(this.canvas);
    // 设置橡皮擦大小
    this.canvas.freeDrawingBrush.width = 35;
    // this.canvas.freeDrawingBrush.color = this.eraserColor;
  }

  showShape() {
    console.log("++++++==", this.shapeType);
    switch (this.shapeType) {
      case "RECT":
        // 创建一个矩形对象
        // 计算矩形长宽
        const left = this.getTransformedPosX(this.mouseFrom.x);
        const top = this.getTransformedPosY(this.mouseFrom.y);
        let width = this.mouseTo.x - this.mouseFrom.x;
        let height = this.mouseTo.y - this.mouseFrom.y;
        console.log("=rect==4", left, top, width, height);
        // 创建矩形 对象
        let Rect = new fabric.Rect({
          left: left,
          top: top,
          width: width,
          height: height,
          stroke: this.strokeColor,
          fill: "transparent",
          strokeWidth: 1,
        });
        // 绘制矩形
        this.startDrawingObject(Rect);
        break;
      case "LINE":
        let line = new fabric.Line(
          [
            this.getTransformedPosX(this.mouseFrom.x),
            this.getTransformedPosY(this.mouseFrom.y),
            this.getTransformedPosX(this.mouseTo.x),
            this.getTransformedPosY(this.mouseTo.y),
          ],
          {
            fill: this.strokeColor,
            stroke: this.strokeColor,
            strokeWidth: 1,
          }
        );
        this.startDrawingObject(line);
        break;
      case "CIRCLE":
        let left_circle = this.getTransformedPosX(this.mouseFrom.x);
        let top_circle = this.getTransformedPosY(this.mouseFrom.y);
        // // 计算圆形半径
        let radius =
          Math.sqrt(
            (this.getTransformedPosX(this.mouseTo.x) - left_circle) *
              (this.getTransformedPosY(this.mouseTo.x) - left_circle) +
              (this.getTransformedPosX(this.mouseTo.y) - top_circle) *
                (this.getTransformedPosY(this.mouseTo.y) - top_circle)
          ) / 2;
        // 创建 原型对象
        let canvasObject = new fabric.Circle({
          left: left_circle,
          top: top_circle,
          stroke: this.strokeColor,
          fill: "transparent",
          radius: radius,
          strokeWidth: 1,
        });
        this.startDrawingObject(canvasObject);
        break;
      case "TRIANGLE":
        let left_TRIANGLE = this.mouseFrom.x;
        let top_TRIANGLE = this.mouseFrom.y;
        let height_TRIANGLE = this.mouseTo.y - this.mouseFrom.y;
        let width_TRIANGLE = Math.sqrt(
          Math.pow(height_TRIANGLE, 2) + Math.pow(height_TRIANGLE / 2.0, 2)
        );
        let TRIANGLE = new fabric.Triangle({
          left: left_TRIANGLE,
          top: top_TRIANGLE,
          width: width_TRIANGLE,
          height: height_TRIANGLE,
          stroke: this.strokeColor,
          fill: "transparent",
          strokeWidth: 1,
        });
        this.startDrawingObject(TRIANGLE);

        break;
    }
  }

  drawText() {
    if (!this.textObject) {
      // 当前不存在绘制中的文本对象，鼠标第一次按下
      // 根据鼠标按下的起点坐标文本对象
      this.textObject = new fabric.Textbox("", {
        left: this.getTransformedPosX(this.mouseFrom.x),
        top: this.getTransformedPosY(this.mouseFrom.y),
        fontSize: this.fontSize,
        fill: this.strokeColor,
        hasControls: false,
        editable: true,
        width: 200,
        heigh: 50,
        backgroundColor: "#fff",
        selectable: false,
      });
      this.canvas.add(this.textObject);
      // 文本打开编辑模式
      this.textObject.enterEditing();
      // 文本编辑框获取焦点
      this.textObject.hiddenTextarea.focus();
    } else {
      // 鼠标第二次按下 将当前文本对象退出编辑模式
      this.textObject.exitEditing();
      this.textObject.set("backgroundColor", "rgba(0,0,0,0)");
      if (this.textObject.text == "") {
        this.canvas.remove(this.textObject);
      }
      this.canvas.renderAll();
      this.textObject = null;
      return;
    }
  }

  // 绘制图形
  startDrawingObject(canvasObject) {
    // 禁止用户选择当前正在绘制的图形
    canvasObject.selectable = true;
    // 如果当前图形已绘制，清除上一次绘制的图形
    // 将绘制对象添加到 canvas中
    this.canvas.add(canvasObject);
    // 保存当前绘制的图形
    // this.drawingObject = canvasObject;
  }

  // 因为画布会进行移动或缩放，所以鼠标在画布上的坐标需要进行相应的处理才是相对于画布的可用坐标
  getTransformedPosX(x) {
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
  tool: "PEN",
});
