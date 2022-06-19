// export const updateCanvasContext = (canvas: fabric.Canvas) => {
//     this.canvas = canvas;
//   if (canvas) {
//     canvas.renderAll();
//   } else {
//     throw new Error("Function not implemented.");
//   }
// };

// export default class updateCanvasContext {
//   private canvas: fabric.Canvas;
//   private strokeColor : string | undefined;
//   showStrokeColorPicker: false | undefined, // 是否显示 线框色选择器
//   fillColor: "rgba(0,0,0,0)" | undefined, // 填充色
//   showFillColorPicker!: false; // 是否显示 填充色选择器
//  // 是否显示 填充色选择器
//   bgColor: "#2F782C" | undefined, // 背景色
//   showBgColorPicker: false | undefined, // 是否显示 背景色选择器
//   lineSize: 1 | undefined, // 线条大小 （线条 and 线框）
//   fontSize: 18 | undefined, // 字体大小
//   selectTool: "" | undefined, // 当前用户选择的绘图工具 画笔：brush 直线：line 矩形：rect 圆形 circle 文本 text
//   mouseFrom: {} | undefined, // 鼠标绘制起点
//   mouseTo: {} | undefined, // 鼠标绘制重点
//   drawingObject: null | undefined, // 保存鼠标未松开时用户绘制的临时图像
//   textObject: null | undefined, // 保存用户创建的文本对象
//   isDrawing: false | undefined, // 当前是否正在绘制图形（画笔，文本模式除外）
//   stateArr: [] | undefined, // 保存画布的操作记录
//   stateIdx: 0 | undefined, // 当前操作步数
//   isRedoing: false // 当前是否在执行撤销或重做操作
//   | undefined // 当前是否在执行撤销或重做操作
//   constructor(canvas: fabric.Canvas) {
//     this.canvas = canvas;
//     this.strokeColor="#000000"; // 线框色

//   }

//    // 初始化画笔工具
//    initBruch() {
//     // 设置绘画模式画笔类型为 铅笔类型
//     this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
//     // 设置画布模式为绘画模式
//     this.canvas.isDrawingMode = true;
//     // 设置绘画模式 画笔颜色与画笔线条大小
//     this.canvas.freeDrawingBrush.color = this.strokeColor;
//     this.canvas.freeDrawingBrush.width = parseInt(this.lineSize, 10);
//   }
// }

import { fabric } from "fabric";

// 初始化画笔工具
export const initBruch = (canvas: fabric.Canvas) => {
  if (canvas) {
    // 设置绘画模式画笔类型为 铅笔类型
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    // 设置画布模式为绘画模式
    canvas.isDrawingMode = true;
    // 设置绘画模式 画笔颜色与画笔线条大小
    canvas.freeDrawingBrush.color = "#000";
    canvas.freeDrawingBrush.width = 5;
  }
};
