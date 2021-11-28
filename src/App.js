import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import Layout from './components/Layout';
import '../src/styles/App.css';
const Landing = lazy(() => import('./pages/Landing'));
const Main = lazy(() => import('./pages/Main'));
const Store = lazy(() => import('./pages/Store'));
const Game = lazy(() => import('./pages/Game'));

const App = () => {
  return (
    <Router>
      <Layout>
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route exact path='/' component={Landing} />
            <Route path='/home' component={Main} />
            <Route path='/store' component={Store} />
            <Route path='/game' component={Game} />
          </Switch>
        </Suspense>
      </Layout>
    </Router>
  );
};

export default App;
