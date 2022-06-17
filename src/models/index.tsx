import { paint } from "./paint";

const history = [
  {
    key: "history.curve",
    method: "post",
    initialState: {
      bondName: "1",
    },
  },
  {
    key: "history.balance",
    method: "get",
    url: (payload: any) => {
      return "/api/math/random?count=5";
    },
    reducer: (state: any, action: any) => {
      console.log("reducer--------", state, action);
    },
  },
];

const models = [paint];

export default models;
