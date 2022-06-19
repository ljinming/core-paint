import { PaintState, PencilState } from "./type";

export const paint = [
  {
    key: "paint.tool",
    initialState: {
      select: "PEN"
    }
  },
  {
    key: "paint.pencil",
    initialState: {
      fontSize: 5,
      color: "#000"
    },
    reducer: (state: PaintState, action: any) => {
      const lastState = state.pencil;
      const { payload = {} } = action;
      return { ...lastState, ...payload };
    }
  }
];

// paint.tool = 55
