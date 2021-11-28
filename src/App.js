import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import '../src/styles/App.css';
import Landing from '../src/Pages/Landing';
import Main from '../src/Pages/Main';
import Store from '../src/Pages/Store';
import NftDetails from '../src/Pages/NftDetails';
import Layout from './components/Layout';

const App = () => {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route exact path='/' component={Landing} />
          <Route path='/play' component={Main} />
          <Route path='/Store' component={Store} />
          <Route path='/store' component={Store} />
          <Route path='/details/:id' component={NftDetails} />
        </Switch>
      </Layout>
    </Router>
  );
};

export default App;
