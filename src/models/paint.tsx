import { PaintState, PencilState } from "./type";

export const paint = [
  {
    key: "paint.tool",
    initialState: {
      select: "PEN",
    },
    reducer: (state: PaintState, action: any) => {
      const lastState = state.tool;
      console.log("=lastState=", lastState);
      const { payload = {} } = action;
      return { ...lastState, ...payload };
    },
  },
  // {
  //   key: "paint.pencil",
  //   initialState: {
  //     fontSize: 5,
  //     color: "#000"
  //   },
  //   reducer: (state: PaintState, action: any) => {
  //     const lastState = state.pencil;
  //     const { payload = {} } = action;
  //     return { ...lastState, ...payload };
  //   }
  // }
];

// paint.tool = 55
