
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import CheckWeather from './CheckWeather';
import Main from './Main';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Main} />
        <Route path="/checkWeather/:cityId" component={CheckWeather} />
      </Switch>
    </Router>
  );
}
