import { fabric } from "fabric";
import { Tool, Pen, Shape, Eraser, Bucket, CanvasText } from "@/tool";
import { useEffect, useRef, useState } from "react";
import { efficentFloodFill } from "./utils";
import "./index.less";

let translatex = 0;
let translatey = 0;
let show_scale = 1;
const scaleStep = 0.1;
const maxScale = 6;
const minScale = 0.1;
const canvas2dBackend = new fabric.Canvas2dFilterBackend();
fabric.filterBackend = canvas2dBackend;

fabric.Image.filters["ChangeColorFilter"] = fabric.util.createClass(
  fabric.Image.filters.BaseFilter,
  {
    type: "ChangeColorFilter",
    applyTo: function (options) {
      let imageData = options.imageData;
      if (this.fillColor && this.pos) {
        imageData = efficentFloodFill(
          imageData,
          this.pos.x,
          this.pos.y,
          this.fillColor
        );
      }

      options.ctx.putImageData(imageData, 0, 0);
    },
  }
);

fabric.Image.filters["ChangeColorFilter"].fromObject = function (object) {
  return new fabric.Image.filters["ChangeColorFilter"](object);
};

interface CanvasProps {
  backgroundColor?: string;
  canvasSize: {
    width: number;
    height: number;
  };
  imgSrc?: string;
  tool: string;
  id?: string;
  straw: {
    strawFlag: boolean;
    strawColor: string;
  };
}
export default (props: CanvasProps) => {
  const canvasRef = useRef(null);
  const canvasBoxRef = useRef(null);
  const [manager, setManage] = useState<Tool>();
  const [fabricCanvas, setCanvas] = useState<fabric.Canvas>(null);
  const { canvasSize, imgSrc, backgroundColor, tool, id, straw } = props;
  useEffect(() => {
    const canvasBox = canvasBoxRef.current;
    const canvasCurrent = canvasRef.current;
    const { width, height } = canvasBox.getBoundingClientRect();
    const { left, top } = canvasCurrent.getBoundingClientRect();
    if (canvasSize) {
      const showScale =
        Math.min(width, height) /
          Math.max(canvasSize.height, canvasSize.width) || 1;
      //初始化画布
      const canvas = new fabric.Canvas(canvasRef.current, {
        width: canvasSize.width, // 画布宽度
        height: canvasSize.height, // 画布高度
        backgroundColor: backgroundColor || "#2d2d2d", // 画布背景色
        // isDrawingMode: true,
      });
      Tool.canvas = canvas;
      canvas.setCursor("default");
      translatex = (width - canvasSize.width * showScale) / 2;
      translatey = (height - canvasSize.height * showScale) / 2;
      Tool._offset = {
        x: left,
        y: top,
      };
      setManage(new Pen());
      if (imgSrc) {
        fabric.Image.fromURL(
          imgSrc,
          (img) => {
            img.selectable = false;
            img.evented = false;
            //canvas.add(img).renderAll();
            // 图片加载完成之后，应用滤镜效果
            //img.filters.push(new fabric.Image.filters.Grayscale());
            img.filters.push(new fabric.Image.filters["ChangeColorFilter"]());
            img.applyFilters();
            //canvas.add(img).renderAll();
            Tool.img = img;
            canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
          },
          { crossOrigin: "anonymous" }
        );
      }
      Tool.transform = {
        translatex,
        translatey,
      };
      // canvasCurrent.style.transform = `scale(${showScale}) translate(${translatex}px,${translatey}px)`;
      Tool.canvasCurrent = canvasCurrent;
      Tool.currentScale = showScale;
      show_scale = showScale;
      canvas.freeDrawingBrush["limitedToCanvasSize"] = true;
      canvas.freeDrawingBrush.strokeLineJoin = "miter";

      Tool.canvas.setZoom(showScale);
      // Tool.canvas.setWidth(canvasSize.width);
      // Tool.canvas.setHeight(canvasSize.width);
      setCanvas(canvas);
    }
  }, [canvasSize]);

  useEffect(() => {
    Tool.toolType = tool;
    if (fabricCanvas) {
      switch (tool) {
        case "PEN":
          // 开启绘画功能
          setManage(new Pen());
          break;
        case "SHAPE":
          //关闭绘画功能
          setManage(new Shape());
          break;
        case "ERASER":
          setManage(new Eraser());
          break;
        case "BUCKET":
          setManage(new Bucket());
          break;
        case "TEXT":
          Tool.canvas.isDrawingMode = false;
          setManage(new CanvasText());
          break;
      }
    }
  }, [tool]);

  const onMouseDown = (options) => {
    if (manager) {
      manager.onMouseDown(options);
    }
  };
  const onMouseMove = (options) => {
    if (manager) {
      manager.onMouseMove(options);
    }
  };

  const onMouseUp = (options) => {
    if (manager) {
      manager.onMouseUp(options);
    }
  };

  const onSelected = (options) => {
    console.log("=onSelected=435", options);
    if (manager) {
      manager.onSelected(options);
    }
  };

  const onCancelSelected = (options) => {
    if (manager) {
      manager.onCancelSelected(options);
    }
  };

  const onDbClick = (options) => {
    if (manager) {
      manager.onDbClick(options);
    }
  };

  const getTrans = (
    client: number,
    newScale: number,
    direction: string,
    img: any,
    boxdom: any,
    scale: number
  ) => {
    const lastTrans = direction === "width" ? translatex : translatey;
    // console.log("已经偏移的距离:", lastTrans);

    const sizeChanage = img[direction] * newScale - img[direction] * scale;
    // console.log(`img ${direction}放大了:`, sizeChanage);

    // 整体已经移动过了，需要弥补回来
    const pre = client - lastTrans - boxdom[direction === "width" ? "x" : "y"];

    //console.log("缩放中心到边界的距离", pre);

    const percent = pre / (img[direction] * scale);

    //  console.log("当前缩放尺度下，缩放中心到边界比例", percent);

    const trans = percent * sizeChanage;
    // console.log("缩放中心移动的距离:", trans);
    return trans;
  };

  const onWheel = (options) => {
    const { e: event } = options;
    event.preventDefault();
    const canvas = canvasRef.current;
    const container = canvasBoxRef!.current;
    const { clientX, clientY, deltaX, deltaY, ctrlKey } = event;
    const { width, height, x, y } = container!.getBoundingClientRect();
    const { width: canvasWidth, height: canvasHeight } =
      container!.getBoundingClientRect();
    let newScale;
    if (ctrlKey) {
      //双指放大缩小
      if (deltaY < 0) {
        newScale = show_scale + scaleStep;
        newScale = Math.min(newScale, maxScale);
      } else {
        newScale = show_scale - scaleStep;
        newScale = Math.max(newScale, minScale);
      }
      const transX = getTrans(
        clientX,
        newScale,
        "width",
        canvasSize,
        {
          width,
          height,
          x,
          y,
        },
        show_scale
      );
      const transY = getTrans(
        clientY,
        newScale,
        "height",
        canvasSize,
        {
          width,
          height,
          x,
          y,
        },
        show_scale
      );
      translatex = translatex - transX;
      translatey = translatey - transY;
      show_scale = newScale;
      Tool.currentScale = newScale;
      canvas!.style.transform = `translate3d(${translatex}px, ${translatey}px, 0px) scale(${show_scale})`;
    }
    // else {
    //   if (!!deltaX && !deltaY) {
    //     // if (translatex > 0 && translatex < width) {
    //     // 左右移动 向右 -deltaX < 0  向左   >0
    //     translatex = Number((translatex - deltaX).toFixed(3));
    //     // }
    //   } else if (!!deltaY && !deltaX) {
    //     // if (translatey > 0 && translatex < height) {
    //     // 左右移动 向右 -deltaX < 0  向左   >0
    //     translatey = Number((translatey - deltaY).toFixed(3));
    //     // }
    //   }
    // }
  };

  const onWheelZoom = (options) => {
    const { e } = options;
    e.preventDefault();
    const { deltaY, offsetX, offsetY } = e; // 滚轮，向上滚一下是 -100，向下滚一下是 100
    let zoom = Tool.canvas.getZoom(); // 获取画布当前缩放值
    zoom *= 0.999 ** deltaY;
    if (zoom > 20) zoom = 20; // 限制最大缩放级别
    if (zoom < 0.01) zoom = 0.01; // 限制最小缩放级别

    // 以鼠标所在位置为原点缩放
    Tool.canvas.zoomToPoint(
      {
        // 关键点
        x: offsetX,
        y: offsetY,
      },
      zoom // 传入修改后的缩放级别
    );
  };

  // const onAfterRender = (options) => {
  //   // if (Tool.onAfterRender) {
  //   //   Tool.onAfterRender(options);
  //   // }
  // };

  useEffect(() => {
    if (fabricCanvas) {
      fabricCanvas.on("mouse:down", onMouseDown);
      fabricCanvas.on("mouse:move", onMouseMove);
      fabricCanvas.on("mouse:up", onMouseUp);
      //双击
      fabricCanvas.on("mouse:dblclick", onDbClick);

      //缩放
      fabricCanvas.on("mouse:wheel", onWheelZoom);

      // 监听绘画选中/取消⌚️
      fabricCanvas.on("selection:created", onSelected);
      fabricCanvas.on("selection:cleared", onCancelSelected);
      // fabricCanvas.on("after:render", onAfterRender);
    }
  }, [
    fabricCanvas,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onDbClick,
    onSelected,
    onCancelSelected,
  ]);

  return (
    <div className="ccc-canvas-box" ref={canvasBoxRef}>
      <canvas
        ref={canvasRef}
        className="ccc-paint-canvas"
        id={`ccc-paint-canvas ${id}`}
      ></canvas>
    </div>
  );
};
