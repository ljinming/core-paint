import { BrowserRouter, Route, Switch } from "react-router-dom";
import Paint from "@/pages";

function RouteApp() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Paint} />
      </Switch>
    </BrowserRouter>
  );
}

export default RouteApp;
