import Pencil from "@/pages/content/Pencil";

export const paint = [
  {
    key: "paint.Tool",
    initialState: {
      select: "PEN",
    },
  },
  {
    key: "paint.pencil",
    initialState: {
      fontSize: 5,
      color: "#000",
    },
    reducer: (state: any, action: any) => {
      const lastState = state.pencil;
      const { payload = {} } = action;
      return { ...lastState, ...payload };
    },
  },
];
