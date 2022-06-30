/*
   图形工具发生不同的事件
*/

import { fabric } from "fabric";

let currentPolyline = null; // 临时折线
let currentLine = null; // 临时线段

// 创建折线
function createPolyline(e, canvas) {
  const currentPoint = e.absolutePointer;
  //   currentPolyline = new fabric.Polyline(
  //     [
  //       { x: currentPoint.x, y: currentPoint.y },
  //       { x: currentPoint.x, y: currentPoint.y },
  //     ],
  //     {
  //       fill: "transparent",
  //       stroke: "rgba(0, 0, 0, 0.2)",
  //       objectCaching: false,
  //     }
  //   );

  currentLine = new fabric.Line(
    [
      currentPoint.x,
      currentPoint.y, // 起始点坐标
      currentPoint.x,
      currentPoint.y, // 结束点坐标
    ],
    {
      stroke: "#000", // 笔触颜色
    }
  );

  console.log("======3create", currentPolyline);
  canvas.add(currentLine);
}

// 修改当前正在创建的折线
function changeCurrentPolyline(e, canvas) {
  const currentPoint = e.absolutePointer;
  console.log("==4", e);
  let points = currentPolyline?.points || [];

  points.push({
    x: currentPoint.x,
    y: currentPoint.y,
  });
  canvas.requestRenderAll();
}

// 折线橡皮带
function changePolylineBelt(e, canvas) {
  const currentPoint = e.absolutePointer;
  console.log("--456", currentPolyline, e);
  //let points = currentPolyline.points;

  //   points[points.length - 1].x = currentPoint.x;
  //   points[points.length - 1].y = currentPoint.y;

  currentLine.set("x2", currentPoint.x);
  currentLine.set("y2", currentPoint.y);
  canvas.requestRenderAll();
}

// 完成折线绘制
function finishPolyline(e, canvas) {
  const currentPoint = e.absolutePointer;
  let points = currentPolyline.points;
  points[points.length - 1].x = currentPoint.x;
  points[points.length - 1].y = currentPoint.y;

  points.pop();
  points.pop();
  canvas.remove(currentPolyline);

  if (points.length > 1) {
    let polyline = new fabric.Polyline(points, {
      stroke: "#000",
      fill: "transparent",
    });

    canvas.add(polyline);
  }
  currentPolyline = null;

  canvas.requestRenderAll();
}

export const shapeMouseDown = (e, canvas) => {
  //鼠标按下 图形
  console.log("===4", e);
  if (currentPolyline === null) {
    createPolyline(e, canvas);
  } else {
    changeCurrentPolyline(e, canvas);
  }
};

// 鼠标在画布上移动
export function shapeMouseMove(e, canvas) {
  if (currentLine) {
    changePolylineBelt(e, canvas);
  }
}
// 鼠标在画布上双击
export function shapeDblclick(e, canvas) {
  finishPolyline(e, canvas);
}

//鼠标在画布上释放
export function shapeUp(e, canvas) {
  currentLine.set("stroke", "#000");
  currentLine = null;
}
