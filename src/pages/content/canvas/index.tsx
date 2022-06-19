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
  tool: string;
  id?: string;
}
export default (props: CanvasProps) => {
  const canvasRef = useRef(null);
  const { canvasSize, backgroundColor, tool, id, board } = props;

  useEffect(() => {
    board.init(
      new fabric.Canvas(canvasRef.current, {
        width: 500, // 画布宽度
        height: 500, // 画布高度
        backgroundColor: backgroundColor, // 画布背景色
        isDrawingMode: false
      }),
      canvasRef.current
    );
    // board.addEventListener();

    // board.initCanvasEvent();
  }, []);

  useEffect(() => {
    switch (tool) {
      case "PEN":
        board.setIsDrawingMode(true);
        board.showPen();
        break;
      case "SHAPE":
        board.setIsDrawingMode(false);
        board.setShape({ shapeType: "line" });

        break;
    }
  }, [tool]);

  return (
    <canvas
      ref={canvasRef}
      //  style={{ backgroundColor: "#fff" }}
      id={`ccc-paint-canvas ${id}`}
      width={canvasSize.width || 500}
      height={canvasSize.height || 500}
    ></canvas>
  );
};
