import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import "./index.less";
import { initBruch } from "./utils";

interface CanvasProps {
  canvasSize: {
    width: number;
    height: number;
  };
  backgroundColor: string;
  select: string;
}

function FabricJSCanvas(props: CanvasProps) {
  const { canvasSize, backgroundColor, select } = props;
  const canvasEl = useRef(null);
  //let canvas: fabric.Canvas;
  useEffect(() => {
    let canvas = new fabric.Canvas(canvasEl.current);
    //new updateCanvasContext(canvas);
    canvas.fill = backgroundColor || "#fff";
    //canvas.width = canvasSize.width || 500;
    // canvas.height = canvasSize.height || 500;
    console.log("===4", canvas);
    // canvas.renderAll();
    //updateCanvasContext(canvas);
    return () => {
      //updateCanvasContext(canvas);
      canvas.dispose();
    };
  }, [backgroundColor]);

  useEffect(() => {
    // console.log("=====4", select, canvas);
    switch (select) {
      case "PEN":
        //initBruch(canvas);
        break;
    }
  }, [select]);

  return (
    <canvas
      ref={canvasEl}
      style={{ backgroundColor }}
      className="canvasBox"
      width={canvasSize.width}
      height={canvasSize.height}
    />
  );
}

export default FabricJSCanvas;
