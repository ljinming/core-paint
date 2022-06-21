import { Board } from "@/board";
import { fabric } from "fabric";
import { useEffect, useRef } from "react";

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
  const { canvasSize, imgSrc, backgroundColor, tool, id, board } = props;
  useEffect(() => {
    board.init(
      new fabric.Canvas(canvasRef.current, {
        width: 500, // 画布宽度
        height: 500, // 画布高度
        backgroundColor: backgroundColor, // 画布背景色
        isDrawingMode: true,
      }),
      canvasRef.current,
      imgSrc
    );
    // board.addEventListener();

    // board.initCanvasEvent();
  }, []);

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
      // board.showBrush();
    }
  }, [tool]);

  return (
    <canvas
      ref={canvasRef}
      //  style={{ backgroundColor: "#fff" }}
      id={`ccc-paint-canvas ${id}`}
      width={500}
      height={500}
    ></canvas>
  );
};
