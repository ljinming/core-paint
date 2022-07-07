import { fabric } from "fabric-with-erasing";
import { Tool, Pen, Shape, Eraser, Bucket, CanvasText } from "@/tool";
import { useEffect, useRef, useState } from "react";
import cursorPen from "@/assets/icon/cursorPen.jpg";
import { efficentFloodFill, getTrans } from "./utils";
import "./index.less";

let translatex = 0;
let translatey = 0;
let show_scale = 1;
const scaleStep = 0.01;
const maxScale = 6;
const minScale = 0.1;

/*设置为2d模块 如不设置 默认webgl 为true*/
const canvas2dBackend = new fabric.Canvas2dFilterBackend();
fabric.filterBackend = canvas2dBackend;

/*filter*/
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
    if (canvasSize) {
      const showScale =
        Math.min(width, height) /
          Math.max(canvasSize.height, canvasSize.width) || 1;
      translatex = (width - canvasSize.width * showScale) / 2;
      translatey = (height - canvasSize.height * showScale) / 2;
      canvasCurrent.style.transform = `scale(${showScale}) translate(${translatex}px,${translatey}px)`;
      show_scale = showScale;
      //初始化画布
      const canvas = new fabric.Canvas(canvasRef.current, {
        width: canvasSize.width, // 画布宽度
        height: canvasSize.height, // 画布高度
        backgroundColor: backgroundColor || "#2d2d2d", // 画布背景色
        preserveObjectStacking: false,
        // isDrawingMode: true,
      });
      Tool.canvas = canvas;
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
      setCanvas(canvas);
    }
  }, [canvasSize]);

  useEffect(() => {
    Tool.toolType = tool;
    showCanvasCursor();
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

  const showCanvasCursor = () => {
    // const upEleCanvasList =
    //   document.getElementsByClassName("upper-canvas") || [];
    // let upEleCanvas;
    // for (let i = 0; i < upEleCanvasList.length; i++) {
    //   if (upEleCanvasList[i]?.clientWidth === canvasSize.width) {
    //     upEleCanvas = upEleCanvasList[i];
    //     break;
    //   }
    // }
    // if (upEleCanvas) {
    //   upEleCanvas.style.cursor = `url(${cursorPen}) 12 16,auto`;
    // }
    if (fabricCanvas) {
      fabricCanvas.setCursor("default");
    }
  };

  const clacCanvasTransform = (scale, translatex, translatey) => {
    const upEleCanvasList =
      document.getElementsByClassName("upper-canvas") || [];
    let upEleCanvas;

    for (let i = 0; i < upEleCanvasList.length; i++) {
      if (upEleCanvasList[i]?.clientWidth === canvasSize.width) {
        upEleCanvas = upEleCanvasList[i];
        break;
      }
    }
    //
    const new_translatex = Number((translatex / scale).toFixed(3));
    const new_translatey = Number((translatey / scale).toFixed(3));

    if (upEleCanvas) {
      upEleCanvas.style.transform = `scale(${scale}) translate(${new_translatex}px,${new_translatey}px)`;
    }
  };

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

  const onWheel = (options) => {
    const { e: event } = options;
    event.preventDefault();
    const canvas = canvasRef.current;
    const container = canvasBoxRef!.current;
    const { clientX, clientY, deltaX, deltaY, ctrlKey } = event;
    const { width, height, x, y } = container!.getBoundingClientRect();
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
        show_scale,
        translatex,
        translatey
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
        show_scale,
        translatex,
        translatey
      );
      translatex = translatex - transX;
      translatey = translatey - transY;
      show_scale = newScale;
      canvas!.style.transform = `translate(${translatex}px, ${translatey}px) scale(${show_scale})`;
      clacCanvasTransform(newScale, translatex, translatey);
    }
  };

  const onCanvasBoxWheel = (event) => {
    event.preventDefault();
    const { deltaX, deltaY, ctrlKey } = event;
    const canvas = canvasRef.current;
    if (!ctrlKey) {
      if (!!deltaX && !deltaY) {
        // if (translatex > 0 && translatex < width) {
        // 左右移动 向右 -deltaX < 0  向左   >0
        translatex = Number((translatex - deltaX).toFixed(3));
        // }
      } else if (!!deltaY && !deltaX) {
        // if (translatey > 0 && translatex < height) {
        // 左右移动 向右 -deltaX < 0  向左   >0
        translatey = Number((translatey - deltaY).toFixed(3));
        // }
      }
      canvas!.style.transform = `translate(${translatex}px, ${translatey}px) scale(${show_scale})`;
      clacCanvasTransform(show_scale, translatex, translatey);
    }
  };

  useEffect(() => {
    const canvasBox = canvasBoxRef.current;
    if (fabricCanvas && canvasBox) {
      fabricCanvas.on("mouse:down", onMouseDown);
      fabricCanvas.on("mouse:move", onMouseMove);
      fabricCanvas.on("mouse:up", onMouseUp);
      //双击
      fabricCanvas.on("mouse:dblclick", onDbClick);

      //缩放
      fabricCanvas.on("mouse:wheel", onWheel);
      canvasBox.addEventListener("wheel", onCanvasBoxWheel, { passive: false });

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
