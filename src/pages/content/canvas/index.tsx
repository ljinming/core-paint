import { Board } from "@/board";
import { fabric } from "fabric";
import { useEffect, useRef } from "react";
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
  const { canvasSize, imgSrc, backgroundColor, tool, id, board } = props;
  useEffect(() => {
    const canvasBox = canvasBoxRef.current;
    const { width, height } = canvasBox.getBoundingClientRect();
    board.clearAll();
    if (canvasSize) {
      const showScale =
        Math.min(width, height) /
          Math.max(canvasSize.height, canvasSize.width) || 1;
      const showWidth = canvasSize.width * showScale;
      const showHeight = canvasSize.width * showScale;
      if (showWidth && showHeight) {
        board.init(
          new fabric.Canvas(canvasRef.current, {
            width: showWidth, // 画布宽度
            height: 783, // 画布高度
            backgroundColor: backgroundColor, // 画布背景色
            isDrawingMode: true,
          }),
          canvasRef.current,
          imgSrc,
          { showScale: showScale || 1 }
        );
      }
    }
  }, [canvasSize]);

  useEffect(() => {
    board.setTool(tool);
    switch (tool) {
      case "PEN":
        board.setIsDrawingMode(true);
        board.showPen();
        break;
      case "SHAPE":
        board.setIsDrawingMode(false);
        break;
      case "ERASER":
        board.setIsDrawingMode(true);
        break;
    }
  }, [tool]);

  return (
    <div className="ccc-canvas-box" ref={canvasBoxRef}>
      <canvas
        ref={canvasRef}
        className="ccc-paint-canvas"
        id={`ccc-paint-canvas ${id}`}
        // width={500}
        // height={500}
      ></canvas>
    </div>
  );
};
