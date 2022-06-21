import { fabric } from "fabric";
import "fabric/src/mixins/eraser_brush.mixin";
import { efficentFloodFill, rgbToHex } from "./utils";
import Color from "color";

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
  imgUrl: string;
  canvasDom: HTMLCanvasElement;
  textStyle: {
    letterSpacing?: number | string;
  };
  fillColor: string;
  points: {
    x: number;
    y: number;
  };
  recordTimer: any;
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
    this.eraserColor = "transparent";
    this.selected = false; //记录绘画是否被选中
    this.textStyle = {};
    this.fillColor = "";
    this._offset = {
      left: 0,
      top: 0
    };
    this.mouseFrom = {
      x: 0,
      y: 0
    };
    this.points = {
      x: 0,
      y: 0
    };
    this.mouseTo = {
      x: 0,
      y: 0
    };
  }

  init(canvas: fabric.Canvas, canvasDom: HTMLCanvasElement, imgUrl?: string, other?: any) {
    this.canvas = canvas;
    this._offset.left = canvasDom.getBoundingClientRect().left;
    this._offset.top = canvasDom.getBoundingClientRect().top;
    this.stateArr.push(JSON.stringify(this.canvas));
    this.canvasDom = canvasDom;
    this.imgUrl = imgUrl;
    this.stateIdx = 0;
    if (imgUrl) {
      const { showScale = 1 } = other;
      fabric.Image.fromURL(
        imgUrl,
        (img) => {
          img.scale(showScale);
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
    if (this.canvas) {
      if (tool !== "PEN") {
        this.canvas.isDrawingMode = false;
      }
      this.tool = tool;
    }
  };

  setTextStyle = (type: string, value: string | number) => {
    this.textStyle = { ...this.textStyle, [type]: value };
  };

  addEventListener = () => {
    // 监听鼠标按下事件
    this.canvas.on("mouse:down", this.canvasMouseDown.bind(this));

    // 监听鼠标抬起事件
    this.canvas.on("mouse:up", this.canvasMouseUp.bind(this));
    // 监听绘画选中/取消⌚️
    this.canvas.on("selection:created", (options) => {
      this.selected = true;
    });
    this.canvas.on("selection:cleared", (options) => {
      this.selected = false;
    });
    this.canvas.on("mouse:wheel", this.canvasMouseWheel);
    this.canvas.on("after:render", this.canvasAfterRender.bind(this));
  };

  canvasAfterRender = (options) => {
    // 画布更新 保存 //频繁触发 隔一秒保存一次
    if (this.recordTimer) {
      clearTimeout(this.recordTimer);
      this.recordTimer = null;
    }
    this.recordTimer = setTimeout(() => {
      this.stateArr.push(JSON.stringify(this.canvas));
      this.stateIdx++;
    }, 1000);
  };

  canvasMouseWheel = (options) => {
    const delta = options.e.deltaY; // 滚轮，向上滚一下是 -100，向下滚一下是 100
    options.e.preventDefault();
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
          y: options.e.offsetY
        },
        zoom // 传入修改后的缩放级别
      );
    }
  };

  canvasMouseUp = (options) => {
    const ev = options.e;
    //ev.preventDefault();
    if (!this.selected && this.tool === "SHAPE") {
      // 记录当前鼠标移动终点坐标 (减去画布在 x y轴的偏移，因为画布左上角坐标不一定在浏览器的窗口左上角)
      this.mouseTo.x = options.pointer.x;
      this.mouseTo.y = options.pointer.y;
      this.mouseDown = false; //鼠标抬起
      this.showShape();
    }

    //鼠标抬起 处理事情
    //    this.textObject = null;
  };

  canvasMouseDown = (options) => {
    // 记录当前鼠标的起点坐标 (减去画布在 x y轴的偏移，因为画布左上角坐标不一定在浏览器的窗口左上角)
    this.mouseFrom.x = options.e.clientX - this._offset.left; //options.e.clientX - this._offset.left;
    this.mouseFrom.y = options.e.clientY - this._offset.top;
    this.points.x = options.pointer.x;
    this.points.y = options.pointer.y;
    this.mouseDown = true;
    this.showDwonRender();
  };

  // 撤销 或 还原
  tapHistoryBtn(flag) {
    let stateIdx = this.stateIdx + flag;
    // 判断是否已经到了第一步操作
    if (stateIdx < 0) return;
    // 判断是否已经到了最后一步操作
    if (stateIdx >= this.stateArr.length) return;
    if (this.stateArr[stateIdx]) {
      this.canvas.loadFromJSON(this.stateArr[stateIdx], () => {});
      if (this.canvas.getObjects().length > 0) {
        this.canvas.getObjects().forEach((item) => {
          item.set("selectable", false);
        });
      }
      this.stateIdx = stateIdx;
    }
  }

  clearAll() {
    // 获取画布中的所有对象
    if (this.canvas) {
      let children = this.canvas.getObjects();
      if (children.length > 0) {
        // 移除所有对象
        this.canvas.remove(...children);
      }
    }
  }

  showDwonRender = () => {
    switch (this.tool) {
      case "PEN":
        return this.showPen();
      case "TEXT":
        return this.drawText();
      case "ERASER":
        return this.getPixelColorOnCanvas();
      case "BUCKET":
        return this.drawBucket();
    }
  };

  getPixelColorOnCanvas = (): void => {
    const ctx = this.canvas.getContext();
    const x = this.getTransformedPosX(this.mouseFrom.x);
    const y = this.getTransformedPosY(this.mouseFrom.y);
    const p = ctx.getImageData(x, y, 1, 1).data;
    this.eraserColor = rgbToHex(p[0], p[1], p[2], p[3]);
    this.showBrush();
  };

  drawBucket = () => {
    const x = this.getTransformedPosX(this.mouseFrom.x);
    const y = this.getTransformedPosY(this.mouseFrom.y);
    if (this.fillColor) {
      const color = new Color(this.fillColor);
      const ctx = this.canvas.getContext();
      const newImageData = efficentFloodFill(ctx, x, y, [color.red(), color.green(), color.blue()]);
      if (newImageData) {
        this.showImg(newImageData);

        //this.canvas.contextContainer.putImageData(newImageData, 0, 0);
      }
    }
  };

  showImg = async (newImageData) => {
    if (newImageData) {
      // console.log("newImageData", newImageData);
      const imgSrc = this.canvas.toDataURL(newImageData);
      if (imgSrc) {
        fabric.Image.fromURL(
          imgSrc,
          (img) => {
            //img.scale(showScale);
            img.selectable = false;
            this.canvas.add(img).renderAll();
          },
          { crossOrigin: "anonymous" }
        );
      }

      // this.canvas.contextContainer.drawImage(
      //   await createImageBitmap(newImageData),
      //   0,
      //   0,
      //   this.canvas.width,
      //   this.canvas
      // );

      //this.canvas.getContext().putImageData(newImageData, 0, 0);
      //this.canvas.renderAll();
    }
  };

  setIsDrawingMode(drawing: boolean) {
    if (this.canvas) {
      this.isDrawingMode = drawing;
      this.canvas!.isDrawingMode = drawing;
    }
  }

  setShape = (value: { shapeType?: string }) => {
    const { shapeType } = value;
    this.shapeType = shapeType || this.shapeType;
  };

  setShowCanvas = (value: { color?: string; lineWidth?: number }) => {
    const { color, lineWidth } = value;
    this.strokeColor = color || this.strokeColor;
    this.lineWidth = lineWidth || this.lineWidth;
    this.showPen();
  };

  showPen() {
    if (this.canvas) {
      // 设置自由绘画模式画笔类型为 铅笔类型
      this.canvas!.freeDrawingBrush = new fabric.PencilBrush(this.canvas!);
      // 设置自由绘画模式 画笔颜色与画笔线条大小
      this.canvas!.freeDrawingBrush.color = this.strokeColor;
      this.canvas!.freeDrawingBrush.width = this.lineWidth;
    }
  }

  showBrush() {
    this.canvas.isDrawingMode = true;
    // 自由绘画模式 画笔类型设置为 橡皮擦对象
    this.canvas!.freeDrawingBrush = new fabric.PencilBrush(this.canvas!);

    //this.canvas.freeDrawingBrush = new fabric.EraserBrush(this.canvas);
    // 设置橡皮擦大小
    this.canvas.freeDrawingBrush.width = 35;
    this.canvas.freeDrawingBrush.color = this.eraserColor;
  }

  showShape() {
    switch (this.shapeType) {
      case "RECT":
        // 创建一个矩形对象
        // 计算矩形长宽
        const left = this.getTransformedPosX(this.mouseFrom.x);
        const top = this.getTransformedPosY(this.mouseFrom.y);
        let width = this.mouseTo.x - this.mouseFrom.x;
        let height = this.mouseTo.y - this.mouseFrom.y;
        // 创建矩形 对象
        const options = {
          left: left,
          top: top,
          width: width,
          height: height,
          strokeDashArray: [0, 0],
          stroke: this.strokeColor,
          fill: "transparent",
          strokeWidth: 1
        };
        if (this.shapeLine === "DOTTED") {
          options.strokeDashArray = [3, 3];
        }
        let Rect = new fabric.Rect(options);
        // 绘制矩形
        this.startDrawingObject(Rect);
        break;
      case "LINE":
        let line = new fabric.Line(
          [
            this.getTransformedPosX(this.mouseFrom.x),
            this.getTransformedPosY(this.mouseFrom.y),
            this.getTransformedPosX(this.mouseTo.x),
            this.getTransformedPosY(this.mouseTo.y)
          ],
          {
            fill: this.strokeColor,
            stroke: this.strokeColor,
            strokeWidth: 1,
            strokeDashArray: this.shapeLine === "DOTTED" ? [3, 3] : null
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
          strokeDashArray: this.shapeLine === "DOTTED" ? [3, 3] : null
        });
        this.startDrawingObject(canvasObject);
        break;
      case "TRIANGLE":
        let left_TRIANGLE = this.mouseFrom.x;
        let top_TRIANGLE = this.mouseFrom.y;
        let height_TRIANGLE = this.mouseTo.y - this.mouseFrom.y;
        let width_TRIANGLE = Math.sqrt(Math.pow(height_TRIANGLE, 2) + Math.pow(height_TRIANGLE / 2.0, 2));
        let TRIANGLE = new fabric.Triangle({
          left: left_TRIANGLE,
          top: top_TRIANGLE,
          width: width_TRIANGLE,
          height: height_TRIANGLE,
          stroke: this.strokeColor,
          fill: "transparent",
          strokeDashArray: this.shapeLine === "DOTTED" ? [3, 3] : null,
          strokeWidth: 1
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
        fill: this.strokeColor,
        hasControls: true,
        editable: true,
        width: 200,
        // heigh: 50,
        backgroundColor: "#fff",
        selectable: false,
        ...this.textStyle
      });
      // if (this.textStyle.letterSpacing) {
      //   this.canvas.contextTop.canvas.setAttribute(
      //     "style",
      //     `word-spacing:${this.textStyle.letterSpacing}`
      //   );
      // }
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
}

export default new Board({
  tool: "PEN"
});
