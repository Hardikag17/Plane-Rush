import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Landing from './Pages/Landing';
import Store from './Pages/Store';
import './styles/App.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={Landing} />
        <Route exact path='/store' component={Store} />
      </Switch>
    </Router>
  );
}

export default App;
