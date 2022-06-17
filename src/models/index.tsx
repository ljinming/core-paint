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
    reducer: (state: any, action: any) => {},
  },
];

const models = [history, paint];

export default models;
