import { fabric } from "fabric";

export default class Tool {
  private toolType: string = "PEN";
  public canvas: fabric.Canvas;

  init(canvas: fabric.Canvas, imgUrl?: string, other?: any) {
    this.canvas = canvas;
    if (imgUrl) {
      const { showScale = 1 } = other;
      fabric.Image.fromURL(
        imgUrl,
        (img) => {
          img.scale(showScale);
          img.selectable = false;
          canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
        },
        { crossOrigin: "anonymous" }
      );
    }
    this.addEventListener();
  }

  addEventListener() {
    this.canvas.on("mouse:down", this.onMouseDown.bind(this));
  }

  public onMouseDown(event: MouseEvent): void {
    //
    console.log("e43", event);
  }
}
