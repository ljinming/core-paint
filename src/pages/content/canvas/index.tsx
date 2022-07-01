import { Board } from "@/board";
import { fabric } from "fabric";
// import Tool from "@/board/tool/tool";
// import Pen from "@/board/tool/pen";
import { Tool, Pen, Shape } from "@/tool";
import { useEffect, useRef, useState } from "react";
import "./index.less";
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
    const { width, height } = canvasBox.getBoundingClientRect();
    //board.clearAll();
    if (canvasSize) {
      const showScale =
        Math.min(width, height) /
          Math.max(canvasSize.height, canvasSize.width) || 1;
      const showWidth = canvasSize.width * showScale;
      const showHeight = canvasSize.width * showScale;
      if (showWidth && showHeight) {
        const canvas = new fabric.Canvas(canvasRef.current, {
          width: showWidth, // 画布宽度
          height: showHeight, // 画布高度
          backgroundColor: backgroundColor, // 画布背景色
          // isDrawingMode: true,
        });
        Tool.canvas = canvas;
        if (imgSrc) {
          // const { showScale = 1 } = other;
          fabric.Image.fromURL(
            imgSrc,
            (img) => {
              img.scale(showScale);
              img.selectable = false;
              canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
            },
            { crossOrigin: "anonymous" }
          );
        }
        // Tool.init(canvas, canvasRef.current, imgSrc, {
        //   showScale: showScale || 1,
        // });
        setCanvas(canvas);
      }
    }
  }, [canvasSize]);

  useEffect(() => {
    board.setTool(tool);
    if (fabricCanvas) {
      switch (tool) {
        case "PEN":
          // 开启绘画功能
          fabricCanvas.isDrawingMode = true;
          setManage(new Pen());
          // new Pen();
          // board.setIsDrawingMode(true);
          // board.showPen();
          break;
        case "SHAPE":
          //关闭绘画功能
          console.log("--5");
          fabricCanvas.isDrawingMode = false;
          // board.setIsDrawingMode(false);
          setManage(new Shape());
          break;
        case "ERASER":
          board.setIsDrawingMode(true);
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

  useEffect(() => {
    if (fabricCanvas) {
      fabricCanvas.on("mouse:down", onMouseDown);
      fabricCanvas.on("mouse:move", onMouseMove);
      fabricCanvas.on("mouse:up", onMouseUp);
      //双击
      fabricCanvas.on("mouse:dblclick", onDbClick);

      // 监听绘画选中/取消⌚️
      fabricCanvas.on("selection:created", onSelected);
      fabricCanvas.on("selection:cleared", onCancelSelected);
    }
  }, [manager, fabricCanvas]);

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
