import { PaintState } from "./type";

export const paint = [
  {
    key: "paint.tool",
    initialState: {
      select: "PEN",
    },
    reducer: (state: PaintState, action: any) => {
      const lastState = state.tool;
      const { payload = {} } = action;
      return { ...lastState, ...payload };
    },
  },
  {
    key: "paint.straw",
    initialState: {
      strawFlag: false,
      strawColor: "",
    },
    reducer: (state: PaintState, action: any) => {
      const lastState = state.straw;
      const { payload = {} } = action;
      return { ...lastState, ...payload };
    },
  },
];

// paint.tool = 55
