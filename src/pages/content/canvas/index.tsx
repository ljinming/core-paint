import { Board } from "@/board";
import { fabric } from "fabric-with-erasing";
// import Tool from "@/board/tool/tool";
// import Pen from "@/board/tool/pen";
import { Tool, Pen, Shape, Eraser } from "@/tool";
import { useEffect, useRef, useState } from "react";
import "./index.less";

let translatex = 0;
let translatey = 0;
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
        backgroundColor: backgroundColor, // 画布背景色
        // isDrawingMode: true,
      });
      canvas.setZoom(showScale); // 设置画布缩放级别
      translatex = (width - canvasSize.width * showScale) / 2;
      translatey = (height - canvasSize.height * showScale) / 2;
      Tool.currentScale = showScale;
      Tool.canvas = canvas;
      Tool.canvasCurrent = canvasCurrent;
      Tool._offset = {
        x: left,
        y: top,
      };
      if (imgSrc) {
        // const { showScale = 1 } = other;
        fabric.Image.fromURL(
          imgSrc,
          (img) => {
            // img.scale(showScale);
            // img.selectable = false;
            //canvas.add(img).renderAll();
            canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
          },
          { crossOrigin: "anonymous" }
        );
      }
      //canvasCurrent.style.transform = `scale(${showScale})`;
      setCanvas(canvas);
    }
  }, [canvasSize]);

  useEffect(() => {
    board.setTool(tool);
    if (fabricCanvas) {
      switch (tool) {
        case "PEN":
          // 开启绘画功能
          if (!fabricCanvas.isDrawingMode) {
            fabricCanvas.isDrawingMode = true;
          }
          setManage(new Pen());
          // new Pen();
          // board.setIsDrawingMode(true);
          // board.showPen();
          break;
        case "SHAPE":
          //关闭绘画功能
          console.log("--5");
          //fabricCanvas.isDrawingMode = false;
          setManage(new Shape());
          break;
        case "ERASER":
          fabricCanvas.isDrawingMode = true;
          setManage(new Eraser());
          //board.setIsDrawingMode(true);
          break;
      }
    }
  }, [tool, fabricCanvas]);

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

  const onWheel = (options) => {
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
      fabricCanvas.on("mouse:wheel", onWheel);

      // 监听绘画选中/取消⌚️
      fabricCanvas.on("selection:created", onSelected);
      fabricCanvas.on("selection:cleared", onCancelSelected);
    }
  }, [
    manager,
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
