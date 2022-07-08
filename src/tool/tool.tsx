import { fabric } from "fabric";
import Action from "@/action";
import { rgbToHex } from "./colorChange";

export interface Point {
  x: number;
  y: number;
}

export interface Pencil {
  lineWidth: number;
  strokeColor: string;
}

// 随机color
export const getRandomColor = () => {
  return (
    "#" + ("00000" + ((Math.random() * 0x1000000) << 0).toString(16)).substr(-6)
  );
};

// strawColor

export const setStrawColor = (pos: Point) => {
  const ctx = Tool.canvas.getContext();
  const color = getPixelColorOnCanvas(pos, ctx);
  Tool.strawColor = color;
  Tool.strawFlag = false;
  Action.emit("paint.straw", { strawColor: color, strawFlag: false });
};
//鼠标点颜色
export const getPixelColorOnCanvas = (
  pos: Point,
  ctx: CanvasRenderingContext2D
) => {
  const p = ctx.getImageData(pos.x, pos.y, 1, 1).data;
  return rgbToHex(p[0], p[1], p[2], p[3]);
};

export default class Tool {
  //选择的工具
  public toolType: string = "PEN";

  // canvas
  public static canvas: fabric.Canvas;
  static toolType: string;
  static img: fabric.Image;
  static strawColor: string;
  static strawFlag: boolean;
  static canvasObj = [];

  static recordTimer: any;
  static stateArr: any[] = [];
  static stateIdx: any;

  static afterRender() {
    if (this.recordTimer) {
      clearTimeout(this.recordTimer);
      this.recordTimer = null;
    }
    this.recordTimer = setTimeout(() => {
      this.stateArr.push(JSON.stringify(Tool.canvas));
      this.stateIdx++;
    }, 1000);
  }

  // 撤销 或 还原
  static tapHistoryBtn(flag) {
    // let stateIdx = this.stateIdx + flag;
    // console.log("===456", this.stateArr);
    // // 判断是否已经到了第一步操作
    // if (stateIdx < 0) return;
    // // 判断是否已经到了最后一步操作
    // if (stateIdx >= this.stateArr.length) return;
    // if (this.stateArr[stateIdx]) {
    //   this.canvas.loadFromJSON(this.stateArr[stateIdx], () => {});
    //   if (this.canvas.getObjects().length > 0) {
    //     this.canvas.getObjects().forEach((item) => {
    //       item.set("selectable", false);
    //     });
    //   }
    //   this.stateIdx = stateIdx;
    // }

    if (this.canvas) {
      if (flag < 0 && this.canvasObj.length < 10) {
        const removeList =
          this.canvas.getObjects().filter((c) => c.width) || [];
        const tagCanvas = removeList[removeList.length - 1];
        this.canvasObj.push(tagCanvas);
        this.canvas.remove(tagCanvas);
      } else if (flag > 0 && this.canvasObj.length > 0) {
        //回到撤回前一步
        const current = this.canvasObj.pop();
        if (current) {
          this.canvas.add(current);
        }
      }
    }
  }

  //清空画布
  static clearAll() {
    // 获取画布中的所有对象
    if (this.canvas) {
      let children = this.canvas.getObjects();
      console.log("children", children);
      if (children.length > 0) {
        // 移除所有对象
        this.canvas.remove(...children);
      }
    }
  }

  public onMouseDown(options): void {
    //
  }
  public onMouseMove(event: MouseEvent): void {
    //
  }

  public onMouseUp(event: MouseEvent): void {
    //
  }

  public onSelected(event: MouseEvent): void {}

  public onCancelSelected(event: MouseEvent): void {}

  //双击
  public onDbClick(event: MouseEvent): void {}

  public onTouchStart(event: TouchEvent): void {
    //
  }

  public onTouchMove(event: TouchEvent): void {
    //
  }

  public onTouchEnd(event: TouchEvent): void {
    //
  }

  public onKeyDown(event: KeyboardEvent): void {
    //
  }
}
