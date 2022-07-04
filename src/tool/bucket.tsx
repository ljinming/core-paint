import Tool, { getTransformedPos, getMousePosition, getMousePos } from "./tool";
import { parseColorString } from "./colorChange";
import { fabric } from "fabric";
const efficentFloodFill = (
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  fillColor: [number, number, number]
) => {
  // 保证 startX 和 startY 是正整数
  // 经测试，在触屏设备中 startX 和 startY 可能是小数，造成填充功能无法正确填充
  startX = Math.round(startX);
  startY = Math.round(startY);
  const pixelStack: [number, number][] = [
    [Math.round(startX), Math.round(startY)],
  ];
  const canvasWidth = ctx.canvas.width,
    canvasHeight = ctx.canvas.height;
  const startPos = (startY * canvasWidth + startX) * 4;
  const colorLayer = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
  const startColor: [number, number, number] = [
    colorLayer.data[startPos],
    colorLayer.data[startPos + 1],
    colorLayer.data[startPos + 2],
  ];
  const updatedPoint: Record<string | number, boolean> = {};

  if (
    startColor[0] === fillColor[0] &&
    startColor[1] === fillColor[1] &&
    startColor[2] === fillColor[2]
  )
    return;
  //const newData = [];
  while (pixelStack.length > 0) {
    const newPos = pixelStack.pop() as [number, number];
    const x = newPos[0];
    let y = newPos[1];
    let pixelPos = (y * canvasWidth + x) * 4;
    while (y-- >= 0 && matchColor(colorLayer, pixelPos, startColor)) {
      pixelPos -= canvasWidth * 4;
    }
    pixelPos += canvasWidth * 4;
    ++y;
    let reachLeft = false,
      reachRight = false;

    if (updatedPoint[pixelPos]) {
      continue;
    }
    updatedPoint[pixelPos] = true;
    // newData.push(pixelPos);
    while (
      y++ < canvasHeight - 1 &&
      matchColor(colorLayer, pixelPos, startColor)
    ) {
      fillPixel(colorLayer, pixelPos, fillColor);
      if (x > 0) {
        if (matchColor(colorLayer, pixelPos - 4, startColor)) {
          if (!reachLeft) {
            pixelStack.push([x - 1, y]);
            reachLeft = true;
          }
        } else if (reachLeft) {
          reachLeft = false;
        }
      }

      if (x < canvasWidth - 1) {
        if (matchColor(colorLayer, pixelPos + 4, startColor)) {
          if (!reachRight) {
            pixelStack.push([x + 1, y]);
            reachRight = true;
          }
        } else if (reachRight) {
          reachRight = false;
        }
      }

      pixelPos += canvasWidth * 4;
    }
  }
  //ColorMatrix(colorLayer);
  const filter = new fabric.Image.filters.ColorMatrix();
  //console.log("==3", filter);
  //filter.applyTo2d(ctx);
  //console.log("==4", colorLayer.data);
  //new fabric.Image.filters.ColorMatrix({ matrix: colorLayer.data });

  ctx.putImageData(colorLayer, 0, 0);
  //Tool.canvas.renderAll.bind(Tool.canvas);
  // ctx.toDataURL();
  // filter.applyTo(colorLayer.toDataURL());
  Tool.canvas.requestRenderAll.bind(Tool.canvas);
};

/**
 * 判断两个位置的像素颜色是否相同
 */
const matchColor = (
  colorLayer: ImageData,
  pixelPos: number,
  color: [number, number, number]
) => {
  const r = colorLayer.data[pixelPos];
  const g = colorLayer.data[pixelPos + 1];
  const b = colorLayer.data[pixelPos + 2];

  return (
    Math.abs(r - color[0]) < 20 &&
    Math.abs(g - color[1]) < 20 &&
    Math.abs(b - color[2]) < 20
  );
};

/**
 * 修改指定ImageData的指定位置像素颜色
 */
const fillPixel = (
  colorLayer: ImageData,
  pixelPos: number,
  color: [number, number, number]
) => {
  colorLayer.data[pixelPos] = color[0];
  colorLayer.data[pixelPos + 1] = color[1];
  colorLayer.data[pixelPos + 2] = color[2];

  //return colorLayer;
  return colorLayer;
};

class Bucket extends Tool {
  static color: string = "transparent";

  static changeColor = (color) => {
    this.color = color;
  };

  operateStart(pos) {
    const ctx = Tool.canvas.getContext();
    const color = parseColorString(Bucket.color);
    Promise.resolve().then(() => {
      efficentFloodFill(ctx, pos.x, pos.y, [color.r, color.g, color.b]);
    });

    //this.filterChange();

    // Tool.canvas.requestRenderAll();
  }

  private filterChange() {
    const filters = fabric.Image.filters;
    console.log("===546", filters);
    // filters.swapColor = fabric.util.createClass({
    //   type: "swapColor",
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

    // fabric.Image.filters.swapColor.fromObject = function (object) {
    //   return new fabric.Image.filters.swapColor(object);

    //   // Tool.canvas.requestRenderAll();
    // };
  }

  public onMouseDown(options): void {
    if (Tool.toolType === "BUCKET") {
      const { e, pointer } = options;
      const points1 = Tool.canvas.getPointer(e);
      e.preventDefault();
      const showPointer = getMousePos(e); //getTransformedPos(pointer);
      const zoomPoint = getTransformedPos(showPointer);
      const calcPoints = getMousePosition(e);
      console.log("==3", pointer);
      const show = {
        x: pointer.x * 2,
        y: pointer.y * 2,
      };

      this.operateStart(show);
    }
  }
}

export default Bucket;
