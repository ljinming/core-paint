import { Board } from "@/board";
import { fabric } from "fabric";
// import Tool from "@/board/tool/tool";
// import Pen from "@/board/tool/pen";
import { Tool, Pen, Shape, Eraser, Bucket } from "@/tool";
import { useEffect, useRef, useState } from "react";
import "./index.less";
import ToolType from "../ToolType";

let translatex = 0;
let translatey = 0;

let show_scale = 1;
const scaleStep = 0.1;
const maxScale = 6;
const minScale = 0.1;

interface CanvasProps {
  board: Board;
  backgroundColor?: string;
  canvasSize: {
    width: number;
    height: number;
  };
  imgSrc?: string;
  tool: string;
  id?: string;
}
export default (props: CanvasProps) => {
  const canvasRef = useRef(null);
  const canvasBoxRef = useRef(null);
  const [manager, setManage] = useState<Tool>();
  const [fabricCanvas, setCanvas] = useState<fabric.Canvas>(null);
  const { canvasSize, imgSrc, backgroundColor, tool, id, board } = props;
  useEffect(() => {
    const canvasBox = canvasBoxRef.current;
    const canvasCurrent = canvasRef.current;
    const { width, height } = canvasBox.getBoundingClientRect();
    const { left, top } = canvasCurrent.getBoundingClientRect();
    //board.clearAll();
    if (canvasSize) {
      const showScale =
        Math.min(width, height) /
          Math.max(canvasSize.height, canvasSize.width) || 1;
      //初始化画布
      const canvas = new fabric.Canvas(canvasRef.current, {
        width: canvasSize.width, // 画布宽度
        height: canvasSize.height, // 画布高度
        backgroundColor: backgroundColor || "#2d2d2d", // 画布背景色
        isDrawingMode: true,
      });
      translatex = (width - canvasSize.width * showScale) / 2;
      translatey = (height - canvasSize.height * showScale) / 2;
      Tool._offset = {
        x: left,
        y: top,
      };
      if (imgSrc) {
        fabric.Image.fromURL(
          imgSrc,
          (img) => {
            img.selectable = false;
            img.evented = false;
            //canvas.add(img).renderAll();
            // 图片加载完成之后，应用滤镜效果
            // img.filters.push(
            //   new fabric.Image.filters.Sepia(),
            //   new fabric.Image.filters.Brightness({ brightness: 100 })
            // );
            //img.applyFilters(canvas.renderAll.bind(canvas));
            canvas.add(img).renderAll();
            //canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
          },
          { crossOrigin: "anonymous" }
        );
      }
      //fabric.BaseBrush.limitedToCanvasSize = true; // 当“ true”时，自由绘制被限制为画布大小。

      /*test fabric*/
      // fabric.Image.filters.Redify = fabric.util.createClass({
      //   type: "Redify",
      //   applyTo: function (canvasEl) {
      //     var context = canvasEl.getContext("2d"),
      //       imageData = context.getImageData(
      //         0,
      //         0,
      //         canvasEl.width,
      //         canvasEl.height
      //       ),
      //       data = imageData.data;

      //     for (var i = 0, len = data.length; i < len; i += 4) {
      //       data[i + 1] = 0;
      //       data[i + 2] = 0;
      //     }

      //     context.putImageData(imageData, 0, 0);
      //   },
      // });

      // fabric.Image.filters.Redify.fromObject = function (object) {
      //   return new fabric.Image.filters.Redify(object);
      // };
      // console.log("===3", filters);
      //canvas.setZoom(showScale); // 设置画布缩放级别
      //canvasCurrent.style.transform = `scale(${showScale}) translate(${translatex}px,${translatey}px)`;
      Tool.canvasCurrent = canvasCurrent;
      Tool.canvas = canvas;
      Tool.currentScale = showScale;
      show_scale = showScale;
      //canvas.freeDrawingBrush.limitedToCanvasSize = true;
      canvas.freeDrawingBrush.strokeLineJoin = "miter";

      Tool.canvas.setZoom(showScale);

      setCanvas(canvas);
    }
  }, [canvasSize]);

  useEffect(() => {
    board.setTool(tool);
    Tool.toolType = tool;

    if (fabricCanvas) {
      //Tool.canvas = fabricCanvas;
      switch (tool) {
        case "PEN":
          // 开启绘画功能
          if (!fabricCanvas.isDrawingMode) {
            Tool.canvas.isDrawingMode = true;
          }
          setManage(new Pen());
          // new Pen();
          // board.setIsDrawingMode(true);
          // board.showPen();
          break;
        case "SHAPE":
          //关闭绘画功能
          Tool.canvas.isDrawingMode = false;
          setManage(new Shape());
          break;
        case "ERASER":
          // Tool.canvas.freeDrawingBrush = new fabric.EraserBrush(Tool.canvas);
          Tool.canvas.isDrawingMode = true;
          // fabricCanvas.freeDrawingBrush.width = 10; // 设置画笔粗细为 10
          setManage(new Eraser());
          //board.setIsDrawingMode(true);
          break;
        case "BUCKET":
          // T.freeDrawingBrush = false;
          Tool.canvas.isDrawingMode = false;
          setManage(new Bucket());
          //board.setIsDrawingMode(true);
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
      // fabricCanvas.on("object:moving", function (e) {
      //   var obj = e.target;
      //   console.log("==r56", obj);
      //   // if object is too big ignore
      //   // if (
      //   //   obj.currentHeight > obj.canvas.height ||
      //   //   obj.currentWidth > obj.canvas.width
      //   // ) {
      //   //   return;
      //   // }
      //   obj.setCoords();
      //   // top-left  corner
      //   if (obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0) {
      //     obj.top = Math.max(obj.top, obj.top - obj.getBoundingRect().top);
      //     obj.left = Math.max(obj.left, obj.left - obj.getBoundingRect().left);
      //   }
      //   // bot-right corner
      //   if (
      //     obj.getBoundingRect().top + obj.getBoundingRect().height >
      //       obj.canvas.height ||
      //     obj.getBoundingRect().left + obj.getBoundingRect().width >
      //       obj.canvas.width
      //   ) {
      //     obj.top = Math.min(
      //       obj.top,
      //       obj.canvas.height -
      //         obj.getBoundingRect().height +
      //         obj.top -
      //         obj.getBoundingRect().top
      //     );
      //     obj.left = Math.min(
      //       obj.left,
      //       obj.canvas.width -
      //         obj.getBoundingRect().width +
      //         obj.left -
      //         obj.getBoundingRect().left
      //     );
      //   }
      // });
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
