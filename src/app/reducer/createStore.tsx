import { applyMiddleware, compose, createStore } from "redux";

function createMprStore<S>(opts: any) {
  const { reducers, initialState, sagaMiddleware } = opts;

  let middleware = [];
  if (sagaMiddleware) {
    middleware.push(sagaMiddleware);
  }

  let devTools = () => (n: any) => n;

  if (process.env.NODE_ENV !== "production" && (window as any).____REDUX_DEVTOOLS_EXTENSION__) {
    devTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__;
  }

  const enhancers = [applyMiddleware(...middleware), devTools()];
  // const store = createStore(reducers, initialState, applyMiddleware(...middleware));
  // console.log(store.getState())
  return createStore<S, any, any, any>(reducers, initialState, compose(...enhancers));
}
export default createMprStore;
