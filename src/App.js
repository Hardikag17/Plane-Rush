import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import Layout from './components/Layout';
import '../src/styles/App.css';
const Landing = lazy(() => import('./pages/Landing'));
const Main = lazy(() => import('./pages/Main'));
const Store = lazy(() => import('./pages/Store'));
const Game = lazy(() => import('./pages/Game'));
const NftDetails = lazy(() => import('./pages/NftDetails'));

const App = () => {
  return (
    <Router>
      <Layout>
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route exact path='/' component={Landing} />
            <Route path='/play' component={Main} />
            <Route path='/Store' component={Store} />
            <Route path='/game' component={Game} />
            <Route path='/details/:id' component={NftDetails} />
          </Switch>
        </Suspense>
      </Layout>
    </Router>
  );
};

export default App;
